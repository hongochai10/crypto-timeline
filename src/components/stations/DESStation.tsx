"use client";

import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import DESDemo from "@/components/demos/DESDemo";
import DESAttack from "@/components/attacks/DESAttack";

interface StationProps {
  era: Era;
}

const TIMELINE_EVENTS = [
  { year: "1973", label: "NBS issues a call", detail: "National Bureau of Standards asks for a national encryption standard — IBM submits Lucifer" },
  { year: "1975", label: "NSA trims the key", detail: "NSA reduces Lucifer's 64-bit key to 56 bits — sparking decades of controversy over backdoor fears" },
  { year: "1977", label: "DES adopted", detail: "FIPS 46 makes DES the official US government and banking encryption standard" },
  { year: "1998", label: "Deep Crack breaks it", detail: "EFF's $250,000 machine cracks a DES key in 22 hours, proving 56-bit keys are insufficient" },
  { year: "1999", label: "DES officially deprecated", detail: "Triple-DES (3DES) recommended as stopgap; AES competition already underway" },
  { year: "2001", label: "Replaced by AES", detail: "AES officially supersedes DES as the federal encryption standard" },
];

const KEY_FIGURES = [
  { name: "Walter Tuchman & Carl Meyer", role: "IBM Engineers", note: "Designed Lucifer (DES predecessor) — the algorithm that became DES after NSA modifications" },
  { name: "Whitfield Diffie", role: "Cryptographer", note: "Publicly criticized the 56-bit key size in 1977, predicting it would eventually be brute-forced" },
  { name: "EFF Deep Crack Team", role: "Electronic Frontier Foundation", note: "Built a $250,000 FPGA-based cracker in 1998 that exhausted the key space in 22 hours" },
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

export default function DESStation({ era }: StationProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Historical Narrative */}
      <motion.div
        className="rounded-xl border p-5 md:p-6"
        style={{ borderColor: era.color + "22", backgroundColor: era.color + "08" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          Historical Narrative
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          In 1973, the US government had no unified encryption standard. Banks, agencies, and
          contractors each invented their own — a fragmented mess. The National Bureau of Standards
          (now NIST) issued an open call. IBM answered with <em style={{ color: "var(--text-primary)" }}>Lucifer</em>,
          a 64-bit block cipher born from internal research. NSA quietly intervened — trimming the key
          to 56 bits and adjusting the S-boxes. Cryptographers cried foul. Had the NSA weakened it intentionally?
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          For 20 years DES encrypted everything from ATM transactions to classified communications.
          Then in 1998, the EFF built{" "}
          <em style={{ color: era.color }}>Deep Crack</em> — a $250,000 machine with 1,856 custom chips
          — and cracked a DES key in just 22 hours. A cipher trusted by millions had fallen.
          With only 2⁵⁶ (~72 quadrillion) possible keys, brute force had become feasible.
        </p>
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
              <TimelineRow key={event.year} event={event} color={era.color} index={i} />
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
          <DESDemo era={era} />
          <DESAttack era={era} />
        </div>
      </div>
    </div>
  );
}
