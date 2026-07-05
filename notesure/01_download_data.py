"""
01_download_data.py

Downloads the public datasets into notesure_data/raw/.

SETUP (one-time):
1. Go to kaggle.com -> your profile -> Account -> "Create New API Token"
   This downloads kaggle.json
2. Put it at: C:\\Users\\<you>\\.kaggle\\kaggle.json (Windows)
   or ~/.kaggle/kaggle.json (Linux/Mac)

Run:
    python scripts/01_download_data.py
"""

import os
import subprocess
import zipfile
from pathlib import Path

RAW_DIR = Path("notesure_data/raw")
RAW_DIR.mkdir(parents=True, exist_ok=True)

DATASETS = {
    "real_vs_fake_1": "preetrank/indian-currency-real-vs-fake-notes-dataset",
    "fake_currency_2": "lekhansaathvik/fake-currency-dataset",
    # Search Kaggle and add the exact slug for the denomination dataset
    # and the Mendeley damaged-notes dataset (or download that one manually
    # from ScienceDirect "Data in Brief" and drop it in notesure_data/raw/damaged/)
}


def download(slug: str, out_name: str):
    target = RAW_DIR / out_name
    target.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {slug} -> {target}")
    subprocess.run(
        ["kaggle", "datasets", "download", "-d", slug, "-p", str(target)],
        check=True,
    )
    for zf in target.glob("*.zip"):
        with zipfile.ZipFile(zf, "r") as z:
            z.extractall(target)
        zf.unlink()
    print(f"Done: {out_name}")


if __name__ == "__main__":
    for name, slug in DATASETS.items():
        try:
            download(slug, name)
        except subprocess.CalledProcessError as e:
            print(f"FAILED {slug}: {e}. Check kaggle.json is set up, or download manually.")

    print("\nManual step: place the Mendeley 'damaged Indian banknotes' dataset "
          "(from ScienceDirect Data in Brief) into notesure_data/raw/damaged/")
