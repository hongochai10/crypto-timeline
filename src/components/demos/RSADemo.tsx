"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt, type RSAKeyPair } from "@/lib/crypto/rsa";
import { getCryptoErrorMessage, isWebCryptoAvailable } from "@/lib/crypto/errors";
import InteractiveInput from "@/components/ui/InteractiveInput";

interface Props {
  era: Era;
}

export default function RSADemo({ era }: Props) {
  const [message, setMessage] = useState("Hello RSA!");
  const [keyPair, setKeyPair] = useState<RSAKeyPair | null>(null);
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [genStatus, setGenStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [encStatus, setEncStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [decStatus, setDecStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const generateKeys = async () => {
    setGenStatus("loading");
    setErrorMsg("");
    setCiphertext("");
    setDecrypted("");
    try {
      const kp = await rsaGenerateKeyPair(2048);
      setKeyPair(kp);
      setGenStatus("done");
    } catch (err) {
      setGenStatus("error");
      setErrorMsg(getCryptoErrorMessage(err, "rsa-keygen"));
    }
  };

  const encrypt = async () => {
    if (!keyPair) return;
    setEncStatus("loading");
    setErrorMsg("");
    setDecrypted("");
    try {
      const result = await rsaEncrypt(message, keyPair.publicKey);
      setCiphertext(result.ciphertext);
      setEncStatus("done");
    } catch (err) {
      setEncStatus("error");
      setErrorMsg(getCryptoErrorMessage(err, "rsa-encrypt"));
    }
  };

  const decrypt = async () => {
    if (!keyPair || !ciphertext) return;
    setDecStatus("loading");
    setErrorMsg("");
    try {
      const result = await rsaDecrypt(ciphertext, keyPair.privateKey);
      setDecrypted(result.plaintext);
      setDecStatus("done");
    } catch (err) {
      setDecStatus("error");
      setErrorMsg(getCryptoErrorMessage(err, "rsa-decrypt"));
    }
  };

  if (!isWebCryptoAvailable()) {
    return (
      <div className="demo-container rounded-lg border border-amber-500/30 bg-amber-500/10 p-6 text-center" role="alert">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">Web Crypto API Unavailable</p>
        <p className="text-sm text-[var(--text-secondary)]">This demo requires the Web Crypto API. Please use a modern browser (Chrome 37+, Firefox 34+, Safari 11+, Edge 12+).</p>
      </div>
    );
  }

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          Interactive Demo
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">RSA-2048 key pair — public encrypt, private decrypt</p>
      </div>

      {/* Step 1: Generate keys */}
      <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
            Step 1 — Generate Key Pair
          </span>
          {genStatus === "done" && <span className="font-mono text-xs text-green-400">✓ Ready</span>}
        </div>
        <button
          onClick={generateKeys}
          disabled={genStatus === "loading"}
          data-testid="rsa-generate-btn"
          aria-label="Generate RSA-2048 key pair"
          className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
          style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
        >
          {genStatus === "loading" ? "Generating 2048-bit keys…" : "⚙ Generate RSA-2048 Key Pair"}
        </button>
        {keyPair && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] space-y-1">
            <p className="text-[var(--text-muted)]">Public key (SPKI/base64):</p>
            <p className="break-all" style={{ color: era.color }}>{keyPair.publicKeyBase64.slice(0, 64)}…</p>
            <p className="text-[var(--text-muted)] mt-1">Private key (PKCS8/base64):</p>
            <p className="break-all text-[var(--text-muted)]">{keyPair.privateKeyBase64.slice(0, 48)}… [hidden]</p>
          </motion.div>
        )}
      </div>

      {/* Step 2: Encrypt */}
      <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          Step 2 — Encrypt with Public Key
        </span>
        <InteractiveInput
          label="Message (max ~190 bytes)"
          value={message}
          onChange={(e) => { setMessage(e.target.value); setCiphertext(""); setDecrypted(""); }}
          placeholder="Enter short message..."
          accentColor={era.color}
          data-testid="rsa-message"
        />
        <button
          onClick={encrypt}
          disabled={!keyPair || encStatus === "loading" || !message.trim()}
          data-testid="rsa-encrypt-btn"
          aria-label="Encrypt with RSA public key"
          className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
          style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
        >
          {encStatus === "loading" ? "Encrypting…" : !keyPair ? "Generate keys first" : "⚙ Encrypt"}
        </button>
        {ciphertext && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1">
            <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Ciphertext (base64)</p>
            <p className="font-mono text-[10px] break-all" data-testid="rsa-ciphertext" style={{ color: era.color }} role="status" aria-live="polite">{ciphertext.slice(0, 80)}…</p>
          </motion.div>
        )}
      </div>

      {/* Step 3: Decrypt */}
      <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          Step 3 — Decrypt with Private Key
        </span>
        <button
          onClick={decrypt}
          disabled={!keyPair || !ciphertext || decStatus === "loading"}
          data-testid="rsa-decrypt-btn"
          aria-label="Decrypt with RSA private key"
          className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
          style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
        >
          {decStatus === "loading" ? "Decrypting…" : !ciphertext ? "Encrypt first" : "⚙ Decrypt"}
        </button>
        {decrypted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-green-500/30 bg-green-500/10 p-3"
          >
            <p className="mb-1 font-mono text-xs text-green-400 uppercase tracking-widest">Decrypted</p>
            <p className="font-mono text-sm text-[var(--text-primary)]" data-testid="rsa-decrypted" role="status" aria-live="polite">{decrypted}</p>
          </motion.div>
        )}
        {decStatus === "error" && errorMsg && (
          <p role="alert" className="font-mono text-xs text-red-400">{errorMsg}</p>
        )}
      </div>

      {(genStatus === "error" || encStatus === "error") && errorMsg && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
