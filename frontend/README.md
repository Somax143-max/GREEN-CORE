# 🌱 GREENCORE AI — Frontend Client Application
### Campus Sustainability Digital Twin & Action Engine UI
**Problem Statement:** CB-SW-05 • HACKVERSE ’26 (ECO CLUB, GCE Kalahandi)

---

## 🚀 Overview

The **GreenCore Frontend** is an institutional-grade sustainability intelligence console featuring:
- **01 Command Center:** Real-time composite GreenScore ($78/100$), data confidence gauge ($91\%$), and 4 domain pillar cards.
- **02 Digital Twin:** Interactive 2D/3D spatial campus topology map of GCEK with real-time status pulses and building passports.
- **03 Energy Analytics:** 12-month historical consumption time series, 150 kWp solar rooftop PV mix ($15.5\%$ offset), and ML anomaly detection.
- **04 Water Analytics:** 24-hour diurnal flow telemetry curve highlighting the abnormal $3,200\text{ L/hr}$ night leak pattern in Hostel B.
- **05 Waste & Circularity:** Waste diversion rate formula ($84.2\%$ circularity), 7-category segregation breakdown, and cafeteria composting output.
- **06 Mobility & Carbon:** Campus Carbon Ledger ($184.2\text{ tCO}_2\text{e/mo}$) quantified across Scope 1, 2, and 3 with transparent emission factors (CEA India $0.716\text{ kg CO}_2/\text{kWh}$, DEFRA) and modal survey breakdown.
- **07 AI Insights:** The 5 AI Questions matrix, multi-signal Change Fingerprint covariance test, and "Ask GreenCore" conversational telemetry console.
- **08 Action Simulator:** What-if scenario builder, financial ROI calculator ($\text{₹}$ capital cost, annual savings, payback period in months), and $2 \times 2$ **Action Priority Matrix** (Do First, Strategic Plan, Quick Wins, De-prioritize).
- **09 Green League:** Gamification leaderboard ranked strictly by **normalized improvement** rather than raw consumption, plus active 7-Day Campus Sprints.
- **10 Audit Center:** NAAC/NIRF-ready official printable sustainability report, metric lineage evidence appendix, immutable SHA-256 audit log, and scoring methodology configurator.

---

## 🛠️ Tech Stack

- **Framework:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Bundler:** Vite 8
- **Gamification:** Canvas Confetti

---

## 🏃 Local Run & Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build
npm run preview -- --port 5173 --host
```

---

## ☁️ 1-Click Cloud Deployment Guides

### Option 1: Vercel (Recommended)
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://greencore-backend.onrender.com`).

### Option 2: Netlify
1. Connect repository on [Netlify](https://netlify.com).
2. Set **Base directory**: `frontend`.
3. Set **Build command**: `npm run build`.
4. Set **Publish directory**: `dist`.
5. Add Environment Variable: `VITE_API_URL`.

### Option 3: Docker
```bash
cd frontend
docker build -t greencore-frontend .
docker run -p 80:80 greencore-frontend
```
