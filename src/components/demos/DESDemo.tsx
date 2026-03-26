"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Era } from "@/lib/constants";
import { desEncrypt, desDecrypt, type DESRound } from "@/lib/crypto/des";
import InteractiveInput from "@/components/ui/InteractiveInput";

interface Props {
  era: Era;
}

export default function DESDemo({ era }: Props) {
  const [plaintext, setPlaintext] = useState("HELLO DES");
  const [key, setKey] = useState("SECRET01");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [rounds, setRounds] = useState<DESRound[]>([]);
  const [output, setOutput] = useState("");
  const [showRounds, setShowRounds] = useState(false);
  const [error, setError] = useState("");

  const run = () => {
    setError("");
    try {
      if (mode === "encrypt") {
        const result = desEncrypt(plaintext, key);
        setOutput(result.hex);
        setRounds(result.rounds);
      } else {
        const result = desDecrypt(plaintext.trim(), key);
        setOutput(result.output);
        setRounds([]);
      }
    } catch {
      setError("Invalid input. For decrypt mode, paste the hex ciphertext.");
    }
  };

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          Interactive Demo
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">DES Feistel network — 16 rounds of encryption</p>
      </div>

      <div className="flex gap-2">
        {(["encrypt", "decrypt"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(""); setRounds([]); setError(""); }}
            className="rounded-lg px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all"
            style={
              mode === m
                ? { backgroundColor: era.color + "30", color: era.color, border: `1px solid ${era.color}` }
                : { backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-default)" }
            }
          >
            {m}
          </button>
        ))}
      </div>

      <InteractiveInput
        label={mode === "encrypt" ? "Plaintext" : "Hex Ciphertext"}
        value={plaintext}
        onChange={(e) => { setPlaintext(e.target.value); setOutput(""); }}
        placeholder={mode === "encrypt" ? "Enter text..." : "Paste hex output..."}
        accentColor={era.color}
      />

      <InteractiveInput
        label="Key (8 chars)"
        value={key}
        onChange={(e) => { setKey(e.target.value.slice(0, 8)); setOutput(""); }}
        placeholder="SECRET01"
        accentColor={era.color}
        maxLength={8}
      />
      <p className="font-mono text-xs text-[var(--text-muted)]">Key length: {key.length}/8 characters</p>

      <button
        onClick={run}
        disabled={!plaintext.trim() || !key.trim()}
        className="rounded-lg px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
        style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
      >
        {mode === "encrypt" ? "⚙ Encrypt with DES" : "⚙ Decrypt with DES"}
      </button>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">{error}</p>
      )}

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <label className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">
            {mode === "encrypt" ? "Ciphertext (hex)" : "Plaintext"}
          </label>
          <div className="code-display break-all text-sm tracking-wider" style={{ color: era.color }}>
            {output}
          </div>
        </motion.div>
      )}

      {rounds.length > 0 && (
        <div>
          <button
            onClick={() => setShowRounds((s) => !s)}
            className="font-mono text-xs tracking-widest uppercase transition-colors"
            style={{ color: era.color + "80" }}
          >
            {showRounds ? "▾ Hide" : "▸ Show"} 16 Feistel Rounds
          </button>
          <AnimatePresence>
            {showRounds && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="space-y-1">
                  {rounds.map((r) => (
                    <div
                      key={r.round}
                      className="flex items-center gap-3 rounded px-3 py-1.5 font-mono text-[10px]"
                      style={{ backgroundColor: era.color + "08", borderLeft: `2px solid ${era.color}${r.round === 16 ? "ff" : "30"}` }}
                    >
                      <span className="w-8 shrink-0 text-[var(--text-muted)]">R{r.round.toString().padStart(2, "0")}</span>
                      <span className="truncate text-[var(--text-secondary)]">L: {r.left.slice(0, 8)}…</span>
                      <span className="truncate text-[var(--text-secondary)]">R: {r.right.slice(0, 8)}…</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
