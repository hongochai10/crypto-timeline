"use client";

import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import AESDemo from "@/components/demos/AESDemo";
import AESAttack from "@/components/attacks/AESAttack";

interface StationProps {
  era: Era;
}

const TIMELINE_EVENTS = [
  { year: "1997", label: "NIST competition announced", detail: "15 submissions from teams worldwide; requirements: 128-bit block, variable key (128/192/256-bit)" },
  { year: "1998", label: "Round 1 — 15 candidates", detail: "Rijndael, Serpent, Twofish, RC6, and MARS emerge as frontrunners" },
  { year: "1999", label: "Round 2 — 5 finalists", detail: "Extensive public cryptanalysis; Rijndael praised for elegant math and implementation efficiency" },
  { year: "2000", label: "Rijndael wins", detail: "NIST selects Rijndael by Joan Daemen & Vincent Rijmen (Belgium) as the new AES standard" },
  { year: "2001", label: "FIPS 197 published", detail: "AES officially adopted as US federal standard, replacing DES in all government use" },
  { year: "Today", label: "Universally deployed", detail: "AES encrypts Wi-Fi (WPA2/3), HTTPS, disk encryption, messaging apps, and classified US communications" },
];

const KEY_FIGURES = [
  { name: "Joan Daemen & Vincent Rijmen", role: "Belgian Cryptographers", note: "Designed Rijndael, selected as AES. Daemen also co-designed SHA-3 (Keccak) later" },
  { name: "Bruce Schneier", role: "Twofish co-designer", note: "Submitted Twofish as AES candidate; became one of the most respected cryptography voices after the competition" },
  { name: "NIST team", role: "National Institute of Standards & Technology", note: "Ran an unprecedented open, global competition — credited as the gold standard for algorithm standardization" },
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

export default function AESStation({ era }: StationProps) {
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
          After Deep Crack shattered DES, NIST did something unprecedented in cryptography: they
          held an open global competition. Any team, anywhere in the world, could submit an algorithm.
          15 candidates were submitted and subjected to years of public cryptanalysis by the world&apos;s
          best cryptographers. Transparency replaced secrecy.
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Two Belgian cryptographers — Joan Daemen and Vincent Rijmen — submitted{" "}
          <em style={{ color: era.color }}>Rijndael</em>, an elegant design based on finite field
          mathematics. It was fast in hardware, fast in software, and resisted every known attack.
          AES-256 has a keyspace of 2²⁵⁶ — more combinations than atoms in the observable universe.
          No practical attack exists to this day. It encrypts everything from your Wi-Fi to
          classified US government communications.
        </p>
      </motion.div>

      {/* Keyspace visualization */}
      <motion.div
        className="rounded-xl border p-5"
        style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <h3 className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          Why AES Is Unbreakable (Practically)
        </h3>
        <div className="grid gap-4 sm:grid-cols-3 font-mono text-center">
          {[
            { label: "DES keys", value: "2⁵⁶", sub: "~7.2 × 10¹⁶", note: "Cracked in 22 hrs", warn: true },
            { label: "AES-128 keys", value: "2¹²⁸", sub: "~3.4 × 10³⁸", note: "Heat death of universe" },
            { label: "AES-256 keys", value: "2²⁵⁶", sub: "~1.2 × 10⁷⁷", note: "More than atoms in universe" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border p-3"
              style={{
                borderColor: item.warn ? "rgba(239,68,68,0.3)" : era.color + "25",
                backgroundColor: item.warn ? "rgba(239,68,68,0.07)" : era.color + "08",
              }}
            >
              <p className="text-xs mb-1" style={{ color: item.warn ? "#ef4444" : era.color + "99" }}>{item.label}</p>
              <p className="text-2xl font-bold" style={{ color: item.warn ? "#ef4444" : era.color }}>{item.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{item.sub}</p>
              <p className="text-xs mt-1 font-semibold" style={{ color: item.warn ? "#ef4444" : "var(--text-secondary)" }}>{item.note}</p>
            </div>
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
          <AESDemo era={era} />
          <AESAttack era={era} />
        </div>
      </div>
    </div>
  );
}
