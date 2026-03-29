"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { type Era } from "@/lib/constants";
import AESDemo from "@/components/demos/AESDemo";
import AESAttack from "@/components/attacks/AESAttack";
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

export default function AESStation({ era }: StationProps) {
  const t = useTranslations("stations.aes");
  const tc = useTranslations("common");
  const tq = useTranslations("quiz");
  const quizQuestions = getQuizQuestions("aes", (key) => tq(key));

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

  return (
    <div className="flex flex-col gap-8">
      {/* Historical Narrative */}
      <motion.div
        className="rounded-xl border p-5 md:p-6"
        style={{ borderColor: era.color + "22", backgroundColor: era.color + "08" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h3 className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          {tc("historicalNarrative")}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {t("narrative1")}
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {t("narrative2")}
        </p>
      </motion.div>

      {/* Keyspace visualization */}
      <motion.div
        className="rounded-xl border p-5"
        style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <h3 className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          {t("whyUnbreakable")}
        </h3>
        <div className="grid gap-4 sm:grid-cols-3 font-mono text-center">
          {[
            { label: t("keyspaceItems.desKeys.label"), value: "2⁵⁶", sub: "~7.2 × 10¹⁶", note: t("keyspaceItems.desKeys.note"), warn: true },
            { label: t("keyspaceItems.aes128Keys.label"), value: "2¹²⁸", sub: "~3.4 × 10³⁸", note: t("keyspaceItems.aes128Keys.note") },
            { label: t("keyspaceItems.aes256Keys.label"), value: "2²⁵⁶", sub: "~1.2 × 10⁷⁷", note: t("keyspaceItems.aes256Keys.note") },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border p-3"
              style={{
                borderColor: item.warn ? "rgba(239,68,68,0.3)" : era.color + "25",
                backgroundColor: item.warn ? "rgba(239,68,68,0.07)" : era.color + "08",
              }}
            >
              <p className="text-xs mb-1" style={{ color: item.warn ? "#ef4444" : era.color + "cc" }}>{item.label}</p>
              <p className="text-2xl font-bold" style={{ color: item.warn ? "#ef4444" : era.color }}>{item.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{item.sub}</p>
              <p className="text-xs mt-1 font-semibold" style={{ color: item.warn ? "#ef4444" : "var(--text-secondary)" }}>{item.note}</p>
            </div>
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
              <TimelineRow key={event.year} event={event} color={era.color} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Performance Benchmark */}
      <BenchmarkPanel algorithm="aes" color={era.color} />

      {/* Interactive Demo + Attack */}
      <div>
        <h3 className="mb-4 font-mono text-xs uppercase tracking-widest" style={{ color: era.color }}>
          {tc("interactiveDemos")}
        </h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <AESDemo era={era} />
          <AESAttack era={era} />
        </div>
      </div>

      {/* Knowledge Check Quiz */}
      <StationQuiz eraId="aes" color={era.color} questions={quizQuestions} />
    </div>
  );
}
