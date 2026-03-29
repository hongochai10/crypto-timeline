"use client";

import { useTranslations } from "next-intl";
import { type Era } from "@/lib/constants";

interface ModeToggleProps {
  era: Era;
  mode: string;
  modes: readonly string[];
  onModeChange: (mode: string) => void;
  testIdPrefix: string;
  labels?: Record<string, string>;
  ariaGroupLabel?: string;
}

export default function ModeToggle({ era, mode, modes, onModeChange, testIdPrefix, labels, ariaGroupLabel = "Encryption mode" }: ModeToggleProps) {
  const tc = useTranslations("common");

  const getLabel = (m: string) => {
    if (labels?.[m]) return labels[m];
    if (m === "encrypt") return tc("encrypt");
    if (m === "decrypt") return tc("decrypt");
    return m;
  };

  const getAriaLabel = (m: string) => {
    if (m === "encrypt") return tc("encryptMode");
    if (m === "decrypt") return tc("decryptMode");
    return m;
  };

  return (
    <div className="flex gap-2" role="group" aria-label={ariaGroupLabel}>
      {modes.map((m) => (
        <button
          key={m}
          data-testid={`${testIdPrefix}-${m}-btn`}
          onClick={() => onModeChange(m)}
          aria-pressed={mode === m}
          aria-label={getAriaLabel(m)}
          className="rounded-lg px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all"
          style={
            mode === m
              ? { backgroundColor: era.color + "30", color: era.color, border: `1px solid ${era.color}` }
              : { backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-default)" }
          }
        >
          {getLabel(m)}
        </button>
      ))}
    </div>
  );
}
