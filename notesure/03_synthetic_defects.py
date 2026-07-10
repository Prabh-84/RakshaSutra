"""
03_synthetic_defects.py

Generates labeled synthetic 'suspect note' defects from genuine images,
one subfolder per defect type. This is what fills the gap where no
public forensic FICN dataset exists (see PRD NS-02/NS-03/NS-04).

Defect classes:
    microprint_blur       - gaussian blur / jpeg-artifact on note (simulates
                             low-res offset printing losing microprint detail)
    thread_colorshift     - hue-shift a vertical strip simulating a
                             miscolored/fake security thread
    thread_removed        - inpaint over the security-thread strip
    serial_font_shift     - perturb a corner region (font-substitution proxy)
    print_quality_shift   - global hue/saturation/contrast perturbation

Output:
    notesure_data/processed/synthetic_suspect/<defect_type>/*.jpg

Run:
    python scripts/03_synthetic_defects.py --n-per-image 2
"""

import argparse
import random
from pathlib import Path

import cv2
import numpy as np
from tqdm import tqdm

GENUINE_DIR = Path("notesure_data/processed/genuine")
OUT_DIR = Path("notesure_data/processed/synthetic_suspect")


def microprint_blur(img):
    k = random.choice([3, 5, 7])
    out = cv2.GaussianBlur(img, (k, k), 0)
    # re-encode through low-quality JPEG in memory to add compression artifacts
    ok, enc = cv2.imencode(".jpg", out, [cv2.IMWRITE_JPEG_QUALITY, random.randint(25, 45)])
    return cv2.imdecode(enc, cv2.IMREAD_COLOR) if ok else out


def thread_colorshift(img):
    h, w = img.shape[:2]
    x0 = int(w * random.uniform(0.55, 0.65))  # approx security thread band
    strip_w = max(4, int(w * 0.02))
    strip = img[:, x0:x0 + strip_w].copy()
    hsv = cv2.cvtColor(strip, cv2.COLOR_BGR2HSV).astype(np.int32)
    hsv[..., 0] = (hsv[..., 0] + random.randint(40, 90)) % 180
    strip_shifted = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
    out = img.copy()
    out[:, x0:x0 + strip_w] = strip_shifted
    return out


def thread_removed(img):
    h, w = img.shape[:2]
    x0 = int(w * random.uniform(0.55, 0.65))
    strip_w = max(4, int(w * 0.02))
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[:, x0:x0 + strip_w] = 255
    return cv2.inpaint(img, mask, 5, cv2.INPAINT_TELEA)


def serial_font_shift(img):
    h, w = img.shape[:2]
    # bottom-right corner proxy region for serial number
    x0, y0 = int(w * 0.7), int(h * 0.8)
    region = img[y0:h, x0:w].copy()
    # affine warp to fake font/spacing distortion
    rows, cols = region.shape[:2]
    src = np.float32([[0, 0], [cols - 1, 0], [0, rows - 1]])
    shift = random.uniform(-0.08, 0.08) * cols
    dst = np.float32([[0, 0], [cols - 1 + shift, 0], [0, rows - 1]])
    M = cv2.getAffineTransform(src, dst)
    warped = cv2.warpAffine(region, M, (cols, rows), borderMode=cv2.BORDER_REPLICATE)
    out = img.copy()
    out[y0:h, x0:w] = warped
    return out


