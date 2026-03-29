"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  runAllBenchmarks,
  ALGORITHM_META,
  type AlgorithmId,
  type BenchmarkResult,
} from "@/lib/benchmarks/crypto-benchmark";
import { ERAS } from "@/lib/constants";

const ALGO_COLORS: Record<AlgorithmId, string> = {
  caesar: "#c9a227",
  des: "#e8850a",
  aes: "#00a3ff",
  rsa: "#c084fc",
  ecc: "#10b981",
  pqc: "#22d3ee",
};

function formatOps(ops: number): string {
  if (ops >= 1_000_000) return `${(ops / 1_000_000).toFixed(1)}M`;
  if (ops >= 1_000) return `${(ops / 1_000).toFixed(1)}K`;
  return ops.toString();
}

function BarGroup({
  result,
  maxOps,
  index,
}: {
  result: BenchmarkResult;
  maxOps: number;
  index: number;
}) {
  const color = ALGO_COLORS[result.algorithm];
  const encPercent = Math.max((result.encryptOpsPerSec / maxOps) * 100, 2);
  const decPercent = Math.max((result.decryptOpsPerSec / maxOps) * 100, 2);

  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* Label */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-mono text-xs font-semibold" style={{ color }}>
            {ALGORITHM_META[result.algorithm].label}
          </span>
          <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
            ({ALGORITHM_META[result.algorithm].keyBits}-bit)
          </span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-6 font-mono text-[9px] text-right shrink-0" style={{ color: "var(--text-muted)" }}>
            E
          </span>
          <div className="flex-1 h-3 overflow-hidden rounded-sm" style={{ backgroundColor: color + "12" }}>
            <motion.div
              className="h-full rounded-sm"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${encPercent}%` }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="w-14 font-mono text-[10px] text-right shrink-0 font-bold" style={{ color }}>
            {formatOps(result.encryptOpsPerSec)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-6 font-mono text-[9px] text-right shrink-0" style={{ color: "var(--text-muted)" }}>
            D
          </span>
          <div className="flex-1 h-3 overflow-hidden rounded-sm" style={{ backgroundColor: color + "12" }}>
            <motion.div
              className="h-full rounded-sm"
              style={{ backgroundColor: color, opacity: 0.7 }}
              initial={{ width: 0 }}
              animate={{ width: `${decPercent}%` }}
              transition={{ duration: 0.8, delay: index * 0.08 + 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="w-14 font-mono text-[10px] text-right shrink-0" style={{ color: color + "aa" }}>
            {formatOps(result.decryptOpsPerSec)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function KeySizeChart({ results }: { results: BenchmarkResult[] }) {
  const t = useTranslations("benchmarks");
  const maxKeyBits = Math.max(...results.map((r) => r.keyBits));

  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        {t("keySizeVsSpeed")}
      </h4>
      {results.map((result, i) => {
        const color = ALGO_COLORS[result.algorithm];
        const keyPercent = Math.max((Math.log2(result.keyBits + 1) / Math.log2(maxKeyBits + 1)) * 100, 5);
        return (
          <motion.div
            key={result.algorithm}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <span className="w-16 font-mono text-[10px] text-right shrink-0" style={{ color }}>
              {ALGORITHM_META[result.algorithm].label}
            </span>
            <div className="flex-1 h-4 overflow-hidden rounded-sm" style={{ backgroundColor: color + "10" }}>
              <motion.div
                className="h-full rounded-sm flex items-center justify-end px-1"
                style={{ backgroundColor: color + "30" }}
                initial={{ width: 0 }}
                animate={{ width: `${keyPercent}%` }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
              >
                <span className="font-mono text-[9px] font-bold" style={{ color }}>
                  {result.keyBits}b
                </span>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function BenchmarkComparison() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [running, setRunning] = useState(false);
  const [currentAlgo, setCurrentAlgo] = useState<AlgorithmId | null>(null);
  const t = useTranslations("benchmarks");

  const handleRunAll = useCallback(async () => {
    setRunning(true);
    setResults([]);
    await new Promise((r) => setTimeout(r, 50));

    await runAllBenchmarks((result) => {
      setCurrentAlgo(result.algorithm);
      setResults((prev) => [...prev, result]);
    });

    setCurrentAlgo(null);
    setRunning(false);
  }, []);

  const maxOps = results.length > 0
    ? Math.max(...results.flatMap((r) => [r.encryptOpsPerSec, r.decryptOpsPerSec]))
    : 1;

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto rounded-2xl border overflow-hidden"
      style={{
        borderColor: "rgba(34,211,238,0.2)",
        backgroundColor: "rgba(34,211,238,0.04)",
        boxShadow: "0 0 60px -20px rgba(34,211,238,0.15)",
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 md:p-8 border-b" style={{ borderColor: "rgba(34,211,238,0.12)" }}>
        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "#22d3ee" }}>
            {t("comparisonTitle")}
          </h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("comparisonSubtitle")}
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={running}
          className="rounded-lg border px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          style={{
            color: "#22d3ee",
            borderColor: "rgba(34,211,238,0.5)",
            backgroundColor: "rgba(34,211,238,0.14)",
          }}
        >
          {running ? t("benchmarking") : results.length > 0 ? t("rerunAll") : t("runAll")}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Running indicator */}
        {running && results.length < 6 && (
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: currentAlgo ? ALGO_COLORS[currentAlgo] : "#22d3ee" }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
              {t("measuring")} {currentAlgo ? ALGORITHM_META[currentAlgo].label : "..."}
            </span>
            {/* Progress dots */}
            <div className="flex gap-1.5 ml-auto">
              {ERAS.map((era) => {
                const done = results.some((r) => r.algorithm === era.id);
                const active = currentAlgo === era.id;
                return (
                  <div
                    key={era.id}
                    className="h-2 w-2 rounded-full transition-colors"
                    style={{
                      backgroundColor: done ? era.color : active ? era.color + "80" : era.color + "20",
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-5"
            >
              {/* Bar chart */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    {t("opsPerSecond")}
                  </span>
                  <div className="flex items-center gap-3 ml-auto">
                    <span className="flex items-center gap-1 font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
                      <span className="inline-block h-2 w-4 rounded-sm bg-current opacity-80" /> E = {t("encrypt")}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[9px]" style={{ color: "var(--text-muted)" }}>
                      <span className="inline-block h-2 w-4 rounded-sm bg-current opacity-40" /> D = {t("decrypt")}
                    </span>
                  </div>
                </div>

                {results.map((result, i) => (
                  <BarGroup key={result.algorithm} result={result} maxOps={maxOps} index={i} />
                ))}
              </div>

              {/* Key size visualization */}
              {results.length === 6 && (
                <motion.div
                  className="mt-4 pt-5 border-t"
                  style={{ borderColor: "rgba(34,211,238,0.1)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <KeySizeChart results={results} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!running && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-3xl">&#9889;</span>
            <p className="font-mono text-xs text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
              {t("comparisonEmpty")}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
