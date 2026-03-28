"use client";

import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import { quantumThreatAnalysis, nistPQCTimeline } from "@/lib/crypto/pqc";

interface Props {
  era: Era;
}

const SHOR_STEPS = [
  { step: "1", label: "Superposition", desc: "Quantum computer initializes qubits in superposition of all possible states simultaneously" },
  { step: "2", label: "Quantum Parallelism", desc: "Evaluates modular exponentiation for ALL possible periods at once — exponential speedup" },
  { step: "3", label: "QFT", desc: "Quantum Fourier Transform finds the period r of f(x) = aˣ mod N" },
  { step: "4", label: "Period → Factors", desc: "Classical post-processing: r → gcd(aʳ/² ± 1, N) → prime factors p, q" },
  { step: "5", label: "RSA broken", desc: "Private key recovered from public key in polynomial time O((log N)³)" },
];

export default function PQCAttack({ era }: Props) {
  const threats = quantumThreatAnalysis();
  const timeline = nistPQCTimeline();

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase text-red-400">
          Attack Demo
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">Shor&apos;s algorithm — quantum threat to classical crypto</p>
      </div>

      {/* Quantum vs Classical visualization */}
      <div className="rounded-lg border p-4" style={{ borderColor: "#ef444430", backgroundColor: "#ef444406" }}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-red-400 mb-3">Classical vs Quantum computation</p>
        <div className="flex gap-4">
          {/* Classical: sequential */}
          <div className="flex-1">
            <p className="font-mono text-[9px] text-[var(--text-muted)] mb-2 uppercase">Classical</p>
            <div className="flex flex-col gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="h-4 rounded-sm"
                  style={{ backgroundColor: "#6b7280", width: "100%" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6, delay: (i - 1) * 0.6, repeat: Infinity, repeatDelay: 3 }}
                />
              ))}
            </div>
            <p className="font-mono text-[9px] text-[var(--text-muted)] mt-1">Sequential — one key at a time</p>
          </div>
          {/* Quantum: parallel */}
          <div className="flex-1">
            <p className="font-mono text-[9px] text-[var(--text-muted)] mb-2 uppercase">Quantum</p>
            <div className="flex flex-col gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="h-4 rounded-sm"
                  style={{ backgroundColor: "#ef4444" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1] }}
                  transition={{ duration: 0.2, delay: 0.1 * i, repeat: Infinity, repeatDelay: 3.4 }}
                />
              ))}
            </div>
            <p className="font-mono text-[9px] text-red-400 mt-1">Parallel — all states at once</p>
          </div>
        </div>
      </div>

      {/* Shor's algorithm steps */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Shor&apos;s Algorithm — how it breaks RSA</p>
        <div className="space-y-2">
          {SHOR_STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              className="flex gap-3 rounded-lg border px-3 py-2.5"
              style={{ borderColor: "#ef444425", backgroundColor: "#ef444406" }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="shrink-0 font-mono text-xs font-bold text-red-400 w-4">{s.step}</span>
              <div>
                <p className="font-mono text-[10px] font-bold text-red-400 mb-0.5">{s.label}</p>
                <p className="font-mono text-[10px] text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Threat table */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Quantum threat analysis</p>
        <div className="space-y-2">
          {threats.map((t) => (
            <div
              key={t.algorithm}
              className="rounded-lg border px-3 py-2.5"
              style={{
                borderColor: t.broken ? "#ef444430" : era.color + "30",
                backgroundColor: t.broken ? "#ef444408" : era.color + "08",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold" style={{ color: t.broken ? "#f87171" : era.color }}>
                  {t.algorithm}
                </span>
                <span
                  className="font-mono text-[9px] rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: t.broken ? "#ef444430" : era.color + "25",
                    color: t.broken ? "#f87171" : era.color,
                  }}
                >
                  {t.broken ? "⚠ BROKEN by quantum" : "✓ Quantum-safe"}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">Quantum: {t.quantumSecurity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NIST Timeline */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">NIST PQC Standardization</p>
        <div className="space-y-2">
          {timeline.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-mono text-[10px] shrink-0 pt-0.5" style={{ color: era.color }}>{item.year}</span>
              <div className="w-px self-stretch shrink-0" style={{ backgroundColor: era.color + "30" }} />
              <p className="font-mono text-[10px] text-[var(--text-muted)] leading-relaxed">{item.event}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
