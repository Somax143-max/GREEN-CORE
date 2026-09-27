# 🌱 GREENCORE AI — Campus Sustainability Digital Twin & Action Engine
### Official Solution for HACKVERSE ’26 Problem Statement: **CB-SW-05 (GREENScore)**
**Category:** Software / Intermediate / GreenTech & Sustainability  
**Host Organization:** ECO CLUB, Govt. College of Engineering Kalahandi (GCEK), Bhawanipatna, Odisha  
**Architecture:** Fully Separated Frontend (`/frontend`) & Backend REST API (`/backend`)

---

## 🏛️ Project Structure & Separation of Concerns

The codebase is split into two independent, production-ready directories:

```
greencore/
├── frontend/                     # React 19 + TypeScript + Tailwind CSS v4 + Vite Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Header, 10-Tab Navigation, KillerDemoStepper
│   │   │   ├── pages/            # 10 Core Sustainability Modules
│   │   │   ├── modals/           # Manual Entry Modal & Node Detail Passport
│   │   │   └── common/           # ScoreGauge, MetricCard
│   │   ├── context/              # React Campus Context & State Management
│   │   ├── services/             # REST API Client (communicates with Backend)
│   │   ├── engine/               # Client-side fallbacks & models
│   │   ├── types/                # TypeScript domain interfaces
│   │   └── data/                 # Baseline dataset
│   ├── Dockerfile                # Multi-stage Nginx container
│   ├── package.json              # Independent client dependencies
│   ├── vite.config.ts            # Vite 8 + Tailwind CSS v4 config
│   └── README.md                 # Frontend deployment guide (Vercel, Netlify)
│
├── backend/                      # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── server.ts             # Express server & CORS configuration
│   │   ├── routes/campus.ts      # REST API endpoints (/api/campus/*)
│   │   ├── engine/               # Scoring, Anomaly, Fingerprint & AI engines
│   │   ├── data/                 # 12-month historical data, baseline models
│   │   └── types/                # Domain models
│   ├── Dockerfile                # Multi-stage Node.js container
│   ├── package.json              # Independent backend dependencies
│   ├── tsconfig.json             # NodeNext TypeScript compilation
│   ├── .env.example              # Environment variables template
│   └── README.md                 # Backend deployment guide (Render, Railway, Docker)
│
├── docker-compose.yml            # 1-Click local/cloud container deployment
├── package.json                  # Root monorepo orchestration scripts
└── README.md                     # Master documentation
```

---

## 🚀 Running the Full Stack Locally

### 1. Run Backend Server (Port 5000)
```bash
cd backend
npm install
npm run dev
```
*Healthcheck:* `http://localhost:5000/health`  
*API Overview:* `http://localhost:5000/api/campus/overview`

### 2. Run Frontend Client (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Frontend URL:* `http://localhost:5173/`

### 3. Or 1-Click with Docker Compose
```bash
docker compose up --build
```
* Frontend will be accessible on `http://localhost:80` (or `http://localhost:5173`)
* Backend will be accessible on `http://localhost:5000`

---

## ☁️ Independent Cloud Deployment

| Service | Recommended Host | Root Directory | Build Command | Output / Start | Environment Variables |
|---|---|---|---|---|---|
| **Frontend** | **Vercel** / **Netlify** | `frontend` | `npm run build` | `dist` | `VITE_API_URL=https://your-backend.onrender.com` |
| **Backend** | **Render** / **Railway** | `backend` | `npm run build` | `npm start` | `PORT=5000`, `NODE_ENV=production` |

---

## 🕹️ The 8-Step Killer Demo Walkthrough

The top of the application features an interactive **8-Step Stepper** that guides judges and evaluators through a complete closed-loop sustainability cycle:

1. **Step 1 — Baseline Optimal:** Campus GreenScore is at $82/100$. All 9 physical zones optimal.
2. **Step 2 — Inject Hidden Event:** Simulate a sudden underground pipe rupture / stuck float valve in **Hostel B (Indravati)**: water jumps from $142 \rightarrow 188\text{ L/student/day}$.
3. **Step 3 — Anomaly Detected:** GreenCore's ML Isolation Sentinel raises a Critical Anomaly alert. Campus score drops from $82 \rightarrow 78$.
4. **Step 4 — Ask AI "Why?" (Change Fingerprint):** Multi-signal correlation proves water spiked $+32.4\%$ while occupancy grew only $+2.1\%$ and energy $+3.4\%$. The AI diagnoses a physical mechanical leak rather than legitimate campus growth.
5. **Step 5 — "What Should We Do?":** System outputs prioritized directives (P1: Inspect Hostel B ground sump feeder and tank float valve; P2: Verify zero-flow telemetry calibration; P3: Install 4.5 L/min tap aerators).
6. **Step 6 — Action Impact Simulator:** The administrator models the intervention: $+2.3$ score restoration, $\text{₹}1,94,000$ annual savings, $10.8$ months payback.
7. **Step 7 — Closed-Loop Verification:** Maintenance is executed. Flow normalizes from $188 \rightarrow 149\text{ L/student/day}$ ($-20.7\%$ reduction). GreenScore is restored to $82/100$.
8. **Step 8 — Audit Report & Evidence Chain:** Generate the complete official, immutable audit report with cryptographic SHA-256 verification and NAAC/NIRF compliance.

---

## 🖥️ The 10 Core Application Modules

| Tab | Name | Key Functionality |
|---|---|---|
| **01** | **Command Center** | Campus composite score gauge, data confidence bar, 4 domain pillar cards, "What Changed?" summary, and facility status matrix. |
| **02** | **Digital Twin** | Interactive 2D/3D spatial campus topology map of GCEK with real-time status pulses, facility passports, and hotspot zoom. |
| **03** | **Energy Intelligence** | 12-month historical consumption time series, 150 kWp solar PV net generation mix, $\text{kWh/student}$, $\text{kWh/m²}$, and ML anomaly sentinel. |
| **04** | **Water Intelligence** | 24-hour diurnal flow telemetry curve highlighting the abnormal $3,200\text{ L/hr}$ night-flow leak pattern (02:00–05:00 AM) in Hostel B. |
| **05** | **Waste & Circularity** | Waste diversion rate formula, 7-category segregation breakdown, cafeteria wet food composting register, and landfill residual tracker. |
| **06** | **Mobility & Carbon** | Campus Carbon Ledger quantified across Scope 1, Scope 2, and Scope 3 with visible emission factors (CEA India $0.716\text{ kg CO}_2/\text{kWh}$, DEFRA) and modal survey split. |
| **07** | **AI Insights** | The 5 AI Questions matrix, multi-signal Change Fingerprint covariance test, and "Ask GreenCore" conversational telemetry console. |
| **08** | **Action Simulator** | What-if scenario builder, financial ROI calculator ($\text{₹}$ capital cost, annual savings, payback period), and $2 \times 2$ Action Priority Matrix (Do First, Plan, Quick Wins). |
| **09** | **Green League** | Fair gamification leaderboard ranked by **normalized improvement** rather than raw volume, plus active 7-Day Campus Sprints. |
| **10** | **Audit Center** | NAAC/NIRF-ready official printable sustainability report, metric lineage evidence appendix, immutable SHA-256 audit log, and scoring methodology configurator. |
