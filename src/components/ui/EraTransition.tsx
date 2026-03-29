"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { type Era } from "@/lib/constants";

interface EraTransitionProps {
  fromEra: Era;
  toEra: Era;
}

export default function EraTransition({ fromEra, toEra }: EraTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-30% 0px -30% 0px" });
  const te = useTranslations("eras");

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center py-20 overflow-hidden"
      aria-hidden="true"
    >
      {/* Background gradient blend between eras */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `linear-gradient(180deg, ${fromEra.bgColor} 0%, #050505 40%, #050505 60%, ${toEra.bgColor} 100%)`,
        }}
      />

      {/* Central divider line */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4 px-6">
        {/* From era label */}
        <motion.span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: fromEra.color }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isInView ? 0.7 : 0, x: isInView ? 0 : -20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {te(`${fromEra.id}.name`)} · {te(`${fromEra.id}.year`)}
        </motion.span>

        {/* Divider with era colors */}
        <div className="flex w-full items-center gap-3">
          <motion.div
            className="h-px flex-1"
            style={{ backgroundColor: fromEra.color }}
            initial={{ scaleX: 0, originX: 1 }}
            animate={{ scaleX: isInView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Center node */}
          <motion.div
            className="relative flex h-8 w-8 items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: isInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${fromEra.color} 0%, ${toEra.color} 100%)`,
                padding: 1,
              }}
            >
              <div className="h-full w-full rounded-full" style={{ backgroundColor: "#050505" }} />
            </div>
            {/* Inner dot */}
            <div
              className="relative z-10 h-2 w-2 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${fromEra.color}, ${toEra.color})`,
              }}
            />
            {/* Pulse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: `linear-gradient(135deg, ${fromEra.color}44, ${toEra.color}44)` }}
              animate={{ scale: [1, 2], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.div>

          <motion.div
            className="h-px flex-1"
            style={{ backgroundColor: toEra.color }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: isInView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* To era label */}
        <motion.span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: toEra.color }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isInView ? 0.7 : 0, x: isInView ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {te(`${toEra.id}.name`)} · {te(`${toEra.id}.year`)}
        </motion.span>

        {/* Year gap label */}
        <motion.p
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.5 : 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {te(`${fromEra.id}.year`)} → {te(`${toEra.id}.year`)}
        </motion.p>
      </div>
    </div>
  );
}
