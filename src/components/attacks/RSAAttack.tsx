"use client";

import { type Era } from "@/lib/constants";

interface Props { era: Era; }

export default function RSAAttack({ era }: Props) {
  return (
    <div className="demo-container">
      <h3 className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: era.color }}>
        Attack Demo
      </h3>
      <p className="text-sm text-[var(--text-secondary)]">Coming in TEC-304 — Integer Factoring Visualization</p>
    </div>
  );
}
