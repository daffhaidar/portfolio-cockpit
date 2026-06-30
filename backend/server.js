// Flight-deck portfolio API.
// Endpoints:
//   GET  /api/health            -> liveness
//   GET  /api/telemetry         -> visit count (read-only)
//   POST /api/telemetry/ping    -> increment + return new count
//   GET  /api/flightlog         -> career timeline (static, served from JSON)
//   GET  /api/guestbook         -> recent Black Box entries
//   POST /api/guestbook         -> add an entry { callsign, message }
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  bumpVisits,
  getVisits,
  addEntry,
  recentEntries,
  countEntries,
} from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4178;

// Behind nginx (and Vercel edge) — trust exactly one proxy hop for correct req.ip.
app.set("trust proxy", 1);

// Security headers. API serves JSON only, so we can lock CSP down hard.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cors());
app.use(express.json({ limit: "16kb" }));

// Write limiter: 5 transmissions / 10 min per IP (real, header-based).
const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many transmissions. Hold." },
});

const flightlog = JSON.parse(
  readFileSync(join(__dirname, "flightlog.json"), "utf-8")
);

app.get("/api/health", (_req, res) =>
  res.json({ status: "AIRBORNE", ts: new Date().toISOString() })
);

app.get("/api/telemetry", (_req, res) =>
  res.json({ visits: getVisits(), logEntries: countEntries() })
);

app.post("/api/telemetry/ping", (_req, res) =>
  res.json({ visits: bumpVisits() })
);

app.get("/api/flightlog", (_req, res) => res.json(flightlog));

app.get("/api/guestbook", (req, res) => {
  const limit = Number(req.query.limit) || 25;
  res.json({ entries: recentEntries(limit), total: countEntries() });
});

app.post("/api/guestbook", writeLimiter, (req, res) => {
  let { callsign, message } = req.body || {};
  callsign = String(callsign || "").trim().slice(0, 32);
  message = String(message || "").trim().slice(0, 280);
  if (callsign.length < 2 || message.length < 2)
    return res
      .status(400)
      .json({ error: "Callsign and message are required (2+ chars)." });

  const entry = addEntry(callsign, message);
  res.status(201).json({ entry });
});

app.listen(PORT, () =>
  console.log(`[cockpit] API airborne on :${PORT}`)
);
