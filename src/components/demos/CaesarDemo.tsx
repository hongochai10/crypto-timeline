"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { type Era } from "@/lib/constants";
import { caesarEncrypt, caesarDecrypt } from "@/lib/crypto/caesar";
// caesarEncrypt/caesarDecrypt return { output, shift }
import InteractiveInput from "@/components/ui/InteractiveInput";
import ShareDemoButton from "@/components/ui/ShareDemoButton";
import { useShareableDemoParams } from "@/lib/useShareableDemo";

interface Props {
  era: Era;
}

export default function CaesarDemo({ era }: Props) {
  const t = useTranslations("demos.caesar");
  const tc = useTranslations("common");
  const urlParams = useShareableDemoParams();
  const isTargeted = urlParams.station === "caesar";

  const [plaintext, setPlaintext] = useState(isTargeted && urlParams.text ? urlParams.text : "HELLO WORLD");
  const [shift, setShift] = useState(isTargeted && urlParams.shift ? urlParams.shift : 3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const result =
    mode === "encrypt"
      ? caesarEncrypt(plaintext, shift)
      : caesarDecrypt(plaintext, shift);
  const output = result.output;

  return (
    <div className="demo-container flex flex-col gap-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
            {tc("interactiveDemo")}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">{t("subtitle")}</p>
        </div>
        <ShareDemoButton stationId="caesar" params={{ text: plaintext, shift }} accentColor={era.color} />
      </div>

      <div className="flex gap-2" role="group" aria-label="Encryption mode">
        {(["encrypt", "decrypt"] as const).map((m) => (
          <button
            key={m}
            data-testid={`caesar-${m}-btn`}
            onClick={() => setMode(m)}
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
        label={mode === "encrypt" ? t("plaintext") : t("ciphertext")}
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value.toUpperCase())}
        placeholder={t("enterText")}
        accentColor={era.color}
        data-testid="caesar-input"
      />

      <div>
        <label htmlFor="caesar-shift-slider" className="mb-2 block font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
          {t("shiftKey", { shift })}
        </label>
        <input
          id="caesar-shift-slider"
          type="range"
          min={1}
          max={25}
          value={shift}
          aria-valuemin={1}
          aria-valuemax={25}
          aria-valuenow={shift}
          aria-label={t("shiftKeyAriaLabel", { shift })}
          onChange={(e) => setShift(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: era.color }}
          data-testid="caesar-shift"
        />
        <div className="mt-1 flex justify-between font-mono text-xs text-[var(--text-muted)]">
          <span>1</span>
          <span>25</span>
        </div>
      </div>

      <div>
        <label id="caesar-output-label" className="mb-2 block font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
          {mode === "encrypt" ? t("ciphertext") : t("plaintext")}
        </label>
        <div
          className="code-display tracking-widest"
          style={{ color: era.color }}
          data-testid="caesar-output"
          role="status"
          aria-live="polite"
          aria-labelledby="caesar-output-label"
        >
          {output || "—"}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] p-3 font-mono text-xs text-[var(--text-muted)]">
        A → {String.fromCharCode(((0 + shift) % 26) + 65)} · B → {String.fromCharCode(((1 + shift) % 26) + 65)} · Z → {String.fromCharCode(((25 + shift) % 26) + 65)}
      </div>
    </div>
  );
}
