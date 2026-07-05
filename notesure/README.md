# NoteSure — Counterfeit Currency Detection (RakshaSutra Module 2)

Local build plan for an RTX 4070 (12GB VRAM), with a Roboflow-based
alternative if you'd rather not manage the training loop yourself.

---

## 0. What this actually trains

There's no public dataset of real forensic FICN, so this pipeline trains on:
1. **Genuine notes** (real Kaggle/IIIT data) — the model learns real note structure.
2. **Kaggle "fake" labeled images** — real/fake classifier signal, quality varies.
3. **Damaged/worn genuine notes** (Mendeley) — hard negatives, prevents the model
   learning "worn = fake."
4. **Synthetic suspect notes** — genuine notes with programmatically injected
   defects (blurred microprint, shifted security-thread color, removed thread,
   warped serial number, print-quality shift) — this directly operationalizes
   PRD features NS-02/NS-03/NS-04 as their own labeled classes instead of one
   opaque "fake" bucket.

State this framing explicitly in your deck: *"structural genuine-note
understanding + synthetic defect injection; production would fine-tune on
RBI/bank forensic FICN specimens under MoU."* This is honest and, per the
judging criteria (technical excellence, auditability), a stronger story than
claiming to have real counterfeit training data.

---

## Path A — Local (RTX 4070)

### 1. Environment setup

```bash
# Windows: install NVIDIA driver 551+ and CUDA 12.1 toolkit first
# https://developer.nvidia.com/cuda-12-1-0-download-archive

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/WSL

pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt
```

Verify GPU is visible:
```bash
python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```
Should print `True NVIDIA GeForce RTX 4070`.

### 2. Get the data

```bash
# One-time: place kaggle.json in ~/.kaggle/ (see script docstring)
python scripts/01_download_data.py
```
Kaggle dataset internal folder structures vary — after this runs once,
open `notesure_data/raw/` and check what actually landed, then adjust the
glob patterns in `scripts/02_preprocess.py` if needed. Manually download
the Mendeley damaged-notes dataset (ScienceDirect *Data in Brief*, 2023)
and drop it in `notesure_data/raw/damaged/`.

### 3. Preprocess

```bash
python scripts/02_preprocess.py
```
Produces `notesure_data/processed/{genuine,fake_kaggle,damaged}/` at 512x512,
plus `metadata.csv`. **Spot-check the label folders** — the label heuristic
in the script is crude (keyword matching on filenames), fix misclassified
images by hand before training.

### 4. Generate synthetic counterfeits

```bash
python scripts/03_synthetic_defects.py --n-per-image 2
```
Produces `notesure_data/processed/synthetic_suspect/<defect_type>/`.

### 5. Train

```bash
python scripts/04_train.py --epochs 20 --batch-size 32 --img-size 380
```
- RTX 4070 (12GB) comfortably handles EfficientNet-B0 at batch 32, img 380,
  with AMP. If you hit OOM, drop `--batch-size` to 16 or `--img-size` to 300.
- Expect ~1-3 min/epoch depending on dataset size after step 4.
- Watch progress live:
  ```bash
  tensorboard --logdir runs
  ```
  then open http://localhost:6006
- Best checkpoint saved to `models/notesure_best.pt`.

After training finishes, save the class list for inference:
```bash
python -c "
import torch, json
ckpt = torch.load('models/notesure_best.pt', map_location='cpu')
json.dump(ckpt['classes'], open('models/classes.json','w'))
print(ckpt['classes'])
"
```

### 6. Export for mobile (PRD NS-06, <2s inference)

```bash
python scripts/05_export_mobile.py --img-size 380
```
Produces `models/notesure.onnx`. Follow the printed instructions to go
ONNX -> TFLite (Android) or ONNX -> CoreML (iOS).

### 7. Test inference + audit trail (PRD NS-08)

```bash
python scripts/06_infer.py --image notesure_data/processed/genuine/some_note.jpg
```
Prints confidence scores per class and appends a SHA-256-hashed,
timestamped entry to `models/audit_log.jsonl` — this is your
"tamper-evident audit log" deliverable for evidentiary use.

---

## Path B — Roboflow (faster to a demo, less control)

Use this if you want a working detector today without managing the
training loop, and you're fine with a hosted model for the demo.

1. Create a free Roboflow account -> New Project -> **Classification** project
   (or **Object Detection** if you want to localize the security thread /
   microprint region on the note, not just classify the whole note).
2. Upload:
   - genuine note images (from `notesure_data/processed/genuine/`)
   - fake-labeled images (from `notesure_data/processed/fake_kaggle/`)
   - your synthetic suspect images from step 4 above, one class per defect
     type — Roboflow accepts pre-labeled folders as-is on upload.
3. Roboflow's augmentation step can add its own blur/rotation/exposure
   jitter on top of what `03_synthetic_defects.py` already generated —
   keep it light (don't double up blur augmentation too aggressively).
4. Train inside Roboflow (pick "Fast" for a demo-grade model, or export the
   dataset and train locally with the script above for better control/accuracy).
5. Roboflow gives you:
   - A hosted inference API endpoint (good for a quick demo video)
   - An exportable model (ONNX / TFLite / CoreML) if you want to swap it
     into `scripts/06_infer.py` in place of your locally trained one
6. For the "Bank Machine Integration SDK" (NS-07) deliverable, Roboflow's
   REST API is actually a reasonable stand-in to demo POS/SDK integration
   without building your own inference server.

**Recommendation for a hackathon:** use Roboflow to get a demo-able detector
running in hours, and in parallel run Path A locally for a higher-accuracy
model + the audit-log/ONNX pipeline that shows judges you understand the
full deployment path (NS-06/NS-08 are explicitly weighted in the PRD's NFRs).

---

## Project structure

```
notesure/
├── requirements.txt
├── README.md
├── scripts/
│   ├── 01_download_data.py
│   ├── 02_preprocess.py
│   ├── 03_synthetic_defects.py
│   ├── 04_train.py
│   ├── 05_export_mobile.py
│   └── 06_infer.py
├── notesure_data/
│   ├── raw/                  # created by script 01
│   └── processed/            # created by scripts 02-03
└── models/                   # checkpoints, onnx, audit log
```

## Next modules

This covers Module 2 (NoteSure) end-to-end. For the other four PRD modules:
- **Scam Sentinel** (call pattern / NLP scam script classifier) — different
  stack (audio/text, not CV); say the word and I'll scaffold that next with
  a synthetic scam-script dataset since real call transcripts aren't public either.
- **FraudGraph** — graph construction + GNN community detection on synthetic
  transaction/CDR data (NetworkX + PyTorch Geometric).
- **CrimeMap** — geospatial heatmap + hotspot prediction, good candidate for
  the Visualizer/a Streamlit or React dashboard rather than a training pipeline.
- **NagrikShield** — WhatsApp bot wrapper around the Scam Sentinel + NoteSure
  models, mostly integration work once those two exist.
