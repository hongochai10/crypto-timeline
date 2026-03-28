"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import {
  pqcGenerateKeyPair,
  pqcEncryptBit,
  pqcDecryptBit,
  generateLatticeVisualization,
  type LWEKeyPair,
  type LWEEncryptResult,
} from "@/lib/crypto/pqc";

interface Props {
  era: Era;
}

export default function PQCDemo({ era }: Props) {
  const [keyPair, setKeyPair] = useState<LWEKeyPair | null>(null);
  const [bit, setBit] = useState<0 | 1>(1);
  const [ciphertext, setCiphertext] = useState<LWEEncryptResult | null>(null);
  const [decrypted, setDecrypted] = useState<number | null>(null);
  const [lattice] = useState(() => generateLatticeVisualization(28));

  const generate = () => {
    const kp = pqcGenerateKeyPair();
    setKeyPair(kp);
    setCiphertext(null);
    setDecrypted(null);
  };

  const encrypt = () => {
    if (!keyPair) return;
    const ct = pqcEncryptBit(bit, keyPair.publicKey);
    setCiphertext(ct);
    setDecrypted(null);
  };

  const decrypt = () => {
    if (!keyPair || !ciphertext) return;
    const result = pqcDecryptBit(ciphertext, keyPair.privateKey);
    setDecrypted(result.bit);
  };

  const svgSize = 200;
  const cx = svgSize / 2;
  const cy = svgSize / 2;

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          Interactive Demo
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">LWE lattice-based encryption — simplified Kyber concept</p>
      </div>

      {/* Lattice visualization */}
      <div className="rounded-lg border p-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
        <p className="mb-2 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Lattice visualization — the hard problem</p>
        <div className="flex justify-center">
          <svg width={svgSize} height={svgSize} className="overflow-visible" role="img" aria-label="Lattice point visualization showing the hard problem in LWE encryption">
            {/* Lattice points */}
            {lattice.points.map(([x, y], i) => (
              <circle
                key={i}
                cx={cx + x}
                cy={cy + y}
                r={2}
                fill={era.color}
                opacity={0.4}
              />
            ))}
            {/* Origin */}
            <circle cx={cx} cy={cy} r={3} fill={era.color} opacity={0.9} />
            {/* Noisy point (the "hard" LWE problem) */}
            <motion.circle
              cx={cx + lattice.noisyPoint[0]}
              cy={cy + lattice.noisyPoint[1]}
              r={4}
              fill="#ef4444"
              opacity={0.85}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text
              x={cx + lattice.noisyPoint[0] + 6}
              y={cy + lattice.noisyPoint[1] + 4}
              fill="#ef4444"
              fontSize={8}
              fontFamily="monospace"
            >
              noisy
            </text>
            {/* Basis vectors */}
            <line
              x1={cx} y1={cy}
              x2={cx + lattice.basis[0][0]} y2={cy + lattice.basis[0][1]}
              stroke={era.color} strokeWidth={1.5} opacity={0.6}
              markerEnd="none"
            />
            <line
              x1={cx} y1={cy}
              x2={cx + lattice.basis[1][0]} y2={cy + lattice.basis[1][1]}
              stroke={era.color} strokeWidth={1.5} opacity={0.6}
            />
          </svg>
        </div>
        <p className="mt-1 font-mono text-[9px] text-center text-[var(--text-muted)]">
          Red = noisy point · Security = finding closest lattice point is hard
        </p>
      </div>

      {/* Parameters */}
      <div className="rounded-lg border px-4 py-3 font-mono text-xs" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
        <p className="text-[var(--text-muted)] mb-1 uppercase tracking-widest text-[10px]">LWE Parameters (educational)</p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-[var(--text-muted)] text-[10px]">Dimension n</p>
            <p style={{ color: era.color }}>8</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-[10px]">Modulus q</p>
            <p style={{ color: era.color }}>97</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-[10px]">Error bound</p>
            <p style={{ color: era.color }}>±3</p>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <button
        onClick={generate}
        data-testid="pqc-generate-btn"
        aria-label="Generate LWE key pair"
        className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all"
        style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
      >
        ⚙ Generate LWE Key Pair
      </button>

      {keyPair && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] rounded-lg border px-3 py-2 space-y-1" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
          <p className="text-[var(--text-muted)] uppercase tracking-widest">Secret vector s (private key)</p>
          <p style={{ color: era.color }}>[{keyPair.privateKey.s.join(", ")}]</p>
          <p className="text-[var(--text-muted)] uppercase tracking-widest mt-1">Public vector b = A·s + error (mod 97)</p>
          <p className="text-[var(--text-secondary)]">[{keyPair.publicKey.b.map(String).join(", ")}]</p>
        </motion.div>
      )}

      {/* Step 2 */}
      {keyPair && (
        <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>Encrypt a single bit</span>
          <div className="flex gap-3" role="group" aria-label="Select bit value to encrypt">
            {([0, 1] as const).map((b) => (
              <button
                key={b}
                data-testid={`pqc-bit-${b}-btn`}
                onClick={() => { setBit(b); setCiphertext(null); setDecrypted(null); }}
                aria-pressed={bit === b}
                aria-label={`Select bit ${b}`}
                className="flex-1 rounded-lg py-2 font-mono text-sm font-bold transition-all"
                style={
                  bit === b
                    ? { backgroundColor: era.color + "30", color: era.color, border: `1px solid ${era.color}` }
                    : { backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-default)" }
                }
              >
                bit = {b}
              </button>
            ))}
          </div>
          <button
            onClick={encrypt}
            data-testid="pqc-encrypt-btn"
            aria-label={`Encrypt bit ${bit} with LWE`}
            className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all"
            style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
          >
            ⚙ Encrypt bit
          </button>
          {ciphertext && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] space-y-1">
              <p className="text-[var(--text-muted)]">u (first 4 values): [{ciphertext.u.slice(0, 4).join(", ")}…]</p>
              <p className="text-[var(--text-muted)]">v: {ciphertext.v}</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Step 3 */}
      {ciphertext && (
        <div className="flex flex-col gap-3">
          <button
            onClick={decrypt}
            data-testid="pqc-decrypt-btn"
            aria-label="Decrypt LWE ciphertext"
            className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all"
            style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
          >
            ⚙ Decrypt
          </button>
          {decrypted !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              aria-live="polite"
              className={`rounded-lg border p-3 ${decrypted === bit ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
            >
              <p data-testid="pqc-decrypt-result" className={`font-mono text-xs uppercase tracking-widest mb-1 ${decrypted === bit ? "text-green-400" : "text-red-400"}`}>
                Decrypted bit = {decrypted} {decrypted === bit ? "✓ Correct" : "✗ Error"}
              </p>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">
                The LWE error (noise) is small enough that decryption recovers the original bit.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
