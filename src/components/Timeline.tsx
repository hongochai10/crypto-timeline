"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, MotionConfig } from "framer-motion";
import { useTranslations } from "next-intl";
import { ERAS, type EraId } from "@/lib/constants";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import Station from "./Station";
import ScrollProgress from "./ui/ScrollProgress";
import ErrorBoundary from "./ui/ErrorBoundary";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

// Lazy-load station content components — each pulls in demos, attacks, and crypto libs
const CaesarStation = dynamic(() => import("./stations/CaesarStation"), { ssr: false });
const DESStation = dynamic(() => import("./stations/DESStation"), { ssr: false });
const AESStation = dynamic(() => import("./stations/AESStation"), { ssr: false });
const RSAStation = dynamic(() => import("./stations/RSAStation"), { ssr: false });
const ECCStation = dynamic(() => import("./stations/ECCStation"), { ssr: false });
const PQCStation = dynamic(() => import("./stations/PQCStation"), { ssr: false });

// Lazy-load heavy below-fold components
const EraTransition = dynamic(() => import("./ui/EraTransition"), { ssr: false });
const BenchmarkComparison = dynamic(() => import("./ui/BenchmarkComparison"), { ssr: false });

const STATION_COMPONENTS = {
  caesar: CaesarStation,
  des: DESStation,
  aes: AESStation,
  rsa: RSAStation,
  ecc: ECCStation,
  pqc: PQCStation,
} as const;

// Pre-generate deterministic star positions (seeded by index) to avoid impure Math.random in render
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// Hero background: subtle animated star-field using CSS animations (no JS animation overhead)
function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 5) * 100,
        y: seededRandom(i * 5 + 1) * 100,
        size: seededRandom(i * 5 + 2) * 1.5 + 0.5,
        delay: seededRandom(i * 5 + 3) * 4,
        duration: seededRandom(i * 5 + 4) * 3 + 3,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
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
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  const tf = useTranslations("footer");
  const te = useTranslations("eras");
  const searchParams = useSearchParams();

  const { activeIndex, updateActiveFromScroll, navigateTo } = useKeyboardNavigation();
  const tp = useTranslations("progress");
  const { visitedCount, quizCompletedCount, totalStations } = useProgressTracking();

  // Callback for Station to report when it scrolls into view
  const handleStationInView = useCallback(
    (eraId: EraId) => {
      updateActiveFromScroll(eraId);
    },
    [updateActiveFromScroll],
  );

  // Auto-scroll to station when ?station= param is present
  useEffect(() => {
    const station = searchParams.get("station");
    if (station && ERAS.some((e) => e.id === station)) {
      // Delay to allow page render before scrolling
      const timer = setTimeout(() => {
        const el = document.getElementById(station);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative" data-testid="timeline">
      {/* Fixed scroll progress indicator */}
      <ScrollProgress />

      {/* Theme and language controls */}
      <ThemeToggle />
      <LanguageSwitcher />

      {/* Skip to content link — accessibility */}
      <a href="#timeline-start" className="skip-link">
        {tc("skipToTimeline")}
      </a>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ backgroundColor: "var(--bg-base)" }}
        aria-label={t("introAriaLabel")}
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
            {t("label")}
          </motion.p>

          {/* Main headline — no initial hidden state to avoid delaying LCP */}
          <h1
            className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ color: "var(--text-primary)" }}
          >
            {t("title1")}
            <span
              className="block"
              style={{
                background: `linear-gradient(135deg, #c9a227 0%, #e8850a 20%, #00a3ff 45%, #a855f7 65%, #10b981 82%, #22d3ee 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("title2")}
            </span>
          </h1>

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
            {t("subtitle")}
          </motion.p>

          {/* Era dot navigation */}
          <motion.nav
            className="flex items-center gap-3"
            aria-label={tc("jumpToEra")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {ERAS.map((era, i) => (
              <a
                key={era.id}
                href={`#${era.id}`}
                aria-label={tc("jumpTo", { name: te(`${era.id}.name`) })}
                className="group flex flex-col items-center gap-1.5"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(i);
                }}
              >
                <div
                  className="h-2.5 w-2.5 rounded-full transition-all duration-300 group-hover:scale-150"
                  style={{ backgroundColor: era.color }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-70 transition-opacity"
                  style={{ color: era.color }}>
                  {te(`${era.id}.year`)}
                </span>
              </a>
            ))}
          </motion.nav>

          {/* Progress summary */}
          {visitedCount > 0 && (
            <motion.div
              className="flex items-center gap-4 rounded-xl border px-5 py-3 font-mono text-xs"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                backgroundColor: "rgba(255,255,255,0.03)",
                color: "var(--text-secondary)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              role="status"
              aria-label={tp("summaryAria", { visited: String(visitedCount), quizzes: String(quizCompletedCount), total: String(totalStations) })}
            >
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>{tp("stationsVisited", { count: visitedCount, total: totalStations })}</span>
              </div>
              <div className="h-3 w-px bg-white/10" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <span className="text-amber-400">★</span>
                <span>{tp("quizzesCompleted", { count: quizCompletedCount, total: totalStations })}</span>
              </div>
              {/* Mini progress bar */}
              <div className="hidden sm:flex items-center gap-2 flex-1 min-w-[80px]">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400/60 transition-all duration-500"
                    style={{ width: `${(visitedCount / totalStations) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Scroll cue */}
          <motion.div
            className="flex flex-col items-center gap-2 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            aria-hidden
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
              {tc("scrollToExplore")}
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

      {/* Screen reader live region for station announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {activeIndex >= 0 && te(`${ERAS[activeIndex].id}.name`) + " — " + te(`${ERAS[activeIndex].id}.year`) + `. ${tc("stationOf", { current: String(activeIndex + 1), total: String(ERAS.length) })}`}
      </div>

      {ERAS.map((era, index) => {
        const StationContent = STATION_COMPONENTS[era.id];
        const nextEra = ERAS[index + 1];
        return (
          <div key={era.id}>
            <Station
              era={era}
              index={index}
              isKeyboardActive={activeIndex === index}
              onInView={handleStationInView}
            >
              <ErrorBoundary stationName={te(`${era.id}.name`)} accentColor={era.color}>
                <StationContent era={era} />
              </ErrorBoundary>
            </Station>

            {/* Era-to-era cinematic transition */}
            {nextEra && <EraTransition fromEra={era} toEra={nextEra} />}
          </div>
        );
      })}

      {/* ── Benchmark Comparison ─────────────────────────────── */}
      <section
        className="flex flex-col items-center justify-center gap-8 px-6 py-20"
        style={{ backgroundColor: "var(--bg-base)" }}
        aria-label="Algorithm Performance Comparison"
      >
        <BenchmarkComparison />
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer
        className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div
          className="h-px w-32"
          style={{ background: "linear-gradient(90deg, transparent, #22d3ee, transparent)" }}
        />
        <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
          {tf("endOfTimeline")}
        </p>
        <p className="max-w-md text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {tf("continueStory")}
        </p>
        <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
          {tf("copyright", { year: new Date().getFullYear() })}
        </p>
      </footer>
    </div>
    </MotionConfig>
  );
}
