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

app.use(cors());
app.use(express.json({ limit: "16kb" }));

const flightlog = JSON.parse(
  readFileSync(join(__dirname, "flightlog.json"), "utf-8")
);

// --- naive in-memory rate limiter for writes (per IP, 5 / 10 min) ---
const writeHits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const win = 10 * 60 * 1000;
  const arr = (writeHits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now);
  writeHits.set(ip, arr);
  return arr.length > 5;
}

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

app.post("/api/guestbook", (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
  if (rateLimited(ip))
    return res.status(429).json({ error: "Too many transmissions. Hold." });

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
