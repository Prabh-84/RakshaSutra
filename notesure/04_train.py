"""
04_train.py

Trains an EfficientNet-B0 classifier (timm) on:
    notesure_data/processed/genuine/*
    notesure_data/processed/fake_kaggle/*
    notesure_data/processed/damaged/*
    notesure_data/processed/synthetic_suspect/<defect_type>/*

Each subfolder-of-subfolders becomes a class. Uses mixed precision (AMP),
tuned for a single RTX 4070 (12GB VRAM).

Run:
    python scripts/04_train.py --epochs 20 --batch-size 32 --img-size 380

Monitor:
    tensorboard --logdir runs
"""

import argparse
import io
import json
import random
from collections import defaultdict
from pathlib import Path

import os
import shutil

import timm
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Subset
from torch.utils.tensorboard import SummaryWriter
from torchvision import datasets, transforms
from tqdm import tqdm
from PIL import Image as PILImage
from sklearn.metrics import classification_report, confusion_matrix

DATA_ROOT = Path("notesure_data/processed")
MODEL_OUT = Path("models")
MODEL_OUT.mkdir(exist_ok=True)

# Synthetic defect class names — must match 03_synthetic_defects.py DEFECTS dict.
SYNTHETIC_CLASSES = frozenset({
    'microprint_blur', 'print_quality_shift', 'serial_font_shift',
    'thread_colorshift', 'thread_removed',
})


def link_or_copy(src: Path, dst: Path):
    """Windows blocks symlinks for non-admin users, so try a hardlink first
    (works without admin on the same drive), and fall back to a real copy
    if that fails (e.g. across drives)."""
    try:
        os.link(src, dst)
    except OSError:
        shutil.copy2(src, dst)


class RandomJPEGCompression:
    """Re-encode through JPEG in memory at a random quality level.
    Simulates the compression artifacts from phone-camera capture."""
    def __init__(self, quality_range=(30, 85)):
        self.quality_range = quality_range

    def __call__(self, img):
        quality = random.randint(*self.quality_range)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=quality)
        buf.seek(0)
        return PILImage.open(buf).convert("RGB")


