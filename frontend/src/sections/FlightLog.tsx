"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface Phase {
  code: string;
  year: string;
  title: string;
  body: string;
  tags: string[];
}

export default function FlightLog() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [err, setErr] = useState(false);

  useEffect(() => {
    fetch("/api/flightlog")
      .then((r) => r.json())
      .then((d) => setPhases(d.phases || []))
      .catch(() => setErr(true));
  }, []);

  return (
    <section id="flightlog" className="border-t border-deck-800 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <span className="font-mono text-[11px] tracking-[0.2em] text-amber-dim">
            FLIGHT LOG / SERVED FROM API
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            Six years, logged honestly.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-dim">
            Pulled live from the deck's own backend. The turbulence is in the
            record too. That is the point.
          </p>
        </div>

        {err && (
          <div className="border border-warn/40 bg-warn/5 p-4 font-mono text-xs text-warn">
            Backend offline. Start the API: cd backend && npm start
          </div>
        )}

        <ol className="relative ml-3 border-l border-deck-700">
          {phases.map((p, i) => (
            <motion.li
              key={p.code}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="relative mb-10 pl-8 last:mb-0"
            >
              <span className="absolute -left-[6.5px] top-1.5 h-3 w-3 border border-amber bg-deck-900" />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] tracking-[0.16em] text-amber">
                  {p.code}
                </span>
                <span className="font-mono text-[11px] text-ink-faint">
                  {p.year}
                </span>
              </div>
              <h3 className="mt-1.5 font-display text-xl font-semibold text-ink">
                {p.title}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-dim">
                {p.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-deck-700 px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-ink-faint"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
