"use client";

import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import CaesarDemo from "@/components/demos/CaesarDemo";
import CaesarAttack from "@/components/attacks/CaesarAttack";

interface StationProps {
  era: Era;
}

const TIMELINE_EVENTS = [
  { year: "58 BC", label: "Gallic Wars begin", detail: "Caesar uses shift cipher to coordinate troop movements across vast distances" },
  { year: "50 BC", label: "Cipher documented", detail: "Shift-3 becomes the standard for all Roman military dispatches and personal correspondence" },
  { year: "60 AD", label: "Suetonius records it", detail: "Roman biographer documents the cipher in The Twelve Caesars — our earliest written record" },
  { year: "9th c.", label: "Al-Kindi breaks it", detail: "Arab polymath invents frequency analysis, rendering all simple substitution ciphers obsolete" },
  { year: "Today", label: "ROT13 lives on", detail: "Modern variant ROT13 (shift 13) still used in online forums and programming to lightly obscure text" },
];

const KEY_FIGURES = [
  { name: "Julius Caesar", role: "Roman General & Dictator", note: "Used shift-3 for military dispatches and personal letters to Cicero" },
  { name: "Al-Kindi", role: "Arab Polymath (801–873 AD)", note: "Invented frequency analysis — the technique that permanently breaks all Caesar-family ciphers" },
  { name: "Suetonius", role: "Roman Biographer (69–122 AD)", note: "Documented the cipher in writing, providing the earliest historical record we have" },
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

export default function CaesarStation({ era }: StationProps) {
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
          In 58 BC, Julius Caesar needed to coordinate troop movements across hundreds of miles without
          his messages falling into enemy hands. His solution was elegant: shift every letter of the
          alphabet by 3 positions.{" "}
          <em style={{ color: "var(--text-primary)" }}>ATTACK AT DAWN</em> became{" "}
          <em style={{ color: era.color }}>DWWDFN DW GDZQ</em>. Enemies who intercepted the message
          saw only gibberish — unless they knew the key.
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          For nearly a century this worked. But in the 9th century, the Arab polymath Al-Kindi
          discovered that letters appear with predictable frequency in any language. In English,
          &apos;E&apos; appears ~12.7% of the time. If the most common letter in the ciphertext is &apos;H&apos;,
          the shift is almost certainly 3. The cipher was broken — permanently.
        </p>
      </motion.div>

      {/* Key Figures + Timeline side by side */}
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
                <p className="font-mono text-xs mt-0.5 mb-1.5" style={{ color: era.color + "cc" }}>{fig.role}</p>
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
          <CaesarDemo era={era} />
          <CaesarAttack era={era} />
        </div>
      </div>
    </div>
  );
}
