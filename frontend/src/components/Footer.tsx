"use client";
import { useState, useEffect } from "react";
import { GithubLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react";
import { api } from "../lib/api";

const LINKS = [
  { icon: GithubLogo, label: "GitHub", href: "https://github.com/daffhaidar" },
  { icon: LinkedinLogo, label: "LinkedIn", href: "https://linkedin.com/in/daffhaidar" },
  { icon: EnvelopeSimple, label: "Email", href: "mailto:feriyantoa18@gmail.com" },
];

export default function Footer() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    // Count this visit once per session.
    const seen = sessionStorage.getItem("deck-pinged");
    const call = seen ? api.telemetry() : api.ping();
    if (!seen) sessionStorage.setItem("deck-pinged", "1");
    call.then((d) => setVisits(d.visits)).catch(() => setVisits(null));
  }, []);

  return (
    <footer className="border-t border-deck-700 bg-deck-950 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="font-mono text-sm font-bold tracking-[0.2em] text-amber">
            DAFFA HAIDAR
          </div>
          <p className="mt-2 max-w-md text-sm text-ink-faint">
            Built as a farewell flight. Frontend, backend, and every gauge on
            this deck were hand-assembled.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="flex gap-3">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                className="border border-deck-700 p-2.5 text-ink-dim transition-colors hover:border-amber-dim hover:text-amber"
              >
                <l.icon size={18} weight="bold" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-ink-faint">
            <span className="h-1.5 w-1.5 bg-signal" />
            {visits !== null ? (
              <span>{visits.toLocaleString()} souls on board</span>
            ) : (
              <span>telemetry offline</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
