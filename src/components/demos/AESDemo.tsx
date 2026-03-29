"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import { aesKeyFromPassphrase, aesEncrypt, aesDecrypt, type AESKey } from "@/lib/crypto/aes";
import { getCryptoErrorMessage, isWebCryptoAvailable } from "@/lib/crypto/errors";
import InteractiveInput from "@/components/ui/InteractiveInput";

interface Props {
  era: Era;
}

export default function AESDemo({ era }: Props) {
  const t = useTranslations("demos.aes");
  const tc = useTranslations("common");

  const [passphrase, setPassphrase] = useState("my-secret-key");
  const [plaintext, setPlaintext] = useState("Hello, AES-256!");
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [keyInfo, setKeyInfo] = useState<{ base64: string; salt: string } | null>(null);
  const [activeKey, setActiveKey] = useState<AESKey | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEncrypt = async () => {
    setStatus("loading");
    setErrorMsg("");
    setCiphertext("");
    setDecrypted("");
    try {
      const { key, salt } = await aesKeyFromPassphrase(passphrase);
      const result = await aesEncrypt(plaintext, key);
      setKeyInfo({ base64: key.base64.slice(0, 32) + "…", salt: salt.slice(0, 16) + "…" });
      setActiveKey(key);
      setCiphertext(result.ciphertext);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(getCryptoErrorMessage(err, "aes-encrypt"));
    }
  };

  const handleDecrypt = async () => {
    if (!activeKey || !ciphertext) return;
    setStatus("loading");
    setErrorMsg("");
    setDecrypted("");
    try {
      const result = await aesDecrypt(ciphertext, activeKey);
      setDecrypted(result.plaintext);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(getCryptoErrorMessage(err, "aes-decrypt"));
    }
  };

  if (!isWebCryptoAvailable()) {
    return (
      <div className="demo-container rounded-lg border border-amber-500/30 bg-amber-500/10 p-6 text-center" role="alert">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">{tc("webCryptoUnavailable")}</p>
        <p className="text-sm text-[var(--text-secondary)]">{tc("webCryptoMessage")}</p>
      </div>
    );
  }

  return (
    <div className="demo-container flex flex-col gap-5">
      <div>
        <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
          {tc("interactiveDemo")}
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">{t("subtitle")}</p>
      </div>

      <div className="flex gap-2" role="group" aria-label="Encryption mode">
        {(["encrypt", "decrypt"] as const).map((m) => (
          <button
            key={m}
            data-testid={`aes-${m}-btn`}
            onClick={() => { setMode(m); setStatus("idle"); }}
            aria-pressed={mode === m}
            aria-label={m === "encrypt" ? tc("encryptMode") : tc("decryptMode")}
            className="rounded-lg px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all"
            style={
              mode === m
                ? { backgroundColor: era.color + "30", color: era.color, border: `1px solid ${era.color}` }
                : { backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border-default)" }
            }
          >
            {m === "encrypt" ? tc("encrypt") : tc("decrypt")}
          </button>
        ))}
      </div>

      <InteractiveInput
        label={t("passphrase")}
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
            label={t("plaintext")}
            value={plaintext}
            onChange={(e) => { setPlaintext(e.target.value); setCiphertext(""); setStatus("idle"); }}
            placeholder={t("enterMessage")}
            accentColor={era.color}
            data-testid="aes-plaintext"
          />
          <button
            onClick={handleEncrypt}
            disabled={status === "loading" || !plaintext.trim() || !passphrase.trim()}
            data-testid="aes-encrypt-run-btn"
            aria-label="Encrypt with AES-256"
            className="rounded-lg px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
            style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
          >
            {status === "loading" ? tc("encrypting") : t("encryptWithAES")}
          </button>
        </>
      ) : (
        <button
          onClick={handleDecrypt}
          disabled={status === "loading" || !ciphertext || !activeKey}
          data-testid="aes-decrypt-run-btn"
          aria-label="Decrypt with AES-256"
          className="rounded-lg px-4 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
          style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
        >
          {status === "loading" ? tc("decrypting") : !activeKey ? t("encryptFirst") : t("decryptBtn")}
        </button>
      )}

      {keyInfo && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-3 font-mono text-xs space-y-1"
          style={{ borderColor: era.color + "30", backgroundColor: era.color + "08" }}
        >
          <p className="text-[var(--text-muted)] uppercase tracking-widest mb-1">{t("derivedKey")}</p>
          <p style={{ color: era.color }}>Key: {keyInfo.base64}</p>
          <p style={{ color: era.color }}>Salt: {keyInfo.salt}</p>
          <p className="text-[var(--text-muted)]">{t("iterations")}</p>
        </motion.div>
      )}

      {ciphertext && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
          <label className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">{t("ciphertextBase64")}</label>
          <div className="code-display break-all text-xs" data-testid="aes-ciphertext" style={{ color: era.color }} role="status" aria-live="polite">
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
          <p className="mb-1 font-mono text-xs text-green-400 uppercase tracking-widest">{tc("decrypted")}</p>
          <p className="font-mono text-sm text-[var(--text-primary)]" data-testid="aes-decrypted" role="status" aria-live="polite">{decrypted}</p>
        </motion.div>
      )}

      {status === "error" && errorMsg && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
