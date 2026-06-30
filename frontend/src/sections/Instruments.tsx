"use client";
import { motion } from "motion/react";
import Gauge from "../components/Gauge";
import { INSTRUMENTS } from "../data/content";

export default function Instruments() {
  return (
    <section id="instruments" className="border-t border-deck-800 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-2xl"
        >
          <span className="font-mono text-[11px] tracking-[0.2em] text-amber-dim">
            INSTRUMENT PANEL
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            Readouts, not adjectives.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-dim">
            Every gauge is a domain I've actually flown in. The needle sits
            where the honest hours are, not where the resume wishes they were.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INSTRUMENTS.map((g, i) => (
            <Gauge key={g.label} {...g} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