def build_loaders(img_size: int, batch_size: int):
    train_tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomHorizontalFlip(0.3),
        # Aggressive color jitter — covers the full range of phone-camera
        # lighting/white-balance variation so the model can't confuse normal
        # photographic artifacts with the print_quality_shift defect class.
        transforms.ColorJitter(0.4, 0.4, 0.4, 0.1),
        transforms.RandomPerspective(distortion_scale=0.15, p=0.3),
        transforms.RandomRotation(degrees=8),
        transforms.GaussianBlur(kernel_size=3, sigma=(0.1, 1.5)),
        RandomJPEGCompression(quality_range=(30, 85)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    val_tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    # ── Flatten nested structure into ImageFolder-compatible tree ─────────
    flat_root = DATA_ROOT / "_flat"
    if not flat_root.exists():
        flat_root.mkdir()
        for top in ["genuine", "fake_kaggle", "damaged", "synthetic_suspect"]:
            top_dir = DATA_ROOT / top
            if not top_dir.exists():
                continue
            if top in ("genuine",):
                # collapse denominations: all genuine notes = one class "genuine"
                cls_dir = flat_root / "genuine"
                cls_dir.mkdir(exist_ok=True)
                for img in top_dir.rglob("*.jpg"):
                    link = cls_dir / f"{img.parent.name}_{img.name}"
                    if not link.exists():
                        link_or_copy(img.resolve(), link)
            else:
                for sub in top_dir.iterdir():
                    if not sub.is_dir():
                        continue
                    cls_name = sub.name if top == "synthetic_suspect" else top
                    cls_dir = flat_root / cls_name
                    cls_dir.mkdir(exist_ok=True)
                    for img in sub.rglob("*.jpg"):
                        link = cls_dir / img.name
                        if not link.exists():
                            link_or_copy(img.resolve(), link)

    # ── Note-level train/val split (prevents data leakage) ───────────────
    #
    # Problem: random_split() assigns individual images independently, so a
    # genuine note and its synthetic derivatives can land in different splits.
    # This leaks note-specific textures into the val set, inflating accuracy.
    #
    # Fix: group all images derived from the same source note, then split
    # at the GROUP level so every derivative stays in the same split.

    # 1. Map genuine flat-filenames to their original stems
    genuine_dir = DATA_ROOT / "genuine"
    genuine_stem_map = {}  # flat_stem -> source_stem
    if genuine_dir.exists():
        for img in genuine_dir.rglob("*"):
            if img.suffix.lower() in {".jpg", ".jpeg", ".png"}:
                flat_stem = f"{img.parent.name}_{img.stem}"
                genuine_stem_map[flat_stem] = img.stem

    # 2. Load dataset for canonical class list and sample paths (no transform)
    full_ds = datasets.ImageFolder(str(flat_root))

    # 3. Group every image by its source note
    source_groups = defaultdict(list)
    for idx, (path, class_idx) in enumerate(full_ds.samples):
        stem = Path(path).stem
        class_name = full_ds.classes[class_idx]

        if class_name == "genuine":
            src = genuine_stem_map.get(stem, stem)
            source_groups[f"note:{src}"].append(idx)
        elif class_name in SYNTHETIC_CLASSES:
            # Filename convention: {source_stem}_{defect_name}_{variant}
            suffix = f"_{class_name}_"
            pos = stem.rfind(suffix)
            src = stem[:pos] if pos != -1 else stem
            source_groups[f"note:{src}"].append(idx)
        else:
            # fake_kaggle, damaged — each file is independent
            source_groups[f"indep:{class_name}:{stem}"].append(idx)

    # 4. Deterministic split at the group level (seed=42 for reproducibility)
    rng = random.Random(42)
    group_ids = sorted(source_groups.keys())
    rng.shuffle(group_ids)
    n_val_groups = max(1, int(0.15 * len(group_ids)))
    val_group_set = set(group_ids[:n_val_groups])

    train_indices, val_indices = [], []
    for gid in group_ids:
        target = val_indices if gid in val_group_set else train_indices
        target.extend(source_groups[gid])

    # 5. Print split statistics
    note_groups = [g for g in group_ids if g.startswith("note:")]
    val_notes = sum(1 for g in note_groups if g in val_group_set)
    train_notes = len(note_groups) - val_notes
    print(f"\n── Note-level split (leakage-free) ──")
    print(f"  Source-note groups: {len(note_groups)} notes + "
          f"{len(group_ids) - len(note_groups)} independent images")
    print(f"  Train: {len(train_indices)} images ({train_notes} notes)")
    print(f"  Val:   {len(val_indices)} images ({val_notes} notes)")
    print(f"  Note overlap between splits: 0 (by construction)\n")

    # 6. Separate ImageFolder instances → independent transforms
    #    (fixes the bug where val_ds.dataset.transform = val_tf silently
    #    killed ALL training augmentation via the shared dataset reference)
    train_base = datasets.ImageFolder(str(flat_root), transform=train_tf)
    val_base = datasets.ImageFolder(str(flat_root), transform=val_tf)

    train_ds = Subset(train_base, train_indices)
    val_ds = Subset(val_base, val_indices)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True,
                               num_workers=6, pin_memory=True, persistent_workers=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False,
                             num_workers=4, pin_memory=True, persistent_workers=True)

    # Class weights computed from the TRAIN split only, to counter severe
    # imbalance (e.g. 39 fake_kaggle images vs ~9000 per synthetic class) —
    # otherwise the model learns to ignore rare-but-critical classes like
    # real fake-note samples.
    train_targets = [full_ds.targets[i] for i in train_indices]
    class_counts = torch.bincount(torch.tensor(train_targets), minlength=len(full_ds.classes)).float()
    class_counts = torch.clamp(class_counts, min=1.0)
    # Full inverse-frequency weighting (dataset_size / (n_classes * count)) is
    # too aggressive when one class has ~100 images and another has ~9000 —
    # it overcorrects and makes the model trigger-happy on the rare class,
    # spiking false positives elsewhere. Use sqrt-dampened weights instead,
    # and cap the max ratio so no single class dominates the loss.
    raw_weights = class_counts.sum() / (len(full_ds.classes) * class_counts)
    class_weights = torch.sqrt(raw_weights)
    max_ratio = 4.0
    class_weights = torch.clamp(class_weights, max=max_ratio * class_weights.min())

    return train_loader, val_loader, full_ds.classes, class_weights


