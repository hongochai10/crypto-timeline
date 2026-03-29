"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt, type RSAKeyPair } from "@/lib/crypto/rsa";
import { getCryptoErrorMessage } from "@/lib/crypto/errors";
import InteractiveInput from "@/components/ui/InteractiveInput";
import { useShareableDemoParams } from "@/lib/useShareableDemo";
import { DemoHeader, DemoActionButton, StepCard, ErrorAlert, WebCryptoGuard, OutputReveal } from "./shared";

interface Props {
  era: Era;
}

export default function RSADemo({ era }: Props) {
  const t = useTranslations("demos.rsa");
  const tc = useTranslations("common");
  const urlParams = useShareableDemoParams();
  const isTargeted = urlParams.station === "rsa";

  const [message, setMessage] = useState(isTargeted && urlParams.message ? urlParams.message : t("defaultMessage"));
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

  return (
    <WebCryptoGuard>
      <div className="demo-container flex flex-col gap-5">
        <DemoHeader era={era} subtitle={t("subtitle")} stationId="rsa" shareParams={{ message }} />

        {/* Step 1: Generate keys */}
        <StepCard era={era}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
              {t("step1")}
            </span>
            {genStatus === "done" && <span className="font-mono text-xs text-green-400">{tc("ready")}</span>}
          </div>
          <DemoActionButton
            era={era}
            onClick={generateKeys}
            disabled={genStatus === "loading"}
            testId="rsa-generate-btn"
            ariaLabel="Generate RSA-2048 key pair"
            label={genStatus === "loading" ? t("generating2048") : t("generateRSA")}
          />
          {keyPair && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] space-y-1">
              <p className="text-[var(--text-muted)]">{t("publicKeySPKI")}</p>
              <p className="break-all" style={{ color: era.color }}>{keyPair.publicKeyBase64.slice(0, 64)}…</p>
              <p className="text-[var(--text-muted)] mt-1">{t("privateKeyPKCS8")}</p>
              <p className="break-all text-[var(--text-muted)]">{keyPair.privateKeyBase64.slice(0, 48)}… {t("hidden")}</p>
            </motion.div>
          )}
        </StepCard>

        {/* Step 2: Encrypt */}
        <StepCard era={era}>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
            {t("step2")}
          </span>
          <InteractiveInput
            label={t("messageLabel")}
            value={message}
            onChange={(e) => { setMessage(e.target.value); setCiphertext(""); setDecrypted(""); }}
            placeholder={t("enterShortMessage")}
            accentColor={era.color}
            data-testid="rsa-message"
          />
          <DemoActionButton
            era={era}
            onClick={encrypt}
            disabled={!keyPair || encStatus === "loading" || !message.trim()}
            testId="rsa-encrypt-btn"
            ariaLabel="Encrypt with RSA public key"
            label={encStatus === "loading" ? tc("encrypting") : !keyPair ? t("generateKeysFirst") : t("encryptBtn")}
          />
          {ciphertext && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1">
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{t("ciphertextBase64")}</p>
              <p className="font-mono text-[10px] break-all" data-testid="rsa-ciphertext" style={{ color: era.color }} role="status" aria-live="polite">{ciphertext.slice(0, 80)}…</p>
            </motion.div>
          )}
        </StepCard>

        {/* Step 3: Decrypt */}
        <StepCard era={era}>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
            {t("step3")}
          </span>
          <DemoActionButton
            era={era}
            onClick={decrypt}
            disabled={!keyPair || !ciphertext || decStatus === "loading"}
            testId="rsa-decrypt-btn"
            ariaLabel="Decrypt with RSA private key"
            label={decStatus === "loading" ? tc("decrypting") : !ciphertext ? t("encryptFirst") : t("decryptBtn")}
          />
          {decrypted && (
            <OutputReveal className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
              <p className="mb-1 font-mono text-xs text-green-400 uppercase tracking-widest">{tc("decrypted")}</p>
              <p className="font-mono text-sm text-[var(--text-primary)]" data-testid="rsa-decrypted" role="status" aria-live="polite">{decrypted}</p>
            </OutputReveal>
          )}
          {decStatus === "error" && errorMsg && (
            <p role="alert" className="font-mono text-xs text-red-400">{errorMsg}</p>
          )}
        </StepCard>

        {(genStatus === "error" || encStatus === "error") && errorMsg && <ErrorAlert message={errorMsg} />}
      </div>
    </WebCryptoGuard>
  );
}
