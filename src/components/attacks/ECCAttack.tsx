"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import { eccVsRsaComparison } from "@/lib/crypto/ecc";

interface Props {
  era: Era;
}

// Toy elliptic curve over a small field for visualization
// y² = x³ - x + 1 (mod 17)
function toyECPoints(p: number, a: number, b: number): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (let x = 0; x < p; x++) {
    const rhs = ((x ** 3 + a * x + b) % p + p) % p;
    for (let y = 0; y < p; y++) {
      if ((y * y) % p === rhs) {
        points.push([x, y]);
      }
    }
  }
  return points;
}

const PRIME = 17;
const EC_POINTS = toyECPoints(PRIME, -1, 1);

const DLP_STEPS = [
  { label: "Pick private key k", value: "k = 7 (secret random integer)" },
  { label: "Compute public key Q", value: "Q = k × G (point multiplication)" },
  { label: "Attacker knows Q and G", value: "Must find k such that Q = k × G" },
  { label: "ECDLP hardness", value: "Best known: √p steps — exponential in key size" },
  { label: "P-256 security", value: "~2¹²⁸ operations needed — infeasible classically" },
];

export default function ECCAttack({ era }: Props) {
  const comparison = eccVsRsaComparison();
  const [highlighted, setHighlighted] = useState<number | null>(null);

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase text-red-400">
          Attack Demo
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">ECDLP — the discrete logarithm problem on elliptic curves</p>
      </div>

      {/* Toy curve visualization */}
      <div className="rounded-lg border p-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
        <p className="mb-2 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">
          Toy curve: y² = x³ − x + 1 (mod {PRIME}) — {EC_POINTS.length} points
        </p>
        <div className="flex justify-center">
          <svg width={200} height={200} className="overflow-visible">
            {/* Grid */}
            {Array.from({ length: PRIME + 1 }, (_, i) => (
              <g key={i}>
                <line x1={0} y1={i * (200 / PRIME)} x2={200} y2={i * (200 / PRIME)} stroke="white" strokeOpacity={0.04} strokeWidth={0.5} />
                <line x1={i * (200 / PRIME)} y1={0} x2={i * (200 / PRIME)} y2={200} stroke="white" strokeOpacity={0.04} strokeWidth={0.5} />
              </g>
            ))}
            {/* Curve points */}
            {EC_POINTS.map(([x, y], i) => {
              const px = x * (200 / PRIME) + (200 / PRIME) / 2;
              const py = 200 - (y * (200 / PRIME) + (200 / PRIME) / 2);
              const isHighlighted = highlighted === i;
              return (
                <motion.circle
                  key={i}
                  cx={px}
                  cy={py}
                  r={isHighlighted ? 5 : 3}
                  fill={isHighlighted ? "#ef4444" : era.color}
                  opacity={isHighlighted ? 1 : 0.7}
                  className="cursor-pointer"
                  onMouseEnter={() => setHighlighted(i)}
                  onMouseLeave={() => setHighlighted(null)}
                  animate={{ r: isHighlighted ? 5 : 3 }}
                  transition={{ duration: 0.15 }}
                />
              );
            })}
            {highlighted !== null && (
              <text
                x={EC_POINTS[highlighted][0] * (200 / PRIME) + 8}
                y={200 - (EC_POINTS[highlighted][1] * (200 / PRIME)) - 2}
                fill={era.color}
                fontSize={8}
                fontFamily="monospace"
              >
                ({EC_POINTS[highlighted][0]},{EC_POINTS[highlighted][1]})
              </text>
            )}
          </svg>
        </div>
        <p className="mt-1 font-mono text-[9px] text-center text-[var(--text-muted)]">
          Each dot = a point on the curve · Hover to see coordinates
        </p>
      </div>

      {/* ECDLP steps */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">ECDLP — how it works</p>
        <div className="space-y-2">
          {DLP_STEPS.map((step, i) => (
            <motion.div
              key={i}
              className="rounded-lg border px-3 py-2.5"
              style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest mb-0.5" style={{ color: era.color }}>{step.label}</p>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">{step.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ECC vs RSA compact table */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">ECC vs RSA — equivalent security</p>
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: era.color + "25" }}>
          <table className="w-full font-mono text-[10px]">
            <thead>
              <tr style={{ backgroundColor: era.color + "12" }}>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">Curve</th>
                <th className="px-3 py-2 text-right text-[var(--text-muted)]">ECC bits</th>
                <th className="px-3 py-2 text-right text-[var(--text-muted)]">RSA equiv</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.curve} style={{ borderTop: `1px solid ${era.color}12` }}>
                  <td className="px-3 py-2" style={{ color: era.color }}>{row.curve}</td>
                  <td className="px-3 py-2 text-right text-[var(--text-primary)]">{row.eccBits}</td>
                  <td className="px-3 py-2 text-right text-[var(--text-muted)]">{row.rsaEquivalentBits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 font-mono text-[10px] text-[var(--text-muted)] leading-relaxed">
          Smaller keys = faster operations. Bitcoin uses secp256k1 (similar to P-256) for all wallet signatures.
        </p>
      </div>
    </div>
  );
}
