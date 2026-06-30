"use client";
import { motion, useReducedMotion } from "motion/react";

// A real SVG instrument gauge — needle sweeps from -120deg to +120deg based on value 0..100.
export default function Gauge({
  label,
  value,
  readout,
  unit,
  delay = 0,
}: {
  label: string;
  value: number;
  readout: string;
  unit: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const angle = -120 + (value / 100) * 240; // map 0..100 -> -120..120 deg
  const R = 52;
  const cx = 70;
  const cy = 70;

  // arc tick marks
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const a = (-120 + i * 20) * (Math.PI / 180);
    const x1 = cx + Math.sin(a) * R;
    const y1 = cy - Math.cos(a) * R;
    const x2 = cx + Math.sin(a) * (R - (i % 3 === 0 ? 9 : 5));
    const y2 = cy - Math.cos(a) * (R - (i % 3 === 0 ? 9 : 5));
    return { x1, y1, x2, y2, major: i % 3 === 0 };
  });

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay }}
      className="group relative border border-deck-700 bg-deck-850/60 p-5 transition-colors hover:border-amber-dim"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.18em] text-ink-dim">
          {label}
        </span>
        <span className="font-mono text-[10px] tracking-[0.14em] text-amber-dim">
          {unit}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-4">
        <svg viewBox="0 0 140 100" className="h-24 w-32 shrink-0">
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.major ? "#8a6535" : "#2a3344"}
              strokeWidth={t.major ? 1.5 : 1}
            />
          ))}
          {/* arc */}
          <path
            d="M 22 70 A 52 52 0 0 1 118 70"
            fill="none"
            stroke="#1c2230"
            strokeWidth="2"
          />
          {/* needle */}
          <motion.line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - R + 6}
            stroke="#e0a458"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ originX: "70px", originY: "70px" }}
            initial={reduce ? false : { rotate: -120 }}
            whileInView={{ rotate: angle }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <circle cx={cx} cy={cy} r="5" fill="#141821" stroke="#e0a458" strokeWidth="1.5" />
        </svg>

        <div className="min-w-0">
          <div className="font-mono text-2xl font-bold text-amber-bright">
            {value}
            <span className="text-sm text-ink-faint">%</span>
          </div>
          <p className="mt-1 text-xs leading-snug text-ink-dim">{readout}</p>
        </div>
      </div>
    </motion.div>
  );
}
