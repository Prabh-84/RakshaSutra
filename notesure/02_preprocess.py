"""
02_preprocess.py

Walks notesure_data/raw/*, standardizes images, and builds:

    notesure_data/processed/
        genuine/<denom>/*.jpg
        fake_kaggle/*.jpg
        damaged/*.jpg

Also produces denomination-agnostic 512x512 crops for whole-note
classification, plus a metadata CSV.

Adjust RAW_MAP below to match the actual folder names you get after
running 01_download_data.py (Kaggle dataset internal structures vary,
so inspect notesure_data/raw/ once and edit the glob patterns).

Run:
    python scripts/02_preprocess.py
"""

import csv
import hashlib
from pathlib import Path
import cv2
from tqdm import tqdm

RAW = Path("notesure_data/raw")
OUT = Path("notesure_data/processed")
IMG_SIZE = 512

OUT_GENUINE = OUT / "genuine"
OUT_FAKE = OUT / "fake_kaggle"
OUT_DAMAGED = OUT / "damaged"
for d in (OUT_GENUINE, OUT_FAKE, OUT_DAMAGED):
    d.mkdir(parents=True, exist_ok=True)

VALID_EXT = {".jpg", ".jpeg", ".png", ".bmp"}


def is_image(p: Path) -> bool:
    return p.suffix.lower() in VALID_EXT


def resize_and_save(src: Path, dst: Path):
    img = cv2.imread(str(src))
    if img is None:
        return False
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE), interpolation=cv2.INTER_AREA)
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        # Avoid silently overwriting a different source image that happens
        # to share the same filename (common across Kaggle dataset dumps).
        h = hashlib.md5(str(src).encode()).hexdigest()[:8]
        dst = dst.with_name(f"{dst.stem}_{h}{dst.suffix}")
    cv2.imwrite(str(dst), img)
    return True


FAKE_TOKENS = {"fake", "fakes", "counterfeit", "counterfeits"}
REAL_TOKENS = {"real", "reals", "genuine", "genuines"}


def process_folder(src_folder: Path, dst_folder: Path, label_prefix: str, rows: list):
    if not src_folder.exists():
        print(f"  [skip] {src_folder} not found")
        return
    files = [p for p in src_folder.rglob("*") if is_image(p)]
    for p in tqdm(files, desc=str(src_folder)):
        # Check individual path SEGMENTS (not the whole path as one string),
        # and exclude the top-level source folder name itself, since dataset
        # folder names like "real_vs_fake_1" would otherwise falsely match
        # "fake" for every single file inside them.
        rel_parts = p.relative_to(src_folder).parts
        segment_words = set()
        for part in rel_parts[:-1]:  # exclude the filename itself
            for token in part.lower().replace("-", "_").split("_"):
                segment_words.add(token)

        if segment_words & FAKE_TOKENS:
            label = "fake"
        elif segment_words & REAL_TOKENS:
            label = "genuine"
        else:
            label = label_prefix
        dst = dst_folder / label / p.name
        ok = resize_and_save(p, dst)
        if ok:
            rows.append({"path": str(dst), "label": label, "source": str(src_folder)})


if __name__ == "__main__":
    rows = []
    process_folder(RAW / "real_vs_fake_1", OUT, "real_vs_fake_1", rows)
    process_folder(RAW / "fake_currency_2", OUT_FAKE, "fake", rows)
    process_folder(RAW / "damaged", OUT_DAMAGED, "damaged", rows)

    meta_path = OUT / "metadata.csv"
    with open(meta_path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["path", "label", "source"])
        w.writeheader()
        w.writerows(rows)

    print(f"\nProcessed {len(rows)} images. Metadata -> {meta_path}")
    print("Inspect notesure_data/processed/ and fix label folders by hand where "
          "the heuristic guessed wrong before training.")