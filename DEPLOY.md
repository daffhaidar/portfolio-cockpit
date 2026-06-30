# Deploy Guide

Frontend is static. Backend is a tiny Node service. Deploy them separately.

## Frontend → Vercel (recommended)

```bash
cd frontend
npm install
npm run build          # outputs frontend/dist
npx vercel deploy --prod
```

The repo already includes `frontend/vercel.json` with the SPA rewrite and a
`/api` rewrite placeholder. Edit the destination to point at your backend URL:

```json
{ "source": "/api/:path*", "destination": "https://YOUR-BACKEND-HOST/api/:path*" }
```

If you deploy frontend only (no backend), the FLIGHT LOG and BLACK BOX sections
gracefully show an "offline" state instead of crashing.

## Backend → Railway / Render / Fly / VPS

```bash
cd backend
npm install
npm start              # listens on PORT env or 4178
```

Requirements:
- Node 18+
- A persistent volume mounted at `backend/data/` so `cockpit.db` survives
  restarts. Without it the guestbook resets on every redeploy.
- Set `PORT` via env if the platform assigns one.

### Railway one-liner
- New project → Deploy from repo → root `backend/`
- Add a volume mounted at `/app/data`
- Set start command: `npm start`

## Local (both together)

```bash
# terminal 1
cd backend && npm install && npm start
# terminal 2
cd frontend && npm install && npm run dev
```

Frontend dev server proxies `/api` → `localhost:4178` automatically
(see `frontend/vite.config.ts`).

## Verify mobile / old-phone

Open the deployed site, then in Chrome DevTools:
1. F12 → toggle device toolbar (Ctrl+Shift+M)
2. Set width to **320px** (old Android / iPhone SE)
3. Confirm: no horizontal scrollbar, all sections single-column, gauges and
   cards stack, nav collapses to the TRANSMIT button.
