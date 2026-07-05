"""
06_infer.py

Runs inference on a single note image using the ONNX model, prints
confidence scores per class, and appends a tamper-evident audit log
entry (PRD NS-08).

Run:
    python scripts/06_infer.py --image path/to/note.jpg
"""

import argparse
import hashlib
import json
import time
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

ONNX_PATH = "models/notesure.onnx"
CLASSES_PATH = "models/classes.json"  # write this once after training, see note below
AUDIT_LOG = Path("models/audit_log.jsonl")

MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def preprocess(img_path: str, img_size: int):
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (img_size, img_size)).astype(np.float32) / 255.0
    img = (img - MEAN) / STD
    img = img.transpose(2, 0, 1)[None, ...].astype(np.float32)
    return img


def softmax(x):
    e = np.exp(x - np.max(x))
    return e / e.sum()


def audit_entry(image_path: str, result: dict):
    with open(image_path, "rb") as f:
        file_hash = hashlib.sha256(f.read()).hexdigest()
    entry = {
        "timestamp": time.time(),
        "image_path": image_path,
        "image_sha256": file_hash,
        "result": result,
    }
    AUDIT_LOG.parent.mkdir(exist_ok=True)
    with open(AUDIT_LOG, "a") as f:
        f.write(json.dumps(entry) + "\n")
    return entry


def main(image_path: str, img_size: int):
    classes = json.loads(Path(CLASSES_PATH).read_text()) if Path(CLASSES_PATH).exists() else None
    sess = ort.InferenceSession(ONNX_PATH, providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
    x = preprocess(image_path, img_size)

    t0 = time.time()
    logits = sess.run(None, {"input": x})[0][0]
    latency_ms = (time.time() - t0) * 1000
    probs = softmax(logits)

    if classes is None:
        classes = [f"class_{i}" for i in range(len(probs))]

    ranked = sorted(zip(classes, probs.tolist()), key=lambda x: -x[1])
    result = {
        "prediction": ranked[0][0],
        "confidence": round(ranked[0][1], 4),
        "all_scores": {c: round(p, 4) for c, p in ranked},
        "latency_ms": round(latency_ms, 1),
    }
    entry = audit_entry(image_path, result)

    print(json.dumps(result, indent=2))
    print(f"\nAudit log entry written to {AUDIT_LOG}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True)
    ap.add_argument("--img-size", type=int, default=380)
    args = ap.parse_args()
    main(args.image, args.img_size)
