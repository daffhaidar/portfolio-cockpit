# ✈️ Flight Deck — Daffa Haidar Portfolio

A fullstack portfolio built as a cockpit / flight-instrument panel. Your career,
mapped to phases of flight: pre-flight → takeoff → cruise → approach.

Not a template. Hand-assembled frontend **and** backend, real SVG instrument
gauges, a live guestbook persisted in SQLite, and a visitor telemetry counter.

```
┌─ FRONTEND ──────────────┐      ┌─ BACKEND ───────────────┐
│ Vite + React + TS       │ ───▶ │ Express + better-sqlite3 │
│ Tailwind v4 + Motion    │ /api │ guestbook · telemetry    │
│ Space Grotesk + JB Mono │ ◀─── │ flight log JSON          │
└─────────────────────────┘      └──────────────────────────┘
```

## Sections

| Section      | What it is                                          |
|--------------|-----------------------------------------------------|
| PRE-FLIGHT   | Hero with animated HUD boot console                 |
| INSTRUMENTS  | Six real SVG gauges (needle sweeps on scroll)       |
| FLIGHT LOG   | Career timeline, **served live from the backend**   |
| PAYLOAD      | Project manifest cards                              |
| BLACK BOX    | Guestbook — **real POST to SQLite** + visitor count |

## Run locally

Two processes. Backend first, then frontend.

```bash
# Terminal 1 — backend API (port 4178)
cd backend
npm install
npm start

# Terminal 2 — frontend (port 5173, proxies /api -> 4178)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
cd frontend
npm run build      # outputs to frontend/dist
npm run preview    # serve the production build
```

## Tech

- **Frontend:** Vite, React 18, TypeScript, Tailwind CSS v4, Motion (Framer),
  Phosphor Icons. Space Grotesk (display) + JetBrains Mono (instruments).
- **Backend:** Express, better-sqlite3 (WAL mode). In-memory write rate-limit
  (5 transmissions / 10 min per IP) on the guestbook.
- **Design:** dark-locked night-cockpit palette, amber primary + cyan HUD
  accent. Honors `prefers-reduced-motion`. No horizontal overflow on mobile.

## API

| Method | Route                  | Purpose                       |
|--------|------------------------|-------------------------------|
| GET    | `/api/health`          | liveness                      |
| GET    | `/api/telemetry`       | visit + log counts            |
| POST   | `/api/telemetry/ping`  | increment visit counter       |
| GET    | `/api/flightlog`       | career timeline               |
| GET    | `/api/guestbook`       | recent entries                |
| POST   | `/api/guestbook`       | add entry `{callsign,message}`|

## Deploy

**Frontend** is a static build — deploy `frontend/dist` to Vercel / Netlify /
GitHub Pages. Set the API base via the `/api` proxy or a rewrite to your
backend host.

**Backend** runs anywhere Node runs (Railway, Render, Fly, a VPS). It writes
`backend/data/cockpit.db` — mount a volume so the guestbook survives restarts.

See `DEPLOY.md` for step-by-step.

---

Built as a farewell flight. Every gauge points at honest hours.
