"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { type Era } from "@/lib/constants";
import PQCDemo from "@/components/demos/PQCDemo";
import PQCAttack from "@/components/attacks/PQCAttack";
import { getQuizQuestions } from "@/lib/quiz-data";

const BenchmarkPanel = dynamic(() => import("@/components/ui/BenchmarkPanel"), { ssr: false });
const StationQuiz = dynamic(() => import("@/components/quiz/StationQuiz"), { ssr: false });

interface StationProps {
  era: Era;
}

function TimelineRow({ event, color, index }: { event: { year: string; label: string; detail: string }; color: string; index: number }) {
  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col items-center pt-1 shrink-0">
        <div className="h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: color, backgroundColor: color + "33" }} />
        <div className="mt-1 w-px flex-1 min-h-[2rem]" style={{ backgroundColor: color + "25" }} />
      </div>
      <div className="pb-4 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-mono text-xs font-bold tracking-widest" style={{ color }}>{event.year}</span>
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{event.label}</span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{event.detail}</p>
      </div>
    </motion.div>
  );
}

export default function PQCStation({ era }: StationProps) {
  const t = useTranslations("stations.pqc");
  const tc = useTranslations("common");
  const tq = useTranslations("quiz");
  const quizQuestions = getQuizQuestions("pqc", (key) => tq(key));

  const TIMELINE_EVENTS = [
    { year: t("timelineEvents.0.year"), label: t("timelineEvents.0.label"), detail: t("timelineEvents.0.detail") },
    { year: t("timelineEvents.1.year"), label: t("timelineEvents.1.label"), detail: t("timelineEvents.1.detail") },
    { year: t("timelineEvents.2.year"), label: t("timelineEvents.2.label"), detail: t("timelineEvents.2.detail") },
    { year: t("timelineEvents.3.year"), label: t("timelineEvents.3.label"), detail: t("timelineEvents.3.detail") },
    { year: t("timelineEvents.4.year"), label: t("timelineEvents.4.label"), detail: t("timelineEvents.4.detail") },
    { year: t("timelineEvents.5.year"), label: t("timelineEvents.5.label"), detail: t("timelineEvents.5.detail") },
  ];

  const KEY_FIGURES = [
    { name: t("keyFigures.0.name"), role: t("keyFigures.0.role"), note: t("keyFigures.0.note") },
    { name: t("keyFigures.1.name"), role: t("keyFigures.1.role"), note: t("keyFigures.1.note") },
    { name: t("keyFigures.2.name"), role: t("keyFigures.2.role"), note: t("keyFigures.2.note") },
  ];

  const THREAT_COMPARISON = [
    { algo: "Caesar", threat: "Classical", icon: "\u2694\uFE0F", status: t("threatComparison.0.status"), color: "#f87171" },
    { algo: "DES", threat: "Classical", icon: "\uD83D\uDCBB", status: t("threatComparison.1.status"), color: "#f87171" },
    { algo: "AES-256", threat: "Quantum (Grover)", icon: "\u269B\uFE0F", status: t("threatComparison.2.status"), color: "#f59e0b", note: t("threatComparison.2.note") },
    { algo: "RSA/ECC", threat: "Quantum (Shor)", icon: "\u269B\uFE0F", status: t("threatComparison.3.status"), color: "#ef4444", note: t("threatComparison.3.note") },
    { algo: "Kyber/Dilithium", threat: "Quantum", icon: "\uD83D\uDD12", status: t("threatComparison.4.status"), color: "#10b981", note: t("threatComparison.4.note") },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* "We Are Here" banner */}
      <motion.div
        className="rounded-xl border-2 p-5 md:p-6 relative overflow-hidden"
        style={{ borderColor: era.color + "60", backgroundColor: era.color + "10" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated background pulse */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ background: `radial-gradient(ellipse at center, ${era.color}15 0%, transparent 70%)` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <motion.div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: era.color }}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-mono text-xs uppercase tracking-widest font-bold" style={{ color: era.color }}>
              {t("youAreHere")}
            </span>
          </div>
          <h3 className="mb-3 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {t("quantumThreatTitle")}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {t("narrative1")}
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {t("narrative2")}
          </p>
        </div>
      </motion.div>

      {/* Quantum threat table */}
      <motion.div
        className="rounded-xl border p-5"
        style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <h3 className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          {t("threatAssessment")}
        </h3>
        <div className="flex flex-col gap-2">
          {THREAT_COMPARISON.map((row, i) => (
            <motion.div
              key={row.algo}
              className="flex items-center gap-3 rounded-lg border px-3 py-2 font-mono text-xs"
              style={{ borderColor: row.color + "22", backgroundColor: row.color + "08" }}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <span className="text-base shrink-0">{row.icon}</span>
              <span className="font-bold w-28 shrink-0" style={{ color: "var(--text-primary)" }}>{row.algo}</span>
              <span className="w-24 shrink-0" style={{ color: "var(--text-muted)" }}>{row.threat}</span>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: row.color, backgroundColor: row.color + "18", border: `1px solid ${row.color}30` }}
              >
                {row.status}
              </span>
              {row.note && (
                <span className="hidden sm:block" style={{ color: "var(--text-muted)" }}>{row.note}</span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Figures + Timeline */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
            {tc("keyFigures")}
          </h3>
          <div className="flex flex-col gap-3">
            {KEY_FIGURES.map((fig, i) => (
              <motion.div
                key={fig.name}
                className="rounded-lg border p-3"
                style={{ borderColor: era.color + "20", backgroundColor: era.color + "06" }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{fig.name}</p>
                <p className="font-mono text-xs mt-0.5 mb-1.5" style={{ color: era.color + "cc" }}>{fig.role}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{fig.note}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
            {tc("timeline")}
          </h3>
          <div>
            {TIMELINE_EVENTS.map((event, i) => (
              <TimelineRow key={event.year + event.label} event={event} color={era.color} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Performance Benchmark */}
      <BenchmarkPanel algorithm="pqc" color={era.color} />

      {/* Interactive Demo + Attack */}
      <div>
        <h3 className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          {tc("interactiveDemos")}
        </h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <PQCDemo era={era} />
          <PQCAttack era={era} />
        </div>
      </div>

      {/* Knowledge Check Quiz */}
      <StationQuiz eraId="pqc" color={era.color} questions={quizQuestions} />
    </div>
  );
}
