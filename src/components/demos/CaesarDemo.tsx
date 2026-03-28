"use client";

import { useState } from "react";
import { type Era } from "@/lib/constants";
import { caesarEncrypt, caesarDecrypt } from "@/lib/crypto/caesar";
// caesarEncrypt/caesarDecrypt return { output, shift }
import InteractiveInput from "@/components/ui/InteractiveInput";

interface Props {
  era: Era;
}

export default function CaesarDemo({ era }: Props) {
  const [plaintext, setPlaintext] = useState("HELLO WORLD");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const result =
    mode === "encrypt"
      ? caesarEncrypt(plaintext, shift)
      : caesarDecrypt(plaintext, shift);
  const output = result.output;

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          Interactive Demo
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">Caesar shift cipher — adjust key and text</p>
      </div>

      <div className="flex gap-2" role="group" aria-label="Encryption mode">
        {(["encrypt", "decrypt"] as const).map((m) => (
          <button
            key={m}
            data-testid={`caesar-${m}-btn`}
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            aria-label={`${m === "encrypt" ? "Encrypt" : "Decrypt"} mode`}
            className="rounded-lg px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all"
            style={
              mode === m
                ? { backgroundColor: era.color + "30", color: era.color, border: `1px solid ${era.color}` }
                : { backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-default)" }
            }
          >
            {m}
          </button>
        ))}
      </div>

      <InteractiveInput
        label={mode === "encrypt" ? "Plaintext" : "Ciphertext"}
        value={plaintext}
        onChange={(e) => setPlaintext(e.target.value.toUpperCase())}
        placeholder="Enter text..."
        accentColor={era.color}
        data-testid="caesar-input"
      />

      <div>
        <label htmlFor="caesar-shift-slider" className="mb-2 block font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
          Shift Key: {shift}
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
          aria-label={`Caesar shift key: ${shift}`}
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
          {mode === "encrypt" ? "Ciphertext" : "Plaintext"}
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
