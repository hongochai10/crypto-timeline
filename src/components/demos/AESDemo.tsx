"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import { aesKeyFromPassphrase, aesEncrypt, aesDecrypt, type AESKey } from "@/lib/crypto/aes";
import InteractiveInput from "@/components/ui/InteractiveInput";

interface Props {
  era: Era;
}

export default function AESDemo({ era }: Props) {
  const [passphrase, setPassphrase] = useState("my-secret-key");
  const [plaintext, setPlaintext] = useState("Hello, AES-256!");
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [keyInfo, setKeyInfo] = useState<{ base64: string; salt: string } | null>(null);
  const [activeKey, setActiveKey] = useState<AESKey | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const handleEncrypt = async () => {
    setStatus("loading");
    setCiphertext("");
    setDecrypted("");
    try {
      const { key, salt } = await aesKeyFromPassphrase(passphrase);
      const result = await aesEncrypt(plaintext, key);
      setKeyInfo({ base64: key.base64.slice(0, 32) + "…", salt: salt.slice(0, 16) + "…" });
      setActiveKey(key);
      setCiphertext(result.ciphertext);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const handleDecrypt = async () => {
    if (!activeKey || !ciphertext) return;
    setStatus("loading");
    setDecrypted("");
    try {
      const result = await aesDecrypt(ciphertext, activeKey);
      setDecrypted(result.plaintext);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          Interactive Demo
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">AES-256-GCM — authenticated encryption via Web Crypto</p>
      </div>

      <div className="flex gap-2">
        {(["encrypt", "decrypt"] as const).map((m) => (
          <button
            key={m}
            data-testid={`aes-${m}-btn`}
            onClick={() => { setMode(m); setStatus("idle"); }}
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
        label="Passphrase"
        value={passphrase}
        onChange={(e) => { setPassphrase(e.target.value); setCiphertext(""); setDecrypted(""); setActiveKey(null); setStatus("idle"); }}
        placeholder="my-secret-key"
        accentColor={era.color}
        type="password"
        data-testid="aes-passphrase"
      />

      {mode === "encrypt" ? (
        <>
          <InteractiveInput
            label="Plaintext"
            value={plaintext}
            onChange={(e) => { setPlaintext(e.target.value); setCiphertext(""); setStatus("idle"); }}
            placeholder="Enter message to encrypt..."
            accentColor={era.color}
            data-testid="aes-plaintext"
          />
          <button
            onClick={handleEncrypt}
            disabled={status === "loading" || !plaintext.trim() || !passphrase.trim()}
            data-testid="aes-encrypt-run-btn"
            className="rounded-lg px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
            style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
          >
            {status === "loading" ? "Encrypting…" : "⚙ Encrypt with AES-256"}
          </button>
        </>
      ) : (
        <button
          onClick={handleDecrypt}
          disabled={status === "loading" || !ciphertext || !activeKey}
          data-testid="aes-decrypt-run-btn"
          className="rounded-lg px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
          style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
        >
          {status === "loading" ? "Decrypting…" : !activeKey ? "Encrypt first to get a key" : "⚙ Decrypt"}
        </button>
      )}

      {keyInfo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-3 font-mono text-xs space-y-1"
          style={{ borderColor: era.color + "30", backgroundColor: era.color + "08" }}
        >
          <p className="text-[var(--text-muted)] uppercase tracking-widest mb-1">Derived Key (PBKDF2 + SHA-256)</p>
          <p style={{ color: era.color }}>Key: {keyInfo.base64}</p>
          <p style={{ color: era.color }}>Salt: {keyInfo.salt}</p>
          <p className="text-[var(--text-muted)]">100,000 iterations · AES-256-GCM</p>
        </motion.div>
      )}

      {ciphertext && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">Ciphertext (base64)</label>
          <div className="code-display break-all text-xs" data-testid="aes-ciphertext" style={{ color: era.color }}>
            {ciphertext.slice(0, 80)}…
          </div>
        </motion.div>
      )}

      {decrypted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-green-500/30 bg-green-500/10 p-3"
        >
          <p className="mb-1 font-mono text-xs text-green-400 uppercase tracking-widest">Decrypted</p>
          <p className="font-mono text-sm text-[var(--text-primary)]" data-testid="aes-decrypted">{decrypted}</p>
        </motion.div>
      )}

      {status === "error" && (
        <p className="font-mono text-xs text-red-400">Decryption failed — wrong key or tampered ciphertext.</p>
      )}
    </div>
  );
}
