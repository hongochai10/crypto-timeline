"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { type AlgorithmId, type BenchmarkResult } from "@/lib/benchmarks/crypto-benchmark";
import { useBenchmarkWorker } from "@/lib/benchmarks/useBenchmarkWorker";

interface BenchmarkPanelProps {
  algorithm: AlgorithmId;
  color: string;
}

function formatOps(ops: number): string {
  if (ops >= 1_000_000) return `${(ops / 1_000_000).toFixed(1)}M`;
  if (ops >= 1_000) return `${(ops / 1_000).toFixed(1)}K`;
  return ops.toString();
}

function OpsBar({
  label,
  ops,
  maxOps,
  color,
}: {
  label: string;
  ops: number;
  maxOps: number;
  color: string;
}) {
  const percent = Math.min((ops / maxOps) * 100, 100);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          {label}
        </span>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {formatOps(ops)} <span className="text-[10px] font-normal" style={{ color: "var(--text-muted)" }}>ops/s</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: color + "15" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export default function BenchmarkPanel({ algorithm, color }: BenchmarkPanelProps) {
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [running, setRunning] = useState(false);
  const t = useTranslations("benchmarks");
  const { run } = useBenchmarkWorker();

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await run(algorithm);
      setResult(res);
    } finally {
      setRunning(false);
    }
  }, [algorithm, run]);

  const maxOps = result
    ? Math.max(result.encryptOpsPerSec, result.decryptOpsPerSec)
    : 1;

  return (
    <motion.div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: color + "25", backgroundColor: color + "06" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between p-5 md:p-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold"
            style={{ backgroundColor: color + "18", color }}
          >
            &#9201;
          </span>
          <h3 className="font-mono text-xs uppercase tracking-widest" style={{ color }}>
            {t("title")}
          </h3>
        </div>

        <button
          onClick={handleRun}
          disabled={running}
          className="rounded-lg border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color,
            borderColor: color + "50",
            backgroundColor: color + "14",
          }}
        >
          {running ? t("running") : result ? t("rerun") : t("run")}
        </button>
      </div>

      <AnimatePresence>
        {(result || running) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-5 pb-5 md:px-6 md:pb-6">
              {running && (
                <div className="flex items-center justify-center gap-3 py-6">
                  <motion.div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                    {t("measuring")}
                  </span>
                </div>
              )}

              {result && !running && (
                <>
                  <OpsBar
                    label={t("encrypt")}
                    ops={result.encryptOpsPerSec}
                    maxOps={maxOps}
                    color={color}
                  />
                  <OpsBar
                    label={t("decrypt")}
                    ops={result.decryptOpsPerSec}
                    maxOps={maxOps}
                    color={color}
                  />

                  {/* Stats row */}
                  <div className="mt-1 grid grid-cols-3 gap-3 font-mono text-center">
                    <div
                      className="rounded-lg border p-2"
                      style={{ borderColor: color + "18", backgroundColor: color + "08" }}
                    >
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        {t("keySize")}
                      </p>
                      <p className="text-sm font-bold" style={{ color }}>
                        {result.keyBits}-bit
                      </p>
                    </div>
                    <div
                      className="rounded-lg border p-2"
                      style={{ borderColor: color + "18", backgroundColor: color + "08" }}
                    >
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        {t("iterations")}
                      </p>
                      <p className="text-sm font-bold" style={{ color }}>
                        {formatOps(result.iterations)}
                      </p>
                    </div>
                    <div
                      className="rounded-lg border p-2"
                      style={{ borderColor: color + "18", backgroundColor: color + "08" }}
                    >
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        {t("duration")}
                      </p>
                      <p className="text-sm font-bold" style={{ color }}>
                        {(result.durationMs / 1000).toFixed(1)}s
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
