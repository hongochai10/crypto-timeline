"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { type Era } from "@/lib/constants";
import { letterFrequency, caesarDecrypt } from "@/lib/crypto/caesar";

interface Props {
  era: Era;
}

const ENGLISH_FREQ: Record<string, number> = {
  E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1,
  R: 6.0, D: 4.3, L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4, F: 2.2,
  G: 2.0, Y: 2.0, P: 1.9, B: 1.5, V: 1.0, K: 0.8, J: 0.2, X: 0.2,
  Q: 0.1, Z: 0.1,
};

const COMMON_WORDS = new Set([
  "THE", "AND", "FOR", "ARE", "BUT", "NOT", "YOU", "ALL", "CAN", "HER",
  "WAS", "ONE", "OUR", "OUT", "HIS", "HAS", "HIM", "HOW", "ITS", "MAY",
  "NEW", "NOW", "OLD", "SEE", "WAY", "WHO", "DID", "GET", "LET", "SAY",
  "SHE", "TOO", "USE", "MAN", "DAY", "HAD", "OWN", "PUT", "BIG", "END",
  "WHY", "TRY", "ASK", "MEN", "RUN", "TOP", "SET", "RED", "WAR", "KEY",
  "THAT", "WITH", "HAVE", "THIS", "WILL", "YOUR", "FROM", "THEY", "BEEN",
  "MANY", "SOME", "THEM", "THAN", "EACH", "MAKE", "LIKE", "LONG", "LOOK",
  "COME", "MADE", "FIND", "HERE", "KNOW", "TAKE", "WANT", "DOES", "ALSO",
  "BACK", "JUST", "ONLY", "VERY", "WHEN", "WHAT", "MUCH", "TIME", "OVER",
  "SUCH", "GOOD", "YEAR", "MOST", "WORK", "NEED", "KEEP", "GIVE", "HELP",
  "HELLO", "WORLD", "ATTACK", "SECRET", "MESSAGE", "CIPHER", "ENCRYPTED",
  "IS", "IT", "IN", "AT", "TO", "OF", "ON", "AN", "AS", "OR", "IF", "NO",
  "SO", "BY", "DO", "GO", "HE", "ME", "MY", "UP", "WE", "BE", "AM",
]);

export default function CaesarAttack({ era }: Props) {
  const t = useTranslations("attacks.caesar");
  const tc = useTranslations("common");
  // "HELLO WORLD THIS IS A SECRET MESSAGE ENCRYPTED WITH THE CAESAR CIPHER" shift=3
  const [ciphertext, setCiphertext] = useState(
    "KHOOR ZRUOG WKLV LV D VHFUHW PHVVDJH HQFUBSWHG ZLWK WKH FDHVDU FLSKHU"
  );
  const [cracked, setCracked] = useState<string | null>(null);
  const [detectedShift, setDetectedShift] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const rawFreq = letterFrequency(ciphertext);
  // Convert to uppercase keys and percentage values
  const totalChars = Object.values(rawFreq).reduce((a, b) => a + b, 0) || 1;
  const freq: Record<string, number> = {};
  for (const [k, v] of Object.entries(rawFreq)) {
    freq[k.toUpperCase()] = (v / totalChars) * 100;
  }
  const maxFreq = Math.max(...Object.values(freq), 1);

  const handleCrack = async () => {
    setIsRunning(true);
    setCracked(null);
    await new Promise((r) => setTimeout(r, 800));

    // Try all 26 shifts, score each by correlation + common word detection
    let bestShift = 0;
    let bestScore = -Infinity;

    for (let shift = 0; shift < 26; shift++) {
      const decrypted = caesarDecrypt(ciphertext, shift).output;
      const decFreq = letterFrequency(decrypted);
      const total = Object.values(decFreq).reduce((a, b) => a + b, 0) || 1;

      // Correlation with English letter frequencies
      let score = 0;
      for (const [letter, expectedPct] of Object.entries(ENGLISH_FREQ)) {
        const observedPct = ((decFreq[letter.toLowerCase()] || 0) / total) * 100;
        score += observedPct * expectedPct;
      }

      // Bonus for common English words (helps with short texts)
      const words = decrypted.split(/\s+/).filter((w) => w.length > 0);
      const commonCount = words.filter((w) => COMMON_WORDS.has(w.toUpperCase())).length;
      if (words.length > 0) {
        score += (commonCount / words.length) * 200;
      }

      if (score > bestScore) {
        bestScore = score;
        bestShift = shift;
      }
    }

    setDetectedShift(bestShift);
    setCracked(caesarDecrypt(ciphertext, bestShift).output);
    setIsRunning(false);
  };

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase text-red-400">
          {tc("attackDemo")}
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">{t("subtitle")}</p>
      </div>

      <InteractiveTextarea
        label={t("ciphertextToCrack")}
        value={ciphertext}
        onChange={(v) => { setCiphertext(v.toUpperCase()); setCracked(null); setDetectedShift(null); }}
        color={era.color}
      />

      {/* Frequency chart */}
      <div>
        <label className="mb-2 block font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
          {t("letterFrequency")}
        </label>
        <div className="flex h-20 items-end gap-[2px]">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
            const height = freq[letter] ? (freq[letter] / maxFreq) * 100 : 0;
            const engHeight = (ENGLISH_FREQ[letter] || 0) / 12.7 * 100;
            return (
              <div key={letter} className="flex flex-1 flex-col items-center gap-[1px]">
                <div className="relative flex w-full flex-col justify-end" style={{ height: "70px" }}>
                  {/* English baseline */}
                  <div
                    className="absolute bottom-0 w-full opacity-20 rounded-sm"
                    style={{ height: `${engHeight}%`, backgroundColor: era.color }}
                  />
                  {/* Cipher frequency */}
                  <motion.div
                    className="w-full rounded-sm"
                    style={{ backgroundColor: era.color }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="font-mono text-[7px] text-[var(--text-muted)]">{letter}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleCrack}
        disabled={isRunning || !ciphertext.trim()}
        className="rounded-lg px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
        style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.5)" }}
      >
        {isRunning ? t("cracking") : t("runFrequencyAttack")}
      </button>

      {cracked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-3"
        >
          <div className="mb-1 flex items-center justify-between">
            <p className="font-mono text-xs text-red-400 uppercase tracking-widest">{t("cracked")}</p>
            {detectedShift !== null && (
              <p className="font-mono text-xs text-[var(--text-muted)]">shift = {detectedShift}</p>
            )}
          </div>
          <p className="font-mono text-sm text-[var(--text-primary)] tracking-wider">{cracked}</p>
        </motion.div>
      )}
    </div>
  );
}

function InteractiveTextarea({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  color: string;
}) {
  const id = `caesar-textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-lg px-4 py-3 font-mono text-sm outline-none transition-all"
        style={{
          backgroundColor: "var(--bg-base)",
          border: `1px solid var(--border-default)`,
          color: "var(--text-primary)",
        }}
        onFocus={(e) => (e.target.style.borderColor = color)}
        onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
      />
    </div>
  );
}
