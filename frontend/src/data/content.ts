// Static content for the deck. Numbers are real-ish to Daffa's history, not AI-faked precision.

export const PROFILE = {
  callsign: "DAFFA HAIDAR",
  role: "Web3 Community Operator who builds with AI",
  base: "Indonesia",
  status: "AVAILABLE FOR BOARDING",
  summary:
    "Six years on the apron of crypto: ran nodes, stood up validators, led communities, got burned, learned security the hard way. Now flying toward AI agents and the work that makes me feel human.",
};

export interface Instrument {
  label: string;
  value: number; // 0..100 for the gauge sweep
  readout: string; // what the needle means in words
  unit: string;
}

// Gauges — value is dial fill %, readout is the honest label.
export const INSTRUMENTS: Instrument[] = [
  { label: "INFRA / NODES", value: 88, readout: "Validators, RPC, uptime", unit: "OPS" },
  { label: "SECURITY", value: 82, readout: "Bug bounty, audits, recon", unit: "RED" },
  { label: "WEB3 / DEFI", value: 90, readout: "6 yrs on-chain native", unit: "CHAIN" },
  { label: "AI AGENTS", value: 74, readout: "Automation, tooling, RAG", unit: "AGENT" },
  { label: "DEVREL / COMMS", value: 79, readout: "Lead, writer, translator", unit: "VOICE" },
  { label: "AVIATION", value: 61, readout: "MRO floor, NDT, PPL dream", unit: "MRO" },
];

export interface Project {
  name: string;
  codename: string;
  desc: string;
  stack: string[];
  link?: string;
  status: "DEPLOYED" | "ACTIVE" | "ARCHIVED";
}

export const PROJECTS: Project[] = [
  {
    name: "WarungKita",
    codename: "PAYLOAD-01",
    desc: "Chat-first POS for Indonesian micro-businesses. Zero onboarding, WhatsApp-style, local-first parser. Built for ibu warung, not for dashboards.",
    stack: ["PWA", "Vanilla JS", "Serverless", "SQLite"],
    link: "https://warungkita.vercel.app",
    status: "DEPLOYED",
  },
  {
    name: "Solana Token Intel",
    codename: "PAYLOAD-02",
    desc: "Due-diligence scanner for any SPL token. Creator history, pool health, honeypot signals. Give it a mint, get the truth.",
    stack: ["Node", "Solana web3.js", "Helius"],
    status: "ACTIVE",
  },
  {
    name: "Daily Bible Verse",
    codename: "PAYLOAD-03",
    desc: "A PWA built as a gift. Still live long after the reason it was made. Some code you keep flying out of principle.",
    stack: ["PWA", "React", "Service Worker"],
    status: "DEPLOYED",
  },
  {
    name: "Mount Olympus",
    codename: "PAYLOAD-04",
    desc: "Co-op raid game on Roblox. Three-boss sequence, anti-meta design, skill expression over loot. Cerberus, Hercules, Medusa.",
    stack: ["Roblox", "Luau", "Game Design"],
    status: "ACTIVE",
  },
];

export const NAV = [
  { id: "preflight", label: "PRE-FLIGHT" },
  { id: "instruments", label: "INSTRUMENTS" },
  { id: "flightlog", label: "FLIGHT LOG" },
  { id: "payload", label: "PAYLOAD" },
  { id: "blackbox", label: "BLACK BOX" },
];
