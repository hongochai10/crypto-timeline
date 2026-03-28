"use client";

import { useId, type InputHTMLAttributes } from "react";

interface InteractiveInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  accentColor?: string;
  helpText?: string;
}

export default function InteractiveInput({
  label,
  accentColor,
  helpText,
  className = "",
  style,
  id: externalId,
  ...props
}: InteractiveInputProps) {
  const generatedId = useId();
  const inputId = externalId || generatedId;
  const helpId = helpText ? `${inputId}-help` : undefined;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`interactive-input ${className}`}
        style={{ "--accent": accentColor, ...style } as React.CSSProperties}
        aria-describedby={helpId}
        {...props}
      />
      {helpText && (
        <p id={helpId} className="font-mono text-xs text-[var(--text-muted)]">
          {helpText}
        </p>
      )}
    </div>
  );
}
