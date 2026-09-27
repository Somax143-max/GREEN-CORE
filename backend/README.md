# 🌱 GREENCORE AI — Backend REST API
### Campus Sustainability Digital Twin & Action Engine
**Problem Statement:** CB-SW-05 • HACKVERSE ’26 (ECO CLUB, GCE Kalahandi)

---

## 🚀 Overview

The **GreenCore Backend** is a high-performance Express & TypeScript REST API serving:
- **Campus Digital Twin:** Real-time spatial telemetry across 9 facilities at GCEK.
- **Sustainability Scoring Engine:** BEE / IGBC benchmark normalization with configurable weights.
- **Anti-Gaming Sentinel:** Data quality engine rejecting unphysical and artificially deflated readings.
- **Autonomous Anomaly Detection:** Rolling baseline Isolation Forest and z-score anomaly alerts.
- **Action Simulator:** What-if ROI modeling for LED retrofits, leak remediation, and solar rooftop installations.
- **Grounded AI Diagnostic:** Answers the 5 AI Questions (*What, Where, When, Why, What Next*).

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Healthcheck and service metadata |
| `GET` | `/api/campus/overview` | Live composite score, pillar scores, and active alarms |
| `GET` | `/api/campus/nodes` | All 9 campus facility nodes with sub-meter telemetry |
| `GET` | `/api/campus/nodes/:id` | Granular passport for a specific campus building |
| `GET` | `/api/campus/scores` | Detailed scoring breakdown with data confidence % |
| `GET` | `/api/campus/history` | 12-month historical energy, water, waste, and score trend |
| `POST` | `/api/campus/manual-entry` | Submit manual reading through Anti-Gaming Sentinel |
| `POST` | `/api/campus/anomaly/inject` | Trigger Step 2 of Killer Demo (Hostel B water leak) |
| `POST` | `/api/campus/anomaly/resolve` | Trigger Step 7 (Verify closed-loop physical repair) |
| `POST` | `/api/campus/anomaly/reset` | Reset campus state to optimal baseline |
| `GET` | `/api/campus/simulation-options` | Catalog of green capital intervention levers |
| `POST` | `/api/campus/simulate` | Model capital cost (₹), annual savings, and score lift |
| `GET` | `/api/campus/missions` | Active 7-day campus sustainability sprints |
| `POST` | `/api/campus/missions/:id/join` | Register participant in a green mission |
| `GET` | `/api/campus/audit-logs` | Immutable audit trail with cryptographic checksums |
| `GET` | `/api/campus/evidence` | Metric lineage and data provenance appendix |
| `POST` | `/api/campus/ai/query` | Natural language diagnostic query over verified telemetry |

---

## 🏃 Local Run & Development

```bash
# 1. Install dependencies
npm install

# 2. Run in development watch mode
npm run dev

# 3. Build production bundle
npm run build

# 4. Start production server
npm start
```

Default server runs at: `http://localhost:5000`

---

## ☁️ 1-Click Cloud Deployment Guides

### Option 1: Render.com
1. Create a **New Web Service** and connect this repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install && npm run build`.
4. Set **Start Command** to `npm start`.
5. Add Environment Variable: `PORT=5000`.

### Option 2: Railway.app
1. Deploy from GitHub and select the `backend` subdirectory.
2. Railway automatically detects `package.json` and runs `npm run build` and `npm start`.

### Option 3: Docker
```bash
cd backend
docker build -t greencore-backend .
docker run -p 5000:5000 greencore-backend
```
