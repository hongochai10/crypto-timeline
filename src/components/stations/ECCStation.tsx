"use client";

import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import ECCDemo from "@/components/demos/ECCDemo";
import ECCAttack from "@/components/attacks/ECCAttack";

interface StationProps {
  era: Era;
}

const TIMELINE_EVENTS = [
  { year: "1985", label: "Koblitz & Miller independently", detail: "Neal Koblitz and Victor Miller separately propose using elliptic curves for cryptography — neither knew about the other" },
  { year: "1999", label: "NSA adopts Suite B", detail: "NSA recommends ECC for government use — first major institutional endorsement" },
  { year: "2004", label: "BlackBerry uses ECC", detail: "Mobile devices adopt ECC for its small key size — 256-bit ECC replaces 3072-bit RSA in many applications" },
  { year: "2008", label: "Bitcoin launches with secp256k1", detail: "Satoshi Nakamoto chooses ECC curve secp256k1 for Bitcoin digital signatures — still securing trillions in value" },
  { year: "2013", label: "NSA Dual_EC controversy", detail: "Snowden revelations suggest NSA may have backdoored the Dual_EC_DRBG elliptic curve standard" },
  { year: "2015", label: "TLS 1.3 defaults to ECC", detail: "The new TLS standard prefers ECDHE key exchange — most HTTPS connections now use ECC" },
];

const KEY_FIGURES = [
  { name: "Neal Koblitz", role: "University of Washington Mathematician (1985)", note: "Independently proposed ECC — also a co-inventor of Hyperelliptic curve cryptography" },
  { name: "Victor Miller", role: "IBM Research Mathematician (1985)", note: "Independently proposed ECC in the same year — both papers presented at CRYPTO 1985" },
  { name: "Satoshi Nakamoto", role: "Bitcoin creator (2008)", note: "Chose secp256k1 ECC curve for Bitcoin wallets and signatures — still securing all BTC transactions" },
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

export default function ECCStation({ era }: StationProps) {
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
          RSA works — but its keys are enormous. A 2048-bit RSA key is required for basic security.
          For the smartphones and embedded devices of the 1990s and 2000s, this was prohibitively
          expensive in compute and battery. Elliptic Curve Cryptography solves this with elegant
          geometry: operations on points along a mathematical curve defined as{" "}
          <em style={{ color: era.color }}>y² = x³ + ax + b</em>.
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          A 256-bit ECC key provides the same security as a 3072-bit RSA key. This dramatic efficiency
          gain made ECC ideal for mobile devices, TLS certificates, and blockchain wallets.
          When Satoshi Nakamoto designed Bitcoin in 2008, they chose ECC curve{" "}
          <em style={{ color: era.color }}>secp256k1</em> for digital signatures — an unusual curve
          with near-prime structure properties. Every Bitcoin transaction signed today uses ECC.
          Like RSA, ECC is vulnerable to Shor&apos;s algorithm on quantum computers.
        </p>
      </motion.div>

      {/* Key size comparison */}
      <motion.div
        className="rounded-xl border p-5"
        style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <h3 className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          ECC vs RSA — Key Size for Equivalent Security
        </h3>
        <div className="grid gap-3 sm:grid-cols-4 font-mono text-xs text-center">
          {[
            { rsa: "1024-bit RSA", ecc: "160-bit ECC", security: "~80-bit" },
            { rsa: "2048-bit RSA", ecc: "224-bit ECC", security: "~112-bit" },
            { rsa: "3072-bit RSA", ecc: "256-bit ECC", security: "~128-bit" },
            { rsa: "15360-bit RSA", ecc: "521-bit ECC", security: "~256-bit" },
          ].map((row) => (
            <div key={row.rsa} className="rounded-lg border p-2.5" style={{ borderColor: era.color + "22", backgroundColor: era.color + "08" }}>
              <p className="text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>Security</p>
              <p className="font-bold text-sm mb-2" style={{ color: era.color }}>{row.security}</p>
              <p className="text-[10px] mb-0.5" style={{ color: "rgba(168,85,247,0.8)" }}>{row.rsa}</p>
              <p className="text-[10px]" style={{ color: era.color + "cc" }}>{row.ecc}</p>
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
          <ECCDemo era={era} />
          <ECCAttack era={era} />
        </div>
      </div>
    </div>
  );
}
