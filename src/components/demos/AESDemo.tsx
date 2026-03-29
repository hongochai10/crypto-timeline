"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { type Era } from "@/lib/constants";
import { aesKeyFromPassphrase, aesEncrypt, aesDecrypt, type AESKey } from "@/lib/crypto/aes";
import { getCryptoErrorMessage } from "@/lib/crypto/errors";
import InteractiveInput from "@/components/ui/InteractiveInput";
import { useShareableDemoParams } from "@/lib/useShareableDemo";
import { DemoHeader, ModeToggle, DemoActionButton, ErrorAlert, WebCryptoGuard, OutputReveal } from "./shared";

interface Props {
  era: Era;
}

export default function AESDemo({ era }: Props) {
  const t = useTranslations("demos.aes");
  const tc = useTranslations("common");
  const urlParams = useShareableDemoParams();
  const isTargeted = urlParams.station === "aes";

  const [passphrase, setPassphrase] = useState(isTargeted && urlParams.passphrase ? urlParams.passphrase : t("defaultPassphrase"));
  const [plaintext, setPlaintext] = useState(isTargeted && urlParams.text ? urlParams.text : t("defaultPlaintext"));
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

  return (
    <WebCryptoGuard>
      <div className="demo-container flex flex-col gap-5">
        <DemoHeader era={era} subtitle={t("subtitle")} stationId="aes" shareParams={{ text: plaintext, passphrase }} />

        <ModeToggle
          era={era}
          mode={mode}
          modes={["encrypt", "decrypt"]}
          onModeChange={(m) => { setMode(m as "encrypt" | "decrypt"); setStatus("idle"); }}
          testIdPrefix="aes"
        />

        <InteractiveInput
          label={t("passphrase")}
          value={passphrase}
          onChange={(e) => { setPassphrase(e.target.value); setCiphertext(""); setDecrypted(""); setActiveKey(null); setStatus("idle"); }}
          placeholder={t("defaultPassphrase")}
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
            <DemoActionButton
              era={era}
              onClick={handleEncrypt}
              disabled={status === "loading" || !plaintext.trim() || !passphrase.trim()}
              testId="aes-encrypt-run-btn"
              ariaLabel="Encrypt with AES-256"
              label={status === "loading" ? tc("encrypting") : t("encryptWithAES")}
            />
          </>
        ) : (
          <DemoActionButton
            era={era}
            onClick={handleDecrypt}
            disabled={status === "loading" || !ciphertext || !activeKey}
            testId="aes-decrypt-run-btn"
            ariaLabel="Decrypt with AES-256"
            label={status === "loading" ? tc("decrypting") : !activeKey ? t("encryptFirst") : t("decryptBtn")}
          />
        )}

        {keyInfo && (
          <OutputReveal className="rounded-lg border p-3 font-mono text-xs space-y-1" style={{ borderColor: era.color + "30", backgroundColor: era.color + "08" }}>
            <p className="text-[var(--text-muted)] uppercase tracking-widest mb-1">{t("derivedKey")}</p>
            <p style={{ color: era.color }}>Key: {keyInfo.base64}</p>
            <p style={{ color: era.color }}>Salt: {keyInfo.salt}</p>
            <p className="text-[var(--text-muted)]">{t("iterations")}</p>
          </OutputReveal>
        )}

        {ciphertext && (
          <OutputReveal className="flex flex-col gap-2">
            <label className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">{t("ciphertextBase64")}</label>
            <div className="code-display break-all text-xs" data-testid="aes-ciphertext" style={{ color: era.color }} role="status" aria-live="polite">
              {ciphertext.slice(0, 80)}…
            </div>
          </OutputReveal>
        )}

        {decrypted && (
          <OutputReveal className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
            <p className="mb-1 font-mono text-xs text-green-400 uppercase tracking-widest">{tc("decrypted")}</p>
            <p className="font-mono text-sm text-[var(--text-primary)]" data-testid="aes-decrypted" role="status" aria-live="polite">{decrypted}</p>
          </OutputReveal>
        )}

        {status === "error" && errorMsg && <ErrorAlert message={errorMsg} />}
      </div>
    </WebCryptoGuard>
  );
}
