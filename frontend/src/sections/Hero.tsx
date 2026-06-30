"use client";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PROFILE } from "../data/content";

const BOOT_LINES = [
  "> initializing flight deck...",
  "> loading career telemetry... OK",
  "> 6 years on-chain detected",
  "> mounting instruments... OK",
  "> clearance granted. welcome aboard.",
];

export default function Hero() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? BOOT_LINES.length : 0);

  useEffect(() => {
    if (reduce) return;
    if (shown >= BOOT_LINES.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 420);
    return () => clearTimeout(t);
  }, [shown, reduce]);

  return (
    <section
      id="preflight"
      className="deck-grid relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <div className="scanline" />
      {/* amber bloom behind the callsign + cyan ground glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 30% 35%, rgba(232,173,92,0.13), transparent 60%), radial-gradient(60% 50% at 85% 90%, rgba(84,214,232,0.08), transparent 65%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deck-900/0 via-deck-900/30 to-deck-900" />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        {/* Left: identity */}
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-2 w-2 bg-signal blink" />
            <span className="font-mono text-[11px] tracking-[0.22em] text-signal">
              {PROFILE.status}
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl">
            {PROFILE.callsign}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-dim">
            {PROFILE.role}.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-faint">
            {PROFILE.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#flightlog"
              className="bg-amber px-5 py-2.5 font-mono text-xs font-bold tracking-[0.14em] text-deck-950 transition-transform active:scale-[0.98]"
            >
              REVIEW FLIGHT LOG
            </a>
            <a
              href="#blackbox"
              className="border border-deck-600 px-5 py-2.5 font-mono text-xs tracking-[0.14em] text-ink-dim transition-colors hover:border-amber-dim hover:text-amber"
            >
              OPEN COMMS
            </a>
          </div>
        </div>

        {/* Right: boot console */}
        <div className="flex items-center">
          <div className="w-full border border-deck-700 bg-deck-950/70 p-5">
            <div className="mb-3 flex items-center gap-2 border-b border-deck-700 pb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-warn" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber" />
              <span className="h-2.5 w-2.5 rounded-full bg-signal" />
              <span className="ml-2 font-mono text-[10px] tracking-[0.14em] text-ink-faint">
                cockpit@deck — boot
              </span>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              {BOOT_LINES.slice(0, shown).map((line, i) => (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    i === BOOT_LINES.length - 1 ? "text-signal" : "text-ink-dim"
                  }
                >
                  {line}
                </motion.div>
              ))}
              {shown >= BOOT_LINES.length && (
                <span className="text-amber blink">_</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
