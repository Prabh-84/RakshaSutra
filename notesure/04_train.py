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
from pathlib import Path

import os
import shutil

import timm
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter
from torchvision import datasets, transforms
from tqdm import tqdm

DATA_ROOT = Path("notesure_data/processed")
MODEL_OUT = Path("models")
MODEL_OUT.mkdir(exist_ok=True)


def link_or_copy(src: Path, dst: Path):
    """Windows blocks symlinks for non-admin users, so try a hardlink first
    (works without admin on the same drive), and fall back to a real copy
    if that fails (e.g. across drives)."""
    try:
        os.link(src, dst)
    except OSError:
        shutil.copy2(src, dst)


def build_loaders(img_size: int, batch_size: int):
    train_tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomHorizontalFlip(0.3),
        transforms.ColorJitter(0.15, 0.15, 0.15, 0.02),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    val_tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    # ImageFolder expects: DATA_ROOT/<class_name>/*.jpg
    # Flatten our nested structure (e.g. genuine/100/, synthetic_suspect/thread_removed/)
    # into a single ImageFolder-compatible tree once, via symlinks:
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

    full_ds = datasets.ImageFolder(str(flat_root), transform=train_tf)
    n_val = max(1, int(0.15 * len(full_ds)))
    n_train = len(full_ds) - n_val
    train_ds, val_ds = torch.utils.data.random_split(full_ds, [n_train, n_val])
    val_ds.dataset.transform = val_tf  # note: shared underlying dataset, fine for this scale

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True,
                               num_workers=6, pin_memory=True, persistent_workers=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False,
                             num_workers=4, pin_memory=True, persistent_workers=True)

    # Class weights computed from the TRAIN split only, to counter severe
    # imbalance (e.g. 39 fake_kaggle images vs ~9000 per synthetic class) —
    # otherwise the model learns to ignore rare-but-critical classes like
    # real fake-note samples.
    train_targets = [full_ds.targets[i] for i in train_ds.indices]
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
        with torch.no_grad():
            for imgs, labels in tqdm(val_loader, desc=f"Epoch {epoch+1}/{args.epochs} [val]"):
                imgs, labels = imgs.to(device), labels.to(device)
                with torch.autocast(device_type="cuda", enabled=(device == "cuda")):
                    out = model(imgs)
                preds = out.argmax(dim=1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)
        val_acc = correct / total

        print(f"Epoch {epoch+1}: train_loss={train_loss:.4f} val_acc={val_acc:.4f}")
        writer.add_scalar("loss/train", train_loss, epoch)
        writer.add_scalar("acc/val", val_acc, epoch)

        if val_acc > best_acc:
            best_acc = val_acc
            torch.save({"model_state": model.state_dict(), "classes": classes},
                       MODEL_OUT / "notesure_best.pt")
            print(f"  -> new best, saved to {MODEL_OUT/'notesure_best.pt'}")

    writer.close()
    print(f"\nTraining done. Best val acc: {best_acc:.4f}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--epochs", type=int, default=20)
    ap.add_argument("--batch-size", type=int, default=32)
    ap.add_argument("--img-size", type=int, default=380)
    ap.add_argument("--lr", type=float, default=3e-4)
    main(ap.parse_args())