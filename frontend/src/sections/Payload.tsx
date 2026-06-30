"use client";
import { motion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PROJECTS } from "../data/content";

const STATUS_COLOR: Record<string, string> = {
  DEPLOYED: "text-signal",
  ACTIVE: "text-amber",
  ARCHIVED: "text-ink-faint",
};

export default function Payload() {
  return (
    <section id="payload" className="border-t border-deck-800 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-[11px] tracking-[0.2em] text-amber-dim">
            PAYLOAD MANIFEST
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            What I've carried.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PROJECTS.map((p, i) => {
            const Wrapper = p.link ? motion.a : motion.div;
            return (
              <Wrapper
                key={p.codename}
                {...(p.link
                  ? { href: p.link, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group relative flex flex-col border border-deck-700 bg-deck-850/50 p-6 transition-colors hover:border-amber-dim"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.16em] text-amber-dim">
                    {p.codename}
                  </span>
                  <span
                    className={`font-mono text-[10px] tracking-[0.14em] ${STATUS_COLOR[p.status]}`}
                  >
                    ● {p.status}
                  </span>
                </div>

                <h3 className="mt-4 flex items-center gap-2 font-display text-2xl font-semibold text-ink">
                  {p.name}
                  {p.link && (
                    <ArrowUpRight
                      size={18}
                      weight="bold"
                      className="text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-amber"
                    />
                  )}
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-dim">
                  {p.desc}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="border border-deck-700 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-ink-faint"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
