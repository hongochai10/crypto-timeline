"use client";

import { type InputHTMLAttributes } from "react";

interface InteractiveInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  accentColor?: string;
}

export default function InteractiveInput({
  label,
  accentColor,
  className = "",
  style,
  ...props
}: InteractiveInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
          {label}
        </label>
      )}
      <input
        className={`interactive-input ${className}`}
        style={{ "--accent": accentColor, ...style } as React.CSSProperties}
        {...props}
      />
    </div>
  );
}
