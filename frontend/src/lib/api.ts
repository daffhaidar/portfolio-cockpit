// Tiny fetch layer for the flight-deck API (proxied to :4178 in dev).
const BASE = "/api";

async function j<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Signal lost (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export interface Telemetry { visits: number; logEntries?: number }
export interface Entry { id: number; callsign: string; message: string; created_at: string }

export const api = {
  ping: () => j<Telemetry>("/telemetry/ping", { method: "POST" }),
  telemetry: () => j<Telemetry>("/telemetry"),
  guestbook: (limit = 25) => j<{ entries: Entry[]; total: number }>(`/guestbook?limit=${limit}`),
  sign: (callsign: string, message: string) =>
    j<{ entry: Entry }>("/guestbook", {
      method: "POST",
      body: JSON.stringify({ callsign, message }),
    }),
};
