"use client";

import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import { aesKeyspaceInfo } from "@/lib/crypto/aes";

interface Props {
  era: Era;
}

const COMPARISONS = [
  { label: "AES-256 keyspace", value: "2²⁵⁶ ≈ 1.16 × 10⁷⁷", note: "keys" },
  { label: "Atoms in universe", value: "≈ 10⁸⁰", note: "atoms" },
  { label: "Stars in observable universe", value: "≈ 10²⁴", note: "stars" },
  { label: "Seconds since Big Bang", value: "≈ 4.3 × 10¹⁷", note: "seconds" },
];

const KNOWN_ATTACKS = [
  { name: "Brute Force", status: "Impossible", detail: "10⁷⁷ operations — heat death of universe required", broken: false },
  { name: "Related-Key Attack", status: "Theoretical", detail: "Requires 2⁹⁹·⁵ operations — impractical", broken: false },
  { name: "Biclique Cryptanalysis", status: "Academic only", detail: "Reduces to 2²⁵⁴·⁴ — still infeasible", broken: false },
  { name: "Side-Channel Attack", status: "Implementation risk", detail: "Targets weak implementations, not the algorithm", broken: true },
  { name: "Grover's Algorithm", status: "Quantum halving", detail: "Reduces to 2¹²⁸ — AES-256 remains secure", broken: false },
];

export default function AESAttack({ era }: Props) {
  const info = aesKeyspaceInfo();

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          Attack Demo
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">No practical attack exists — 2²⁵⁶ keyspace</p>
      </div>

      {/* Shield visual */}
      <motion.div
        className="flex flex-col items-center justify-center rounded-xl border py-8"
        style={{ borderColor: era.color + "30", backgroundColor: era.color + "08" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-5xl mb-3"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🛡
        </motion.div>
        <p className="font-mono text-lg font-bold" style={{ color: era.color }}>UNBROKEN</p>
        <p className="font-mono text-xs text-[var(--text-muted)] mt-1">Since standardization in 2001</p>
      </motion.div>

      {/* Scale comparison */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Scale comparison</p>
        <div className="space-y-2">
          {COMPARISONS.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ backgroundColor: era.color + "08", border: `1px solid ${era.color}18` }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{item.label}</span>
              <span className="font-mono text-[10px] font-bold" style={{ color: era.color }}>{item.value}</span>
            </motion.div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-[var(--text-muted)] leading-relaxed">{info.ratio}</p>
      </div>

      {/* Known attack attempts */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Known attack attempts</p>
        <div className="space-y-2">
          {KNOWN_ATTACKS.map((attack) => (
            <div
              key={attack.name}
              className="rounded-lg border px-3 py-2.5"
              style={{
                borderColor: attack.broken ? "#f97316" + "40" : era.color + "20",
                backgroundColor: attack.broken ? "#f97316" + "08" : "transparent",
              }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-mono text-xs font-bold" style={{ color: attack.broken ? "#f97316" : era.color }}>
                  {attack.name}
                </span>
                <span
                  className="font-mono text-[9px] rounded-full px-2 py-0.5 uppercase tracking-widest"
                  style={{
                    backgroundColor: attack.broken ? "#f9741620" : era.color + "18",
                    color: attack.broken ? "#f97316" : era.color,
                  }}
                >
                  {attack.status}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">{attack.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
