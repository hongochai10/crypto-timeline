"use client";

import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";

interface EraTransitionProps {
  fromEra: Era;
  toEra: Era;
}

export default function EraTransition({ fromEra, toEra }: EraTransitionProps) {
  return (
    <div className="relative flex items-center justify-center py-16">
      <div className="flex items-center gap-6">
        <span className="font-mono text-xs tracking-widest" style={{ color: fromEra.color }}>
          {fromEra.name}
        </span>
        <div
          className="h-px w-24 opacity-50"
          style={{
            background: `linear-gradient(90deg, ${fromEra.color}, ${toEra.color})`,
          }}
        />
        <motion.div
          className="text-[var(--text-muted)] text-xs font-mono"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          →
        </motion.div>
        <div
          className="h-px w-24 opacity-50"
          style={{
            background: `linear-gradient(90deg, ${fromEra.color}, ${toEra.color})`,
          }}
        />
        <span className="font-mono text-xs tracking-widest" style={{ color: toEra.color }}>
          {toEra.name}
        </span>
      </div>
    </div>
  );
}