def main(args):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Device: {device}")
    if device == "cuda":
        print(f"GPU: {torch.cuda.get_device_name(0)}")

    train_loader, val_loader, classes, class_weights = build_loaders(args.img_size, args.batch_size)
    print(f"Classes ({len(classes)}): {classes}")
    print("Class weights:", dict(zip(classes, [round(w, 2) for w in class_weights.tolist()])))
    class_weights = class_weights.to(device)

    model = timm.create_model("efficientnet_b0", pretrained=True, num_classes=len(classes))
    model.to(device)

    opt = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-4)
    sched = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=args.epochs)
    criterion = nn.CrossEntropyLoss(weight=class_weights, label_smoothing=0.05)
    scaler = torch.cuda.amp.GradScaler(enabled=(device == "cuda"))

    writer = SummaryWriter("runs/notesure")
    best_acc = 0.0

    for epoch in range(args.epochs):
        model.train()
        running_loss = 0.0
        for imgs, labels in tqdm(train_loader, desc=f"Epoch {epoch+1}/{args.epochs} [train]"):
            imgs, labels = imgs.to(device, non_blocking=True), labels.to(device, non_blocking=True)
            opt.zero_grad(set_to_none=True)
            with torch.autocast(device_type="cuda", enabled=(device == "cuda")):
                out = model(imgs)
                loss = criterion(out, labels)
            scaler.scale(loss).backward()
            scaler.step(opt)
            scaler.update()
            running_loss += loss.item() * imgs.size(0)
        sched.step()
        train_loss = running_loss / len(train_loader.dataset)

        model.eval()
        correct, total = 0, 0
        all_preds, all_labels = [], []
        with torch.no_grad():
            for imgs, labels in tqdm(val_loader, desc=f"Epoch {epoch+1}/{args.epochs} [val]"):
                imgs, labels = imgs.to(device), labels.to(device)
                with torch.autocast(device_type="cuda", enabled=(device == "cuda")):
                    out = model(imgs)
                preds = out.argmax(dim=1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)
                all_preds.extend(preds.cpu().tolist())
                all_labels.extend(labels.cpu().tolist())
        val_acc = correct / total

        print(f"Epoch {epoch+1}: train_loss={train_loss:.4f} val_acc={val_acc:.4f}")

        # Per-class metrics — exposes class-level failures that overall accuracy hides
        print(classification_report(
            all_labels, all_preds, target_names=classes, zero_division=0
        ))
        cm = confusion_matrix(all_labels, all_preds)
        print("Confusion matrix (rows=true, cols=pred):")
        print(cm)

        writer.add_scalar("loss/train", train_loss, epoch)
        writer.add_scalar("acc/val", val_acc, epoch)

        if val_acc > best_acc:
            best_acc = val_acc
            torch.save({"model_state": model.state_dict(), "classes": classes},
                       MODEL_OUT / "notesure_best.pt")
            # Auto-save classes.json so inference always has the correct class order
            (MODEL_OUT / "classes.json").write_text(json.dumps(classes))
            print(f"  -> new best, saved to {MODEL_OUT/'notesure_best.pt'} + classes.json")

    writer.close()
    print(f"\nTraining done. Best val acc: {best_acc:.4f}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--epochs", type=int, default=20)
    ap.add_argument("--batch-size", type=int, default=32)
    ap.add_argument("--img-size", type=int, default=380)
    ap.add_argument("--lr", type=float, default=3e-4)
    main(ap.parse_args())