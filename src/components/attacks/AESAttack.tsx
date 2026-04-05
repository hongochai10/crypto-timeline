"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { type Era } from "@/lib/constants";
import { aesKeyspaceInfo } from "@/lib/crypto/aes";

interface Props {
  era: Era;
}

const COMPARISON_VALUES = ["2²⁵⁶ ≈ 1.16 × 10⁷⁷", "≈ 10⁸⁰", "≈ 10²⁴", "≈ 4.3 × 10¹⁷"];

const KNOWN_ATTACKS_META = [
  { broken: false },
  { broken: false },
  { broken: false },
  { broken: true },
  { broken: false },
];

export default function AESAttack({ era }: Props) {
  const t = useTranslations("attacks.aes");
  const tc = useTranslations("common");
  const info = aesKeyspaceInfo();

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          {tc("attackDemo")}
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">{t("subtitle")}</p>
      </div>

      {/* Shield visual */}
      <motion.div
        className="flex flex-col items-center justify-center rounded-xl border py-8"
        style={{ borderColor: era.color + "30", backgroundColor: era.color + "08" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-5xl mb-3"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🛡
        </motion.div>
        <p className="font-mono text-lg font-bold" style={{ color: era.color }}>{t("unbroken")}</p>
        <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{t("sincestandardization")}</p>
      </motion.div>

      {/* Scale comparison */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">{t("scaleComparison")}</p>
        <div className="space-y-2">
          {COMPARISON_VALUES.map((value, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ backgroundColor: era.color + "08", border: `1px solid ${era.color}18` }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{t(`comparisons.${i}.label`)}</span>
              <span className="font-mono text-[10px] font-bold" style={{ color: era.color }}>{value}</span>
            </motion.div>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-[var(--text-muted)] leading-relaxed">{t("ratio")}</p>
      </div>

      {/* Known attack attempts */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">{t("knownAttacks")}</p>
        <div className="space-y-2">
          {KNOWN_ATTACKS_META.map((attack, i) => (
            <div
              key={i}
              className="rounded-lg border px-3 py-2.5"
              style={{
                borderColor: attack.broken ? "#f97316" + "40" : era.color + "20",
                backgroundColor: attack.broken ? "#f97316" + "08" : "transparent",
              }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-mono text-xs font-bold" style={{ color: attack.broken ? "#f97316" : era.color }}>
                  {t(`knownAttackItems.${i}.name`)}
                </span>
                <span
                  className="font-mono text-[9px] rounded-full px-2 py-0.5 uppercase tracking-widest"
                  style={{
                    backgroundColor: attack.broken ? "#f9741620" : era.color + "18",
                    color: attack.broken ? "#f97316" : era.color,
                  }}
                >
                  {t(`knownAttackItems.${i}.status`)}
                </span>
              </div>
              <p className="font-mono text-[10px] text-[var(--text-muted)]">{t(`knownAttackItems.${i}.detail`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
