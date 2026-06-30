# ✈️ Flight Deck

My portfolio, built as a cockpit. Six years of work mapped to the phases of a flight: pre-flight, takeoff, cruise, approach.

**Live:** https://frontend-mu-red-41.vercel.app

It's fullstack — a real React frontend talking to a small Express + SQLite backend. The flight log loads from the API, and the guestbook ("Black Box") writes to a real database. Not a static template.

## What's inside

- **Pre-Flight** — animated boot console hero
- **Instruments** — six hand-drawn SVG gauges, one per skill domain
- **Flight Log** — my career timeline, served from the backend
- **Payload** — the projects I've carried
- **Black Box** — a guestbook you can actually sign

## Stack

React + TypeScript + Tailwind + Motion on the front. Express + better-sqlite3 on the back. Space Grotesk and JetBrains Mono for type.

## Run it

```bash
# backend
cd backend && npm install && npm start

# frontend (new terminal)
cd frontend && npm install && npm run dev
```

Frontend on `:5173`, backend on `:4178`. The dev server proxies `/api` automatically. If the backend isn't running, the deck shows a clean offline state instead of breaking.

---

© Daffa Haidar 2026
