"use client";

import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import RSADemo from "@/components/demos/RSADemo";
import RSAAttack from "@/components/attacks/RSAAttack";

interface StationProps {
  era: Era;
}

const TIMELINE_EVENTS = [
  { year: "1976", label: "Diffie & Hellman publish", detail: "New Directions in Cryptography — describes asymmetric key exchange for the first time publicly" },
  { year: "1977", label: "RSA invented", detail: "Rivest, Shamir & Adleman publish the RSA algorithm in an MIT technical memo — first practical public-key crypto" },
  { year: "1977", label: "Martin Gardner publishes it", detail: "Scientific American column introduces RSA to the world — and offers a $100 challenge to factor a 129-digit number" },
  { year: "1994", label: "Shor's algorithm", detail: "Peter Shor proves a quantum computer could factor large integers in polynomial time — RSA&apos;s theoretical death sentence" },
  { year: "1994", label: "RSA-129 factored", detail: "Gardner's 1977 challenge finally cracked by 600 volunteers across the internet using distributed computing" },
  { year: "Today", label: "Powers HTTPS", detail: "RSA still secures TLS handshakes for most websites; migration to post-quantum alternatives underway" },
];

const KEY_FIGURES = [
  { name: "Ron Rivest, Adi Shamir, Leonard Adleman", role: "MIT Cryptographers (1977)", note: "RSA was invented after Clifford Cocks (GCHQ) did it secretly in 1973 — but RSA became the public, credited invention" },
  { name: "Clifford Cocks", role: "GCHQ Mathematician (1973)", note: "Independently invented RSA 4 years earlier — classified until 1997. An uncredited parallel discovery" },
  { name: "Peter Shor", role: "MIT Mathematician (1994)", note: "Proved a sufficiently large quantum computer breaks RSA — triggering the post-quantum cryptography race" },
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

export default function RSAStation({ era }: StationProps) {
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
          Before RSA, cryptography had an unsolvable problem: to communicate secretly, two parties
          needed to already share a secret key — but how could they share it without meeting in person?
          In 1976, Diffie and Hellman described the idea of public-key cryptography theoretically.
          A year later, three MIT professors —{" "}
          <em style={{ color: "var(--text-primary)" }}>Rivest, Shamir, and Adleman</em> — made it real.
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          RSA&apos;s elegance: multiplying two large primes is trivial, but factoring the result back
          into those primes is computationally infeasible for classical computers. This mathematical
          trapdoor lets anyone encrypt a message with your{" "}
          <em style={{ color: era.color }}>public key</em>, but only you can decrypt it with your{" "}
          <em style={{ color: era.color }}>private key</em>. It unlocked HTTPS, email encryption,
          and secure banking. What no one knew in 1977 was that GCHQ mathematician Clifford Cocks
          had discovered the same thing 4 years earlier — classified until 1997.
        </p>
      </motion.div>

      {/* How it works callout */}
      <motion.div
        className="rounded-xl border p-5"
        style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <h3 className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          The Mathematical Trapdoor
        </h3>
        <div className="grid gap-3 sm:grid-cols-3 font-mono text-xs">
          {[
            { step: "01", label: "Pick two large primes", value: "p = 61, q = 53", detail: "In practice: 2048-bit primes" },
            { step: "02", label: "Compute n = p × q", value: "n = 3,233", detail: "Easy to compute, hard to reverse" },
            { step: "03", label: "Public key encrypts", value: "e = 17, n = 3,233", detail: "Anyone can encrypt with this" },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-lg border p-3"
              style={{ borderColor: era.color + "22", backgroundColor: era.color + "08" }}
            >
              <p className="text-[10px] tracking-widest mb-1" style={{ color: era.color + "80" }}>STEP {item.step}</p>
              <p className="font-semibold text-xs mb-1" style={{ color: "var(--text-primary)" }}>{item.label}</p>
              <p className="text-sm font-bold mb-1" style={{ color: era.color }}>{item.value}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.detail}</p>
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
          <RSADemo era={era} />
          <RSAAttack era={era} />
        </div>
      </div>
    </div>
  );
}
