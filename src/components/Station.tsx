"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { type Era, ERA_STATUS_LABELS, ERA_STATUS_COLORS } from "@/lib/constants";

interface StationProps {
  era: Era;
  index: number;
  children: React.ReactNode;
}

export default function Station({ era, index, children }: StationProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });

  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      id={era.id}
      className="station-section"
      style={{ "--era-color": era.color } as React.CSSProperties}
    >
      {/* Background glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0"
        animate={{ opacity: isInView ? 0.04 : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{ background: `radial-gradient(ellipse at ${isEven ? "20%" : "80%"} 50%, ${era.color}, transparent 70%)` }}
      />

      {/* Timeline connector line */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--border-subtle)]" />

      {/* Timeline dot */}
      <motion.div
        className="absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: isInView ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "backOut" }}
      >
        <div
          className="h-4 w-4 rounded-full border-2"
          style={{ borderColor: era.color, backgroundColor: era.color + "33" }}
        />
        <div
          className="absolute h-8 w-8 rounded-full opacity-30 animate-ping"
          style={{ backgroundColor: era.color }}
        />
      </motion.div>

      {/* Station card */}
      <motion.div
        className="station-card w-full max-w-5xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
      >
        {/* Card header */}
        <div
          className="border-b border-[var(--border-subtle)] p-6 md:p-8"
          style={{ borderLeftColor: era.color, borderLeftWidth: 4 }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="era-badge" style={{ color: era.color }}>
                  {era.year}
                </span>
                <span
                  className={`era-badge ${ERA_STATUS_COLORS[era.status]}`}
                >
                  {ERA_STATUS_LABELS[era.status]}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
                {era.name}
              </h2>
              <p className="mt-1 font-mono text-sm text-[var(--text-muted)]">{era.subtitle}</p>
            </div>
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-bold"
              style={{ backgroundColor: era.color + "20", color: era.color }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
            {era.description}
          </p>
          <div
            className="mt-4 rounded-lg border px-4 py-3 font-mono text-xs"
            style={{ borderColor: era.color + "40", color: era.color, backgroundColor: era.color + "10" }}
          >
            ⚡ {era.keyFact}
          </div>
        </div>

        {/* Station content (demo + attack) */}
        <div className="p-6 md:p-8">{children}</div>
      </motion.div>
    </section>
  );
}
