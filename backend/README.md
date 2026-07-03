# RakshaSutra Backend API

> Node.js/Express backend for the RakshaSutra Digital Public Safety Platform.  
> Serves the React/Vite frontend (port 5173) from port 3000.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 3. Start development server (hot reload)
npm run dev

# 4. Verify it's running
curl http://localhost:3000/health
```

---

## Project Structure

```
rakshasutra-backend/
├── src/
│   ├── index.js                    ← Express app entry point
│   ├── routes/
│   │   ├── currency.routes.js      ← POST /api/v1/currency/analyse
│   │   ├── fraud.routes.js         ← POST /api/v1/fraud/analyse
│   │   ├── chat.routes.js          ← POST /api/v1/chat/message
│   │   ├── crime.routes.js         ← GET  /api/v1/crime/events
│   │   └── scam.routes.js          ← POST /api/v1/scam/analyse
│   ├── controllers/                ← HTTP request/response handling
│   ├── services/                   ← Business logic (stubs + Claude API)
│   ├── middleware/
│   │   ├── upload.middleware.js    ← Multer config (image + CSV)
│   │   └── error.middleware.js     ← Global error handler
├── .env                            ← Your secrets (not committed)
├── .env.example                    ← Template for team members
└── package.json
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default: 3000) | No |
| `ANTHROPIC_API_KEY` | Claude API key for NagrikShield chat | Yes (for /chat/message) |
| `ML_SERVICE_URL` | URL of Python ML microservice | No (future use) |

---

## API Reference

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "project": "RakshaSutra",
  "version": "1.0.0",
  "timestamp": "2026-07-03T10:00:00Z",
  "modules": ["currency", "fraud", "chat", "crime", "scam"]
}
```

---

### 1. NoteSure — Currency Authentication

```
POST /api/v1/currency/analyse
Content-Type: multipart/form-data
Field: image (JPG or PNG, max 10MB)
```

**curl example:**
```bash
curl -X POST http://localhost:3000/api/v1/currency/analyse \
  -F "image=@/path/to/note.jpg"
```

**Response:**
```json
{
  "verdict": "suspect",
  "confidence": 0.91,
  "denomination": 500,
  "flagged_regions": [
    { "label": "Security Thread", "x": 120, "y": 45, "w": 10, "h": 200 },
    { "label": "Microprint Zone", "x": 340, "y": 180, "w": 60, "h": 20 },
    { "label": "UV Luminescence", "x": 80, "y": 220, "w": 40, "h": 40 }
  ],
  "gradcam_url": null,
  "scan_id": "SCAN_1720000000000",
  "timestamp": "2026-07-03T10:30:00Z"
}
```

---

### 2. FraudGraph — Transaction Network Analysis

```
POST /api/v1/fraud/analyse
Content-Type: multipart/form-data
Field: file (CSV in PaySim schema, max 50MB)
```

**curl example:**
```bash
curl -X POST http://localhost:3000/api/v1/fraud/analyse \
  -F "file=@/path/to/transactions.csv"
```

**Response:**
```json
{
  "clusters": [
    {
      "cluster_id": "C001",
      "risk_tier": "HIGH",
      "node_count": 14,
      "edge_count": 38,
      "risk_score": 0.91,
      "nodes": [...],
      "edges": [...]
    }
  ],
  "total_accounts": 4821,
  "flagged_accounts": 143,
  "processing_time_ms": 1240,
  "session_id": "FRAUD_SESSION_1720000000000"
}
```

---

### 3. NagrikShield — Citizen Chatbot (Claude API)

```
POST /api/v1/chat/message
Content-Type: application/json
```

**curl example:**
```bash
curl -X POST http://localhost:3000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"I got a call from CBI officer saying I am under digital arrest","language":"en","session_id":"sess_001"}'
```

**Response:**
```json
{
  "response": "This is a Digital Arrest scam. No government agency arrests you over a video call...",
  "risk_verdict": "danger",
  "helpline": "1930",
  "confidence": 0.97,
  "session_id": "sess_001"
}
```

> ⚠️ Requires `ANTHROPIC_API_KEY` in `.env`. Without it the endpoint returns HTTP 503 with a clear error message.

---

### 4. CrimeMap — Geospatial Events

```
GET /api/v1/crime/events
Query params (all optional): state, type, severity
```

**curl example:**
```bash
# All events
curl http://localhost:3000/api/v1/crime/events

# Filtered: Maharashtra + CRITICAL only
curl "http://localhost:3000/api/v1/crime/events?state=Maharashtra&severity=CRITICAL"
```

**Supported types:** `UPI_Fraud`, `Digital_Arrest`, `OTP_Phishing`, `FICN_Circulation`, `Investment_Fraud`, `Loan_App_Scam`  
**Supported severities:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`

**Response:**
```json
{
  "events": [
    {
      "id": "EVT_001",
      "lat": 19.076,
      "lng": 72.877,
      "type": "UPI_Fraud",
      "severity": "HIGH",
      "city": "Mumbai",
      "state": "Maharashtra",
      "loss_amount": 85000,
      "timestamp": "2024-11-15T14:30:00Z",
      "fir_number": "FIR/2024/MH/00412"
    }
  ],
  "total": 30,
  "filtered": 4
}
```

---

### 5. Scam Sentinel — Transcript Analysis

```
POST /api/v1/scam/analyse
Content-Type: application/json
```

**curl example:**
```bash
curl -X POST http://localhost:3000/api/v1/scam/analyse \
  -H "Content-Type: application/json" \
  -d '{"transcript":"This is Officer Sharma from CBI. You are under digital arrest. Do not tell anyone.","caller_id":"+91-9876543210","session_id":"sess_xyz456"}'
```

**Response:**
```json
{
  "verdict": "confirmed_scam",
  "confidence": 0.86,
  "scam_type": "digital_arrest",
  "flagged_phrases": ["cbi", "digital arrest", "do not tell anyone"],
  "recommended_action": "Terminate call immediately. Report to 1930.",
  "alert_generated": true,
  "session_id": "sess_xyz456"
}
```

---

## For ML Teammates

Every service file has a `// TODO: Replace with real model` comment marking exactly where to drop inference code:

| Service | File | Replace with |
|---|---|---|
| NoteSure | `src/services/currency.service.js` | ONNX Runtime EfficientNet-B0 |
| FraudGraph | `src/services/fraud.service.js` | Louvain + GraphSAGE via `ML_SERVICE_URL` |
| CrimeMap | `src/services/crime.service.js` | PostGIS DB query / NCRB API |
| Scam Sentinel | `src/services/scam.service.js` | IndicBERT fine-tuned classifier |
| NagrikShield | `src/services/chat.service.js` | Already live via Claude API ✅ |

---

## CORS

CORS is configured to allow `http://localhost:5173` (Vite dev server) only.  
For production, update the origin in `src/index.js`.
