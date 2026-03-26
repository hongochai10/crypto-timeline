"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Era } from "@/lib/constants";
import { rsaFactorDemo, rsaSecurityInfo } from "@/lib/crypto/rsa";

interface Props {
  era: Era;
}

// Small semiprime examples for the toy demo
const TOY_EXAMPLES = [
  { n: 3233, p: 61, q: 53, label: "RSA-12 (toy)" },
  { n: 10403, p: 101, q: 103, label: "RSA-14 (toy)" },
  { n: 40291, p: 191, q: 211, label: "RSA-16 (toy)" },
];

export default function RSAAttack({ era }: Props) {
  const securityInfo = rsaSecurityInfo();
  const [selectedExample, setSelectedExample] = useState(TOY_EXAMPLES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [animStep, setAnimStep] = useState(-1);
  const [result, setResult] = useState<{ n: number; p: number; q: number; steps: number } | null>(null);

  const runFactoring = async () => {
    setIsRunning(true);
    setResult(null);
    setAnimStep(-1);

    const demo = rsaFactorDemo(selectedExample.n);
    // Animate through divisors
    for (let i = 2; i <= demo.p; i++) {
      setAnimStep(i);
      await new Promise((r) => setTimeout(r, Math.max(20, 300 / demo.steps)));
    }
    setResult(demo);
    setIsRunning(false);
  };

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase text-red-400">
          Attack Demo
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">Integer factoring — the hard problem RSA relies on</p>
      </div>

      {/* Concept explanation */}
      <div className="rounded-lg border px-4 py-3" style={{ borderColor: "#ef444430", backgroundColor: "#ef444408" }}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-red-400 mb-2">The RSA Hard Problem</p>
        <p className="font-mono text-xs text-[var(--text-muted)] leading-relaxed">
          Given n = p × q (a product of two large primes), find p and q.<br />
          Easy to multiply: microseconds. Hard to factor: billions of years for 2048-bit n.
        </p>
      </div>

      {/* Toy factoring demo */}
      <div>
        <p className="mb-2 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Toy RSA Factoring Demo</p>
        <div className="flex gap-2 mb-3 flex-wrap">
          {TOY_EXAMPLES.map((ex) => (
            <button
              key={ex.n}
              onClick={() => { setSelectedExample(ex); setResult(null); setAnimStep(-1); }}
              className="rounded-lg px-3 py-1.5 font-mono text-xs transition-all"
              style={
                selectedExample.n === ex.n
                  ? { backgroundColor: "#ef444420", color: "#ef4444", border: "1px solid #ef4444" }
                  : { color: "var(--text-muted)", border: "1px solid var(--border-default)", backgroundColor: "transparent" }
              }
            >
              n = {ex.n}
            </button>
          ))}
        </div>

        <div className="rounded-lg border px-4 py-3 font-mono text-sm mb-3" style={{ borderColor: "#ef444430", backgroundColor: "#ef444408" }}>
          <span className="text-[var(--text-muted)]">Factor </span>
          <span className="text-red-400 font-bold">n = {selectedExample.n}</span>
          {animStep > -1 && !result && (
            <span className="text-[var(--text-muted)] text-xs"> — trying {animStep}…</span>
          )}
        </div>

        <button
          onClick={runFactoring}
          disabled={isRunning}
          className="w-full rounded-lg px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
          style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.4)" }}
        >
          {isRunning ? `Trying divisor ${animStep}…` : "⚡ Run Trial Division Attack"}
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4"
            >
              <p className="font-mono text-xs text-red-400 uppercase tracking-widest mb-2">Factored!</p>
              <div className="font-mono text-sm space-y-1">
                <p><span className="text-[var(--text-muted)]">n = </span><span className="text-red-400">{result.n}</span></p>
                <p><span className="text-[var(--text-muted)]">p = </span><span style={{ color: era.color }}>{result.p}</span></p>
                <p><span className="text-[var(--text-muted)]">q = </span><span style={{ color: era.color }}>{result.q}</span></p>
                <p><span className="text-[var(--text-muted)]">Steps: </span><span className="text-[var(--text-primary)]">{result.steps} divisions</span></p>
              </div>
              <p className="mt-2 font-mono text-[10px] text-red-400/70">
                Toy RSA cracked in {result.steps} steps. Real RSA-2048 would require ~10²⁰ steps.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Security levels table */}
      <div>
        <p className="mb-3 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">RSA key size security</p>
        <div className="space-y-2">
          {securityInfo.sizes.map((sz) => (
            <div
              key={sz.bits}
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{
                backgroundColor: sz.status === "broken" || sz.status === "weak" ? "#ef444410" : era.color + "10",
                border: `1px solid ${sz.status === "broken" || sz.status === "weak" ? "#ef444430" : era.color + "30"}`,
              }}
            >
              <div>
                <span className="font-mono text-xs font-bold" style={{ color: sz.status === "broken" || sz.status === "weak" ? "#ef4444" : era.color }}>
                  RSA-{sz.bits}
                </span>
                <span
                  className="ml-2 font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: sz.status === "broken" ? "#ef444430" : sz.status === "weak" ? "#f9741630" : "#22c55e30",
                    color: sz.status === "broken" ? "#ef4444" : sz.status === "weak" ? "#f97316" : "#22c55e",
                  }}
                >
                  {sz.status}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-muted)] text-right max-w-[140px]">{sz.yearsToFactor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
