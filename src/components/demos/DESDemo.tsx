"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { type Era } from "@/lib/constants";
import { desEncrypt, desDecrypt, type DESRound } from "@/lib/crypto/des";
import { getCryptoErrorMessage } from "@/lib/crypto/errors";
import InteractiveInput from "@/components/ui/InteractiveInput";
import ShareDemoButton from "@/components/ui/ShareDemoButton";
import { useShareableDemoParams } from "@/lib/useShareableDemo";

interface Props {
  era: Era;
}

export default function DESDemo({ era }: Props) {
  const t = useTranslations("demos.des");
  const tc = useTranslations("common");
  const urlParams = useShareableDemoParams();
  const isTargeted = urlParams.station === "des";

  const [plaintext, setPlaintext] = useState(isTargeted && urlParams.text ? urlParams.text : "HELLO DES");
  const [key, setKey] = useState(isTargeted && urlParams.key ? urlParams.key.slice(0, 8) : "SECRET01");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [rounds, setRounds] = useState<DESRound[]>([]);
  const [output, setOutput] = useState("");
  const [showRounds, setShowRounds] = useState(false);
  const [error, setError] = useState("");

  const run = () => {
    setError("");
    try {
      if (mode === "encrypt") {
        const result = desEncrypt(plaintext, key);
        setOutput(result.hex);
        setRounds(result.rounds);
      } else {
        const result = desDecrypt(plaintext.trim(), key);
        setOutput(result.output);
        setRounds([]);
      }
    } catch (err) {
      console.error("[DESDemo]", mode, err);
      setError(getCryptoErrorMessage(err, mode === "encrypt" ? "des-encrypt" : "des-decrypt"));
    }
  };

  return (
    <div className="demo-container flex flex-col gap-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
            {tc("interactiveDemo")}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">{t("subtitle")}</p>
        </div>
        <ShareDemoButton stationId="des" params={{ text: plaintext, key }} accentColor={era.color} />
      </div>

      <div className="flex gap-2" role="group" aria-label="Encryption mode">
        {(["encrypt", "decrypt"] as const).map((m) => (
          <button
            key={m}
            data-testid={`des-${m}-btn`}
            onClick={() => { setMode(m); setOutput(""); setRounds([]); setError(""); }}
            aria-pressed={mode === m}
            aria-label={m === "encrypt" ? tc("encryptMode") : tc("decryptMode")}
            className="rounded-lg px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all"
            style={
              mode === m
                ? { backgroundColor: era.color + "30", color: era.color, border: `1px solid ${era.color}` }
                : { backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-default)" }
            }
          >
            {m === "encrypt" ? tc("encrypt") : tc("decrypt")}
          </button>
        ))}
      </div>

      <InteractiveInput
        label={mode === "encrypt" ? t("plaintext") : t("hexCiphertext")}
        value={plaintext}
        onChange={(e) => { setPlaintext(e.target.value); setOutput(""); }}
        placeholder={mode === "encrypt" ? t("enterText") : t("pasteHex")}
        accentColor={era.color}
        data-testid="des-input"
      />

      <InteractiveInput
        label={t("key8chars")}
        value={key}
        onChange={(e) => { setKey(e.target.value.slice(0, 8)); setOutput(""); }}
        placeholder="SECRET01"
        accentColor={era.color}
        maxLength={8}
        helpText={t("keyLength", { length: key.length })}
        data-testid="des-key"
      />

      <button
        onClick={run}
        disabled={!plaintext.trim() || !key.trim()}
        data-testid="des-run-btn"
        aria-label={mode === "encrypt" ? "Encrypt with DES" : "Decrypt with DES"}
        className="rounded-lg px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
        style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
      >
        {mode === "encrypt" ? t("encryptWithDES") : t("decryptWithDES")}
      </button>

      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">{error}</p>
      )}

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <label className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
            {mode === "encrypt" ? t("ciphertextHex") : t("plaintext")}
          </label>
          <div className="code-display break-all text-sm tracking-wider" data-testid="des-output" style={{ color: era.color }} role="status" aria-live="polite">
            {output}
          </div>
        </motion.div>
      )}

      {rounds.length > 0 && (
        <div>
          <button
            onClick={() => setShowRounds((s) => !s)}
            aria-expanded={showRounds}
            aria-label={`${showRounds ? "Hide" : "Show"} 16 Feistel rounds`}
            className="font-mono text-xs tracking-widest uppercase transition-colors"
            style={{ color: era.color + "80" }}
          >
            {showRounds ? t("hide") : t("show")} {t("feistelRounds")}
          </button>
          <AnimatePresence>
            {showRounds && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="space-y-1">
                  {rounds.map((r) => (
                    <div
                      key={r.round}
                      className="flex items-center gap-3 rounded px-3 py-1.5 font-mono text-[10px]"
                      style={{ backgroundColor: era.color + "08", borderLeft: `2px solid ${era.color}${r.round === 16 ? "ff" : "30"}` }}
                    >
                      <span className="w-8 shrink-0 text-[var(--text-muted)]">R{r.round.toString().padStart(2, "0")}</span>
                      <span className="truncate text-[var(--text-secondary)]">L: {r.left.slice(0, 8)}…</span>
                      <span className="truncate text-[var(--text-secondary)]">R: {r.right.slice(0, 8)}…</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
