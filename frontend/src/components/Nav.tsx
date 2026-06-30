"use client";
import { useState, useEffect } from "react";
import { NAV } from "../data/content";

export default function Nav() {
  const [active, setActive] = useState("preflight");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // IntersectionObserver for active section — no scroll listener (skill 5.D).
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });

    const top = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { threshold: 0 }
    );
    const sentinel = document.getElementById("top-sentinel");
    if (sentinel) top.observe(sentinel);

    return () => {
      obs.disconnect();
      top.disconnect();
    };
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 h-16 border-b transition-colors ${
        scrolled
          ? "border-deck-700 bg-deck-900/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 lg:px-8">
        <a href="#preflight" className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold tracking-[0.2em] text-amber">
            DH
          </span>
          <span className="hidden font-mono text-[10px] tracking-[0.16em] text-ink-faint sm:inline">
            / FLIGHT DECK
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] transition-colors ${
                  active === n.id
                    ? "text-amber-bright"
                    : "text-ink-faint hover:text-ink-dim"
                }`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#blackbox"
          className="border border-amber-dim px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-amber transition-colors hover:bg-amber hover:text-deck-950"
        >
          TRANSMIT
        </a>
      </div>
    </nav>
  );
}
