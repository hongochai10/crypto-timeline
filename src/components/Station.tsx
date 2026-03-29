"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { type Era, ERAS } from "@/lib/constants";

interface StationProps {
  era: Era;
  index: number;
  children: React.ReactNode;
}

export default function Station({ era, index, children }: StationProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-25% 0px -25% 0px" });
  const te = useTranslations("eras");
  const tc = useTranslations("common");

  // Dynamically update CSS custom properties on <html> when this era is centered
  useEffect(() => {
    if (!isInView) return;
    const root = document.documentElement;
    root.style.setProperty("--era-active-color",   era.color);
    root.style.setProperty("--era-active-bg",      era.bgColor);
    root.style.setProperty("--era-active-surface", era.surfaceColor);
    root.style.setProperty("--era-active-text",    era.textColor);
    root.style.setProperty("--era-active-glow",    era.glowColor);
    // Also update the legacy vars used by ScrollProgress + globals
    root.style.setProperty("--bg-base",            era.bgColor);
  }, [isInView, era]);

  const eraName = te(`${era.id}.name`);
  const eraYear = te(`${era.id}.year`);
  const eraSubtitle = te(`${era.id}.subtitle`);
  const eraDescription = te(`${era.id}.description`);
  const eraKeyFact = te(`${era.id}.keyFact`);
  const statusLabel = te(`statusLabels.${era.status}`);

  return (
    <section
      ref={ref}
      id={era.id}
      className="station-section"
      aria-label={`${eraName} — ${eraYear}`}
      style={{ "--era-color": era.color } as React.CSSProperties}
    >
      {/* Full-bleed era background transition */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{ backgroundColor: isInView ? era.bgColor : "transparent" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Atmospheric radial glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${era.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Subtle corner accent glow */}
      <motion.div
        className="pointer-events-none absolute -z-10"
        animate={{ opacity: isInView ? 0.6 : 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
        style={{
          inset: 0,
          background: `radial-gradient(circle at ${index % 2 === 0 ? "10% 90%" : "90% 10%"}, ${era.glowColor} 0%, transparent 45%)`,
        }}
      />

      {/* Vertical timeline connector */}
      <div
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
        style={{ background: `linear-gradient(to bottom, ${era.color}00, ${era.color}30 20%, ${era.color}30 80%, ${era.color}00)` }}
      />

      {/* Timeline node dot */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
      >
        {/* Outer ring ping */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 32, height: 32, backgroundColor: era.color }}
          animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        {/* Inner dot */}
        <div
          className="relative z-10 h-4 w-4 rounded-full border-2"
          style={{ borderColor: era.color, backgroundColor: era.color + "44" }}
        />
      </motion.div>

      {/* Station card */}
      <motion.div
        className="relative z-10 w-full max-w-5xl"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 48 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        {/* Card shell */}
        <div
          className="overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: era.surfaceColor,
            borderColor: era.color + "28",
            boxShadow: `0 0 0 1px ${era.color}12, 0 8px 40px rgba(0,0,0,0.6), 0 0 80px -20px ${era.glowColor}`,
          }}
        >
          {/* Top accent line */}
          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${era.color}, transparent)` }} />

          {/* Card header */}
          <div className="border-b p-6 md:p-8" style={{ borderColor: era.color + "18", borderLeftColor: era.color, borderLeftWidth: 4 }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Era year + status badges */}
                <div className="mb-3 flex flex-wrap items-center gap-2.5">
                  <span
                    className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest"
                    style={{ color: era.color, borderColor: era.color + "50", backgroundColor: era.color + "14" }}
                  >
                    {eraYear}
                  </span>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest ${era.status === "broken" ? "text-red-400 bg-red-400/10 border-red-400/30" : era.status === "weakened" ? "text-orange-400 bg-orange-400/10 border-orange-400/30" : era.status === "secure" ? "text-green-400 bg-green-400/10 border-green-400/30" : era.status === "quantum-threatened" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" : "text-teal-400 bg-teal-400/10 border-teal-400/30"}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Station title */}
                <h2
                  id={`station-title-${era.id}`}
                  className="text-3xl font-bold tracking-tight md:text-4xl"
                  style={{ color: era.textColor }}
                >
                  {eraName}
                </h2>
                <p className="mt-1 font-mono text-sm" style={{ color: era.color }}>
                  {eraSubtitle}
                </p>
              </div>

              {/* Station number badge */}
              <motion.div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold font-mono"
                style={{ backgroundColor: era.color + "18", color: era.color }}
                animate={{ rotate: isInView ? 0 : -10, scale: isInView ? 1 : 0.8 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.div>
            </div>

            {/* Description */}
            <p className="mt-4 max-w-3xl text-base leading-relaxed" style={{ color: era.textColor, opacity: 0.8 }}>
              {eraDescription}
            </p>

            {/* Key fact panel */}
            <motion.div
              className="mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 font-mono text-xs leading-relaxed"
              style={{
                borderColor: era.color + "35",
                color: era.color,
                backgroundColor: era.color + "0d",
              }}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -12 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="mt-0.5 shrink-0 text-base">⚡</span>
              <span>{eraKeyFact}</span>
            </motion.div>
          </div>

          {/* Station interactive content */}
          <div
            className="p-6 md:p-8"
            style={{ backgroundColor: era.bgColor + "80" }}
            role="region"
            aria-labelledby={`station-title-${era.id}`}
          >
            {children}
          </div>
        </div>

        {/* Skip-to-next-station link for keyboard users */}
        {index < ERAS.length - 1 && (
          <a
            href={`#${ERAS[index + 1].id}`}
            className="station-skip-nav"
          >
            {tc("skipToStation", { name: te(`${ERAS[index + 1].id}.name`) })}
          </a>
        )}
      </motion.div>
    </section>
  );
}
