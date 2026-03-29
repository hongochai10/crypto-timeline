"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";
import { type Era } from "@/lib/constants";
import { desEncrypt, desDecrypt, type DESRound } from "@/lib/crypto/des";
import { getCryptoErrorMessage } from "@/lib/crypto/errors";
import InteractiveInput from "@/components/ui/InteractiveInput";
import { useShareableDemoParams } from "@/lib/useShareableDemo";
import { DemoHeader, ModeToggle, DemoActionButton, ErrorAlert, OutputReveal } from "./shared";

interface Props {
  era: Era;
}

export default function DESDemo({ era }: Props) {
  const t = useTranslations("demos.des");
  const urlParams = useShareableDemoParams();
  const isTargeted = urlParams.station === "des";

  const [plaintext, setPlaintext] = useState(isTargeted && urlParams.text ? urlParams.text : t("defaultPlaintext"));
  const [key, setKey] = useState(isTargeted && urlParams.key ? urlParams.key.slice(0, 8) : t("defaultKey"));
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
      <DemoHeader era={era} subtitle={t("subtitle")} stationId="des" shareParams={{ text: plaintext, key }} />

      <ModeToggle
        era={era}
        mode={mode}
        modes={["encrypt", "decrypt"]}
        onModeChange={(m) => { setMode(m as "encrypt" | "decrypt"); setOutput(""); setRounds([]); setError(""); }}
        testIdPrefix="des"
      />

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
        placeholder={t("defaultKey")}
        accentColor={era.color}
        maxLength={8}
        helpText={t("keyLength", { length: key.length })}
        data-testid="des-key"
      />

      <DemoActionButton
        era={era}
        onClick={run}
        disabled={!plaintext.trim() || !key.trim()}
        testId="des-run-btn"
        ariaLabel={mode === "encrypt" ? "Encrypt with DES" : "Decrypt with DES"}
        label={mode === "encrypt" ? t("encryptWithDES") : t("decryptWithDES")}
      />

      {error && <ErrorAlert message={error} />}

      {output && (
        <OutputReveal className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
            {mode === "encrypt" ? t("ciphertextHex") : t("plaintext")}
          </label>
          <div className="code-display break-all text-sm tracking-wider" data-testid="des-output" style={{ color: era.color }} role="status" aria-live="polite">
            {output}
          </div>
        </OutputReveal>
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
              <OutputReveal className="mt-3 overflow-hidden">
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
              </OutputReveal>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
