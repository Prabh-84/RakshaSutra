# RakshaSutra — Digital Public Safety AI Platform

RakshaSutra is a next-generation command centre application targeting cyber fraud, counterfeiting, digital arrest scams, and network-based financial crimes. Designed for national-level law enforcement and public safety intelligence, this platform provides real-time geospatial intelligence, financial network graphing, and automated transcript analysis.

## 🌟 Core Modules

1. **Scam Sentinel**
   - Real-time voice and transcript spoof detection. Identifies malicious vocabulary (e.g., "digital arrest", "CBI", "do not tell anyone") and assigns live risk verdicts.
2. **NoteSure**
   - Currency verification module mimicking mobile image scanners. Authenticates currency by matching up to 6 critical note features (watermark, intaglio, UV luminescence, etc.).
3. **FraudGraph**
   - Financial intelligence graph analyzing transaction networks. Visualizes interconnected fraud rings (persons, bank accounts, SIM cards) using interactive D3.js force-directed graphs.
4. **CrimeMap**
   - Geospatial intelligence dashboard rendering nationwide crime density heatmaps and specific FIR event circle markers via Leaflet.
5. **NagrikShield**
   - Multilingual citizen-facing chatbot assistant (supporting 12 languages). Allows citizens to verify suspicious calls or payment requests in real-time.

## 🏗️ System Architecture

The platform operates on a simulated 5-Layer Event-Driven Architecture:
1. **Intake & Edge Layer:** Vite, WhatsApp API, IoT, Call Ingest
2. **Event Streaming Layer:** Apache Kafka
3. **Processing & Analytics Layer:** Redis, PostGIS, TimescaleDB, Neo4j
4. **Core Intelligence Engines:** IndicBERT, RawNet3, YOLOv8, GraphSAGE
5. **Presentation Layer:** React SPA Command Centre Dashboard

### Tech Stack
- **Frontend:** React, Vite, Tailwind/Custom CSS Glassmorphism, Leaflet, D3.js, Chart.js
- **Backend:** Node.js, Express.js
- **Database / Auth:** SQLite (User Auth & Roles)
- **AI Integration:** Anthropic Claude API (for live NagrikShield chatbot)

## 🚀 Work Completed & Project Progress

The following development phases have been successfully completed:

### 1. Initialization & UI/UX Design
- Initialized the React SPA with Vite.
- Built a global design system in `src/index.css` implementing a highly interactive, glassmorphism-themed dark-mode UI, complete with background mesh gradients, hover lifts, and breathing status dots.
- Formulated the TopBar (live clock, activity pulse) and Sidebar (Overview, Modules, System navigation).
- Created a robust shared component library (`ConfidenceGauge`, `StatusBadge`).

### 2. Core Frontend Module Implementation
- **Dashboard:** Interactive Chart.js widgets tracking loss trends and threat distributions, alongside an animated Data Pipeline flow.
- **Scam Sentinel:** Active call session lists and transcript viewer with highlighted malicious phrases.
- **NoteSure:** Animated progress bar tracing currency security features and an immutable verification ledger.
- **FraudGraph:** Node-link visualizations using D3.js, filtering systems, and side intelligence logs.
- **CrimeMap:** Interactive Leaflet maps with dynamic plotting and state-by-state analytics.
- **NagrikShield:** Real-time chat interface with scenario prompts and live risk verdicts.

### 3. Authentication & Production Readiness
- Built `AuthContext` using React Context with Login and Signup routes.
- Simulated Role-Based Access Control (RBAC) with specific personas (e.g., National Command, State Cyber Cell, Bank Operator).
- Added an **Architecture** page showcasing production-grade infrastructure details, tech stacks, and compliance checklists (DPDP Act, Section 65B).
- Ensured robust SEO (Meta titles, Open Graph) and hardened Security Headers.

### 4. Full-Stack Backend Integration (`rakshasutra-backend`)
- Developed a full Express.js backend API (running on port 3000) configured with CORS for the frontend.
- Implemented file upload parsing via Multer for image verification (`/currency/analyse`) and CSV processing (`/fraud/analyse`).
- Integrated live AI via **Anthropic Claude API** for the `/chat/message` endpoint.
- Connected the frontend directly to the API using a dedicated `api.js` client layer, allowing the UI to hydrate dynamically with data from backend endpoints (`/crime/events`, `/scam/analyse`, etc.).
- Integrated SQLite database for authentication state and user management.

## ⚙️ Quick Start Guide

### Prerequisites
- Node.js 18+
- Anthropic API Key (for the chatbot)

### Starting the Backend
```bash
cd rakshasutra-backend
npm install
cp .env.example .env 
# Add your ANTHROPIC_API_KEY to the .env file
npm run dev
# The backend will start on http://localhost:3000
```

### Starting the Frontend
```bash
cd rakshasutra
npm install
npm run dev
# The frontend will start on http://localhost:5173
```
