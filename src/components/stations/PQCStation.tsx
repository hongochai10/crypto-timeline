"use client";

import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import PQCDemo from "@/components/demos/PQCDemo";
import PQCAttack from "@/components/attacks/PQCAttack";

interface StationProps {
  era: Era;
}

const TIMELINE_EVENTS = [
  { year: "1994", label: "Shor's algorithm", detail: "Peter Shor proves a quantum computer can factor large integers in polynomial time — RSA and ECC both threatened" },
  { year: "2001", label: "First qubit demonstrations", detail: "IBM and other labs demonstrate small quantum circuits; the engineering challenge becomes clear" },
  { year: "2016", label: "NIST PQC competition", detail: "NIST launches a global competition for quantum-resistant algorithms — 82 submissions from 25 countries" },
  { year: "2022", label: "Finalists selected", detail: "CRYSTALS-Kyber (KEM) and CRYSTALS-Dilithium, FALCON, SPHINCS+ (signatures) selected for standardization" },
  { year: "2024", label: "FIPS 203/204/205 published", detail: "NIST officially standardizes ML-KEM (Kyber), ML-DSA (Dilithium), and SLH-DSA — the post-quantum era begins" },
  { year: "Now", label: "The migration begins", detail: "Governments, cloud providers, and browsers begin migrating infrastructure — a multi-year, global effort" },
];

const KEY_FIGURES = [
  { name: "Peter Shor", role: "MIT Mathematician (1994)", note: "Shor's algorithm for quantum integer factorization — the mathematical sword hanging over RSA and ECC" },
  { name: "Oded Regev", role: "NYU Mathematician (2005)", note: "Invented the Learning With Errors (LWE) problem — the mathematical foundation of Kyber and Dilithium" },
  { name: "CRYSTALS Team", role: "IBM, CWI, Radboud, others", note: "Designed CRYSTALS-Kyber and Dilithium — now ML-KEM and ML-DSA, the world's first post-quantum standards" },
];

const THREAT_COMPARISON = [
  { algo: "Caesar", threat: "Classical", icon: "⚔️", status: "broken", color: "#ef4444" },
  { algo: "DES", threat: "Classical", icon: "💻", status: "broken", color: "#ef4444" },
  { algo: "AES-256", threat: "Quantum (Grover)", icon: "⚛️", status: "weakened", color: "#f59e0b", note: "Halves key strength — AES-256 → AES-128 equivalent" },
  { algo: "RSA/ECC", threat: "Quantum (Shor)", icon: "⚛️", status: "broken", color: "#ef4444", note: "Polynomial time factoring — both broken by Shor" },
  { algo: "Kyber/Dilithium", threat: "Quantum", icon: "🔒", status: "safe", color: "#10b981", note: "Lattice problems resist both classical and quantum attacks" },
];

function TimelineRow({ event, color, index }: { event: typeof TIMELINE_EVENTS[0]; color: string; index: number }) {
  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col items-center pt-1 shrink-0">
        <div className="h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: color, backgroundColor: color + "33" }} />
        <div className="mt-1 w-px flex-1 min-h-[2rem]" style={{ backgroundColor: color + "25" }} />
      </div>
      <div className="pb-4 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-mono text-xs font-bold tracking-widest" style={{ color }}>{event.year}</span>
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{event.label}</span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{event.detail}</p>
      </div>
    </motion.div>
  );
}

export default function PQCStation({ era }: StationProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* "We Are Here" banner */}
      <motion.div
        className="rounded-xl border-2 p-5 md:p-6 relative overflow-hidden"
        style={{ borderColor: era.color + "60", backgroundColor: era.color + "10" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated background pulse */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ background: `radial-gradient(ellipse at center, ${era.color}15 0%, transparent 70%)` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <motion.div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: era.color }}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-mono text-xs uppercase tracking-widest font-bold" style={{ color: era.color }}>
              You Are Here — 2024+
            </span>
          </div>
          <h3 className="mb-3 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            The Quantum Threat Is Real — and the Migration Has Begun
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            In 1994, Peter Shor proved that a large-enough quantum computer could break RSA and ECC
            in polynomial time. For 30 years, this was theoretical. Now, IBM, Google, and others
            have quantum computers with thousands of qubits — still not enough to break RSA-2048
            today, but the trajectory is clear.{" "}
            <em style={{ color: era.color }}>Cryptographically Relevant Quantum Computers (CRQCs)</em>{" "}
            are estimated to arrive between 2030 and 2040.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            The danger isn&apos;t just future attacks — it&apos;s{" "}
            <em style={{ color: era.color }}>harvest-now, decrypt-later</em>. Nation-state actors
            are collecting encrypted traffic today, waiting for quantum computers powerful enough to
            decrypt it. Sensitive data encrypted in 2024 could be read in 2035. NIST&apos;s response:
            CRYSTALS-Kyber and CRYSTALS-Dilithium, standardized in 2024 as the first official
            post-quantum algorithms. The race to migrate has begun.
          </p>
        </div>
      </motion.div>

      {/* Quantum threat table */}
      <motion.div
        className="rounded-xl border p-5"
        style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <h3 className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          Quantum Threat Assessment — All Algorithms
        </h3>
        <div className="flex flex-col gap-2">
          {THREAT_COMPARISON.map((row, i) => (
            <motion.div
              key={row.algo}
              className="flex items-center gap-3 rounded-lg border px-3 py-2 font-mono text-xs"
              style={{ borderColor: row.color + "22", backgroundColor: row.color + "08" }}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <span className="text-base shrink-0">{row.icon}</span>
              <span className="font-bold w-28 shrink-0" style={{ color: "var(--text-primary)" }}>{row.algo}</span>
              <span className="w-24 shrink-0" style={{ color: "var(--text-muted)" }}>{row.threat}</span>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: row.color, backgroundColor: row.color + "18", border: `1px solid ${row.color}30` }}
              >
                {row.status}
              </span>
              {row.note && (
                <span className="hidden sm:block" style={{ color: "var(--text-muted)" }}>{row.note}</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Figures + Timeline */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
            Key Figures
          </h3>
          <div className="flex flex-col gap-3">
            {KEY_FIGURES.map((fig, i) => (
              <motion.div
                key={fig.name}
                className="rounded-lg border p-3"
                style={{ borderColor: era.color + "20", backgroundColor: era.color + "06" }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{fig.name}</p>
                <p className="font-mono text-xs mt-0.5 mb-1.5" style={{ color: era.color + "99" }}>{fig.role}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{fig.note}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
            Timeline
          </h3>
          <div>
            {TIMELINE_EVENTS.map((event, i) => (
              <TimelineRow key={event.year + event.label} event={event} color={era.color} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Demo + Attack */}
      <div>
        <h3 className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          Interactive Demos
        </h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <PQCDemo era={era} />
          <PQCAttack era={era} />
        </div>
      </div>
    </div>
  );
}
