"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { useShareableDemoParams } from "@/lib/useShareableDemo";
import { DemoHeader, DemoActionButton, StepCard, OutputReveal } from "./shared";

interface Props {
  era: Era;
}

export default function PQCDemo({ era }: Props) {
  const t = useTranslations("demos.pqc");
  const urlParams = useShareableDemoParams();
  const isTargeted = urlParams.station === "pqc";

  const [keyPair, setKeyPair] = useState<LWEKeyPair | null>(null);
  const [bit, setBit] = useState<0 | 1>(isTargeted && urlParams.bit !== undefined ? urlParams.bit : 1);
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
      <DemoHeader era={era} subtitle={t("subtitle")} stationId="pqc" shareParams={{ bit }} />

      {/* Lattice visualization */}
      <StepCard era={era}>
        <p className="font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">{t("latticeVisualization")}</p>
        <div className="flex justify-center">
          <svg width={svgSize} height={svgSize} className="overflow-visible" role="img" aria-label={t("latticeAriaLabel")}>
            {lattice.points.map(([x, y], i) => (
              <circle key={i} cx={cx + x} cy={cy + y} r={2} fill={era.color} opacity={0.4} />
            ))}
            <circle cx={cx} cy={cy} r={3} fill={era.color} opacity={0.9} />
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
              {t("noisy")}
            </text>
            <line
              x1={cx} y1={cy}
              x2={cx + lattice.basis[0][0]} y2={cy + lattice.basis[0][1]}
              stroke={era.color} strokeWidth={1.5} opacity={0.6}
            />
            <line
              x1={cx} y1={cy}
              x2={cx + lattice.basis[1][0]} y2={cy + lattice.basis[1][1]}
              stroke={era.color} strokeWidth={1.5} opacity={0.6}
            />
          </svg>
        </div>
        <p className="mt-1 font-mono text-[9px] text-center text-[var(--text-muted)]">
          {t("latticeCaption")}
        </p>
      </StepCard>

      {/* Parameters */}
      <StepCard era={era}>
        <p className="text-[var(--text-muted)] mb-1 uppercase tracking-widest text-[10px]">{t("lweParams")}</p>
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div>
            <p className="text-[var(--text-muted)] text-[10px]">{t("dimensionN")}</p>
            <p style={{ color: era.color }}>8</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-[10px]">{t("modulusQ")}</p>
            <p style={{ color: era.color }}>97</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-[10px]">{t("errorBound")}</p>
            <p style={{ color: era.color }}>±3</p>
          </div>
        </div>
      </StepCard>

      {/* Step 1 */}
      <DemoActionButton
        era={era}
        onClick={generate}
        testId="pqc-generate-btn"
        ariaLabel="Generate LWE key pair"
        label={t("generateLWE")}
      />

      {keyPair && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] rounded-lg border px-3 py-2 space-y-1" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
          <p className="text-[var(--text-muted)] uppercase tracking-widest">{t("secretVector")}</p>
          <p style={{ color: era.color }}>[{keyPair.privateKey.s.join(", ")}]</p>
          <p className="text-[var(--text-muted)] uppercase tracking-widest mt-1">{t("publicVector")}</p>
          <p className="text-[var(--text-secondary)]">[{keyPair.publicKey.b.map(String).join(", ")}]</p>
        </motion.div>
      )}

      {/* Step 2 */}
      {keyPair && (
        <StepCard era={era}>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>{t("encryptBit")}</span>
          <div className="flex gap-3" role="group" aria-label={t("selectBit")}>
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
          <DemoActionButton
            era={era}
            onClick={encrypt}
            testId="pqc-encrypt-btn"
            ariaLabel={`Encrypt bit ${bit} with LWE`}
            label={t("encryptBitBtn")}
          />
          {ciphertext && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] space-y-1">
              <p className="text-[var(--text-muted)]">u (first 4 values): [{ciphertext.u.slice(0, 4).join(", ")}…]</p>
              <p className="text-[var(--text-muted)]">v: {ciphertext.v}</p>
            </motion.div>
          )}
        </StepCard>
      )}

      {/* Step 3 */}
      {ciphertext && (
        <div className="flex flex-col gap-3">
          <DemoActionButton
            era={era}
            onClick={decrypt}
            testId="pqc-decrypt-btn"
            ariaLabel="Decrypt LWE ciphertext"
            label={t("decryptBtn")}
          />
          {decrypted !== null && (
            <OutputReveal
              className={`rounded-lg border p-3 ${decrypted === bit ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
            >
              <div role="status" aria-live="polite">
                <p data-testid="pqc-decrypt-result" className={`font-mono text-xs uppercase tracking-widest mb-1 ${decrypted === bit ? "text-green-400" : "text-red-400"}`}>
                  {t("decryptedBit", { bit: decrypted })} {decrypted === bit ? t("correct") : t("error")}
                </p>
                <p className="font-mono text-[10px] text-[var(--text-muted)]">
                  {t("lweExplanation")}
                </p>
              </div>
            </OutputReveal>
          )}
        </div>
      )}
    </div>
  );
}
