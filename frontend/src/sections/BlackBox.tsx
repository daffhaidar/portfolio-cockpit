"use client";
import { useState, useEffect, type FormEvent } from "react";
import { motion } from "motion/react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import { api, type Entry } from "../lib/api";

export default function BlackBox() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [callsign, setCallsign] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [offline, setOffline] = useState(false);

  const load = () =>
    api
      .guestbook(25)
      .then((d) => {
        setEntries(d.entries);
        setTotal(d.total);
        setOffline(false);
      })
      .catch(() => setOffline(true));

  useEffect(() => {
    load();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (callsign.trim().length < 2 || message.trim().length < 2) return;
    setState("sending");
    setErrMsg("");
    try {
      await api.sign(callsign.trim(), message.trim());
      setMessage("");
      setState("ok");
      await load();
      setTimeout(() => setState("idle"), 2000);
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Transmission failed.");
      setState("err");
    }
  }

  return (
    <section id="blackbox" className="border-t border-deck-800 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-[11px] tracking-[0.2em] text-amber-dim">
            BLACK BOX / LIVE BACKEND
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            Leave a transmission.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-dim">
            Stored for real in the deck's flight recorder. {total} signals
            logged so far.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* form */}
          <form
            onSubmit={submit}
            className="flex flex-col gap-4 border border-deck-700 bg-deck-850/50 p-6"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="cs"
                className="font-mono text-[11px] tracking-[0.14em] text-ink-dim"
              >
                CALLSIGN
              </label>
              <input
                id="cs"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                maxLength={32}
                placeholder="tower-control"
                className="border border-deck-600 bg-deck-950 px-3 py-2 font-mono text-sm text-ink outline-none placeholder:text-ink-faint focus:border-amber"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="msg"
                className="font-mono text-[11px] tracking-[0.14em] text-ink-dim"
              >
                MESSAGE
              </label>
              <textarea
                id="msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={280}
                rows={4}
                placeholder="Your signal to the deck..."
                className="resize-none border border-deck-600 bg-deck-950 px-3 py-2 font-mono text-sm text-ink outline-none placeholder:text-ink-faint focus:border-amber"
              />
              <span className="self-end font-mono text-[10px] text-ink-faint">
                {message.length}/280
              </span>
            </div>

            <button
              type="submit"
              disabled={state === "sending"}
              className="flex items-center justify-center gap-2 bg-amber px-4 py-2.5 font-mono text-xs font-bold tracking-[0.14em] text-deck-950 transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {state === "sending" ? "TRANSMITTING..." : "TRANSMIT"}
              <PaperPlaneRight size={14} weight="bold" />
            </button>

            {state === "ok" && (
              <p className="font-mono text-[11px] text-signal">
                Signal received. Logged to flight recorder.
              </p>
            )}
            {state === "err" && (
              <p className="font-mono text-[11px] text-warn">{errMsg}</p>
            )}
          </form>

          {/* feed */}
          <div className="border border-deck-700 bg-deck-950/40">
            <div className="border-b border-deck-700 px-4 py-2.5">
              <span className="font-mono text-[10px] tracking-[0.16em] text-ink-faint">
                RECORDER FEED
              </span>
            </div>
            <div className="max-h-[26rem] space-y-0 overflow-y-auto">
              {offline && (
                <p className="p-4 font-mono text-xs text-warn">
                  Backend offline. Start: cd backend && npm start
                </p>
              )}
              {!offline && entries.length === 0 && (
                <p className="p-4 font-mono text-xs text-ink-faint">
                  No transmissions yet. Be the first.
                </p>
              )}
              {entries.map((en) => (
                <motion.div
                  key={en.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-deck-800 px-4 py-3 last:border-0"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-amber">
                      @{en.callsign}
                    </span>
                    <span className="font-mono text-[10px] text-ink-faint">
                      {en.created_at}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-snug text-ink-dim">
                    {en.message}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
