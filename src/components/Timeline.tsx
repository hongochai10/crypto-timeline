"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionConfig } from "framer-motion";
import { ERAS } from "@/lib/constants";
import Station from "./Station";
import ScrollProgress from "./ui/ScrollProgress";
import EraTransition from "./ui/EraTransition";
import CaesarStation from "./stations/CaesarStation";
import DESStation from "./stations/DESStation";
import AESStation from "./stations/AESStation";
import RSAStation from "./stations/RSAStation";
import ECCStation from "./stations/ECCStation";
import PQCStation from "./stations/PQCStation";
import ErrorBoundary from "./ui/ErrorBoundary";

const STATION_COMPONENTS = {
  caesar: CaesarStation,
  des: DESStation,
  aes: AESStation,
  rsa: RSAStation,
  ecc: ECCStation,
  pqc: PQCStation,
} as const;

// Hero background: subtle animated star-field particles
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 3,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// Animated era color strip in the hero
function EraColorStrip() {
  return (
    <div className="flex h-0.5 w-40 overflow-hidden rounded-full" role="presentation">
      {ERAS.map((era, i) => (
        <motion.div
          key={era.id}
          className="flex-1 h-full"
          style={{ backgroundColor: era.color }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

export default function Timeline() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative" data-testid="timeline">
      {/* Fixed scroll progress indicator */}
      <ScrollProgress />

      {/* Skip to content link — accessibility */}
      <a href="#timeline-start" className="skip-link">
        Skip to timeline
      </a>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ backgroundColor: "#080b14" }}
        aria-label="Crypto Timeline Introduction"
      >
        <StarField />

        {/* Background radial sweep */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(201,162,39,0.07) 0%, transparent 70%)",
          }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          {/* Label */}
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.35em]"
            style={{ color: "var(--text-muted)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            TechBi Labs · Interactive Exhibit
          </motion.p>

          {/* Main headline */}
          <motion.h1
            className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ color: "var(--text-primary)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Crypto
            <span
              className="block"
              style={{
                background: `linear-gradient(135deg, #c9a227 0%, #e8850a 20%, #00a3ff 45%, #a855f7 65%, #10b981 82%, #22d3ee 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Timeline
            </span>
          </motion.h1>

          {/* Era color bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <EraColorStrip />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
          >
            A journey through 2,000 years of secret writing — from Julius Caesar&apos;s shift cipher
            to lattice-based post-quantum cryptography. Scroll to explore each era.
          </motion.p>

          {/* Era dot navigation */}
          <motion.nav
            className="flex items-center gap-3"
            aria-label="Jump to era"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {ERAS.map((era) => (
              <a
                key={era.id}
                href={`#${era.id}`}
                aria-label={`Jump to ${era.name}`}
                className="group flex flex-col items-center gap-1.5"
              >
                <div
                  className="h-2.5 w-2.5 rounded-full transition-all duration-300 group-hover:scale-150"
                  style={{ backgroundColor: era.color }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-70 transition-opacity"
                  style={{ color: era.color }}>
                  {era.year}
                </span>
              </a>
            ))}
          </motion.nav>

          {/* Scroll cue */}
          <motion.div
            className="flex flex-col items-center gap-2 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            aria-hidden
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
              Scroll to explore
            </span>
            <motion.div
              className="h-10 w-px rounded-full"
              style={{ background: "linear-gradient(to bottom, var(--border-default), transparent)" }}
              animate={{ scaleY: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── Era Stations ──────────────────────────────────────── */}
      <div id="timeline-start" tabIndex={-1} />
      {ERAS.map((era, index) => {
        const StationContent = STATION_COMPONENTS[era.id];
        const nextEra = ERAS[index + 1];
        return (
          <div key={era.id}>
            <Station era={era} index={index}>
              <ErrorBoundary stationName={era.name} accentColor={era.color}>
                <StationContent era={era} />
              </ErrorBoundary>
            </Station>

            {/* Era-to-era cinematic transition */}
            {nextEra && <EraTransition fromEra={era} toEra={nextEra} />}
          </div>
        );
      })}

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center"
        style={{ backgroundColor: "#050a12" }}
      >
        <div
          className="h-px w-32"
          style={{ background: "linear-gradient(90deg, transparent, #22d3ee, transparent)" }}
        />
        <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
          End of Timeline
        </p>
        <p className="max-w-md text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          The story continues — quantum computing evolves every day. The race to migrate begins now.
        </p>
        <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
          TechBi Labs · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
    </MotionConfig>
  );
}
