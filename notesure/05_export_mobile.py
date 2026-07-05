"""
05_export_mobile.py

Exports models/notesure_best.pt -> ONNX (models/notesure.onnx), meeting
PRD requirement NS-06 (on-device inference, <2s latency).

For actual TFLite conversion (Android/CoreML paths diverge):
    1. This script produces ONNX.
    2. Convert ONNX -> TF SavedModel with onnx2tf (pip install onnx2tf), then
       TF SavedModel -> .tflite with the standard TFLiteConverter.
    See the printed instructions at the end of this script.

Run:
    python scripts/05_export_mobile.py --img-size 380
"""

import argparse
from pathlib import Path

import timm
import torch

MODEL_PATH = Path("models/notesure_best.pt")
ONNX_OUT = Path("models/notesure.onnx")


def main(img_size: int):
    ckpt = torch.load(MODEL_PATH, map_location="cpu")
    classes = ckpt["classes"]
    model = timm.create_model("efficientnet_b0", pretrained=False, num_classes=len(classes))
    model.load_state_dict(ckpt["model_state"])
    model.eval()

    dummy = torch.randn(1, 3, img_size, img_size)
    torch.onnx.export(
        model, dummy, str(ONNX_OUT),
        input_names=["input"], output_names=["logits"],
        dynamic_axes={"input": {0: "batch"}, "logits": {0: "batch"}},
        opset_version=17,
    )
    print(f"Exported ONNX -> {ONNX_OUT}")
    print(f"Classes (index order matters for inference): {classes}")

    print("""
Next steps for on-device deployment:

  Android (TFLite):
    pip install onnx2tf
    onnx2tf -i models/notesure.onnx -o models/tf_saved_model
    python -c "
import tensorflow as tf
conv = tf.lite.TFLiteConverter.from_saved_model('models/tf_saved_model')
conv.optimizations = [tf.lite.Optimize.DEFAULT]
open('models/notesure.tflite','wb').write(conv.convert())
"

  iOS (CoreML):
    pip install coremltools
    python -c "
import coremltools as ct
mlmodel = ct.convert('models/notesure.onnx', convert_to='mlprogram')
mlmodel.save('models/notesure.mlpackage')
"

  Quick local test without a phone (ONNX Runtime, CPU or CUDA EP):
    python scripts/06_infer.py --image path/to/note.jpg
""")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--img-size", type=int, default=380)
    main(ap.parse_args().img_size)
