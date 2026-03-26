"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import { desBruteForceStats } from "@/lib/crypto/des";

interface Props {
  era: Era;
}

const TIMELINE = [
  { year: "1977", event: "DES standardized — 56-bit key deemed secure", color: "#22c55e" },
  { year: "1993", event: "Michael Wiener estimates $1M machine cracks in 3.5h", color: "#f59e0b" },
  { year: "1997", event: "RSA DES Challenge cracked in 96 days by internet volunteers", color: "#f97316" },
  { year: "1998", event: "EFF Deep Crack: 250,000 chips, cracked in 22 hours, cost $250K", color: "#ef4444" },
  { year: "1999", event: "Deep Crack + distributed.net: 22 hours 15 minutes", color: "#ef4444" },
  { year: "2008", event: "COPACOBANA FPGA cluster: ~6 days, cost ~$10K", color: "#dc2626" },
];

function formatDuration(ms: number): string {
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(0)} min`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours.toFixed(0)} hours`;
  const days = hours / 24;
  if (days < 365) return `${days.toFixed(0)} days`;
  return `${(days / 365).toFixed(0)} years`;
}

export default function DESAttack({ era }: Props) {
  const stats = desBruteForceStats();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [keysChecked, setKeysChecked] = useState(0);
  const [cracked, setCracked] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalKeys = stats.keyspaceSize;

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
    setKeysChecked(0);
    setCracked(false);

    // Simulate finding key at ~50% through keyspace (average case)
    const targetPercent = 40 + Math.random() * 20;
    const durationMs = 4000;
    const steps = 60;
    const stepMs = durationMs / steps;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      const pct = (step / steps) * targetPercent;
      setProgress(pct);
      setKeysChecked(Math.floor((pct / 100) * totalKeys));

      if (step >= steps) {
        clearInterval(intervalRef.current!);
        setProgress(targetPercent);
        setCracked(true);
        setIsRunning(false);
      }
    }, stepMs);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setProgress(0);
    setKeysChecked(0);
    setCracked(false);
  };

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase text-red-400">
          Attack Demo
        </h3>
        <p className="text-sm" style={{ color: era.color + "99" }}>Brute force — 2⁵⁶ keyspace visualization</p>
      </div>

      {/* Keyspace stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-3" style={{ borderColor: "#ef444430", backgroundColor: "#ef444408" }}>
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Key Size</p>
          <p className="font-mono text-xl font-bold text-red-400">56-bit</p>
          <p className="font-mono text-[10px] text-[var(--text-muted)]">2⁵⁶ ≈ 7.2 × 10¹⁶</p>
        </div>
        <div className="rounded-lg border p-3" style={{ borderColor: "#ef444430", backgroundColor: "#ef444408" }}>
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">Modern FPGA</p>
          <p className="font-mono text-xl font-bold text-red-400">~6 days</p>
          <p className="font-mono text-[10px] text-[var(--text-muted)]">1B keys/sec/chip</p>
        </div>
      </div>

      {/* Progress bar simulation */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
            Keyspace scanned
          </label>
          <span className="font-mono text-xs text-red-400">{progress.toFixed(1)}%</span>
        </div>
        <div className="relative h-4 overflow-hidden rounded-full bg-[var(--bg-base)]" style={{ border: "1px solid #ef444430" }}>
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #ef4444aa, #ef4444)" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        <p className="font-mono text-[10px] text-[var(--text-muted)]">
          Keys checked: {keysChecked.toLocaleString()} / ~{Math.floor(totalKeys / 1e15).toLocaleString()} × 10¹⁵
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="flex-1 rounded-lg px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
          style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)" }}
        >
          {isRunning ? "Brute-forcing…" : "⚡ Simulate Brute Force"}
        </button>
        {(cracked || progress > 0) && (
          <button
            onClick={reset}
            className="rounded-lg px-4 py-3 font-mono text-xs tracking-widest uppercase transition-all"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border-default)" }}
          >
            Reset
          </button>
        )}
      </div>

      {cracked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-3"
        >
          <p className="font-mono text-xs text-red-400 uppercase tracking-widest mb-1">Key Found at {progress.toFixed(1)}% of keyspace</p>
          <p className="font-mono text-xs text-[var(--text-secondary)]">
            Estimated real time on FPGA cluster: {formatDuration((progress / 100) * stats.estimatedTotalMs)}
          </p>
        </motion.div>
      )}

      {/* Historical timeline */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Breaking DES — Historical Timeline</p>
        <div className="space-y-2">
          {TIMELINE.map((item) => (
            <div key={item.year} className="flex items-start gap-3">
              <span className="font-mono text-[10px] shrink-0 w-8 pt-0.5" style={{ color: item.color }}>{item.year}</span>
              <div className="w-px self-stretch mt-1 shrink-0" style={{ backgroundColor: item.color + "40" }} />
              <p className="font-mono text-[10px] text-[var(--text-muted)] leading-relaxed">{item.event}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