def print_quality_shift(img):
    """Simulate actual offset-printing defects — NOT generic camera variation.

    Randomly applies 1-2 of the following per image:
      • Halftone dot overlay — simulates visible dot matrix from low-DPI printing
      • Color channel mis-registration — shifts one color channel by a few pixels,
        simulating a printing press alignment error
      • Posterization — reduces color depth to simulate low-quality inkjet output
      • Moiré pattern — overlays an interference pattern from scanning a printed copy
    """
    h, w = img.shape[:2]
    out = img.copy()

    effects = random.sample(
        ["halftone", "misregistration", "posterize", "moire"],
        k=random.randint(1, 2),
    )

    for effect in effects:
        if effect == "halftone":
            # Simulate visible halftone dots from low-DPI offset printing
            dot_spacing = random.randint(3, 6)
            dot_radius = max(1, dot_spacing // 3)
            # Vectorized: create one small tile and repeat it (~100x faster
            # than the naive per-pixel cv2.circle loop)
            tile = np.zeros((dot_spacing, dot_spacing), dtype=np.uint8)
            cv2.circle(tile, (dot_spacing // 2, dot_spacing // 2),
                       dot_radius, 255, -1)
            reps_y = (h + dot_spacing - 1) // dot_spacing
            reps_x = (w + dot_spacing - 1) // dot_spacing
            mask = np.tile(tile, (reps_y, reps_x))[:h, :w]
            # Blend: darken where there are no dots (ink-free areas)
            darkened = (out.astype(np.float32) * 0.7).astype(np.uint8)
            mask_3ch = cv2.merge([mask, mask, mask])
            out = np.where(mask_3ch > 0, out, darkened)

        elif effect == "misregistration":
            # Shift one color channel by a few pixels — printing press misalignment
            channel = random.randint(0, 2)
            dx = random.choice([-3, -2, 2, 3])
            dy = random.choice([-2, -1, 1, 2])
            M = np.float32([[1, 0, dx], [0, 1, dy]])
            shifted = cv2.warpAffine(out[:, :, channel], M, (w, h),
                                     borderMode=cv2.BORDER_REPLICATE)
            out[:, :, channel] = shifted

        elif effect == "posterize":
            # Reduce color depth to simulate low-quality inkjet/laser output
            levels = random.choice([4, 6, 8])
            factor = 256.0 / levels
            out = (np.floor(out.astype(np.float32) / factor) * factor).astype(np.uint8)

        elif effect == "moire":
            # Overlay a sinusoidal interference pattern (scan-of-a-print artifact)
            freq = random.uniform(0.05, 0.15)
            angle = random.uniform(0, np.pi)
            xs = np.arange(w)
            ys = np.arange(h)
            xv, yv = np.meshgrid(xs, ys)
            pattern = np.sin(2 * np.pi * freq * (xv * np.cos(angle) + yv * np.sin(angle)))
            # Scale pattern to a subtle intensity modulation
            amplitude = random.uniform(15, 35)
            pattern = (pattern * amplitude).astype(np.float32)
            out = np.clip(out.astype(np.float32) + pattern[..., None], 0, 255).astype(np.uint8)

    return out


DEFECTS = {
    "microprint_blur": microprint_blur,
    "thread_colorshift": thread_colorshift,
    "thread_removed": thread_removed,
    "serial_font_shift": serial_font_shift,
    "print_quality_shift": print_quality_shift,
}


def main(n_per_image: int):
    genuine_files = [p for p in GENUINE_DIR.rglob("*") if p.suffix.lower() in {".jpg", ".jpeg", ".png"}]
    if not genuine_files:
        print(f"No genuine images found in {GENUINE_DIR}. Run 02_preprocess.py first.")
        return

    for defect_name in DEFECTS:
        (OUT_DIR / defect_name).mkdir(parents=True, exist_ok=True)

    for p in tqdm(genuine_files, desc="Generating synthetic defects"):
        img = cv2.imread(str(p))
        if img is None:
            continue
        for defect_name, fn in DEFECTS.items():
            for i in range(n_per_image):
                out = fn(img)
                out_path = OUT_DIR / defect_name / f"{p.stem}_{defect_name}_{i}.jpg"
                cv2.imwrite(str(out_path), out)

    print(f"\nSynthetic defects written to {OUT_DIR}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--n-per-image", type=int, default=2)
    args = ap.parse_args()
    main(args.n_per_image)
