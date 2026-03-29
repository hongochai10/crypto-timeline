"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { type Era } from "@/lib/constants";
import { caesarEncrypt, caesarDecrypt } from "@/lib/crypto/caesar";
import InteractiveInput from "@/components/ui/InteractiveInput";
import { useShareableDemoParams } from "@/lib/useShareableDemo";
import { DemoHeader, ModeToggle } from "./shared";

interface Props {
  era: Era;
}

export default function CaesarDemo({ era }: Props) {
  const t = useTranslations("demos.caesar");
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
      <DemoHeader era={era} subtitle={t("subtitle")} stationId="caesar" shareParams={{ text: plaintext, shift }} />

      <ModeToggle era={era} mode={mode} modes={["encrypt", "decrypt"]} onModeChange={(m) => setMode(m as "encrypt" | "decrypt")} testIdPrefix="caesar" />

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
