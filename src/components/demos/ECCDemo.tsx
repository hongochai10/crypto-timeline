"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { type Era } from "@/lib/constants";
import { eccGenerateSigningKeyPair, eccSign, eccVerify, eccVsRsaComparison, type ECCKeyPair } from "@/lib/crypto/ecc";
import { getCryptoErrorMessage, isWebCryptoAvailable } from "@/lib/crypto/errors";
import InteractiveInput from "@/components/ui/InteractiveInput";
import ShareDemoButton from "@/components/ui/ShareDemoButton";
import { useShareableDemoParams } from "@/lib/useShareableDemo";

interface Props {
  era: Era;
}

export default function ECCDemo({ era }: Props) {
  const t = useTranslations("demos.ecc");
  const tc = useTranslations("common");
  const urlParams = useShareableDemoParams();
  const isTargeted = urlParams.station === "ecc";

  const [message, setMessage] = useState(isTargeted && urlParams.message ? urlParams.message : t("defaultMessage"));
  const [keyPair, setKeyPair] = useState<ECCKeyPair | null>(null);
  const [signature, setSignature] = useState("");
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [tampered, setTampered] = useState(false);
  const [genStatus, setGenStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [signStatus, setSignStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const comparison = eccVsRsaComparison();

  const generateKeys = async () => {
    setGenStatus("loading");
    setErrorMsg("");
    setSignature("");
    setVerifyResult(null);
    setTampered(false);
    try {
      const kp = await eccGenerateSigningKeyPair("P-256");
      setKeyPair(kp);
      setGenStatus("done");
    } catch (err) {
      setGenStatus("error");
      setErrorMsg(getCryptoErrorMessage(err, "ecc-keygen"));
    }
  };

  const sign = async () => {
    if (!keyPair) return;
    setSignStatus("loading");
    setErrorMsg("");
    setVerifyResult(null);
    setTampered(false);
    try {
      const result = await eccSign(message, keyPair.privateKey);
      setSignature(result.signature);
      setSignStatus("done");
    } catch (err) {
      setSignStatus("error");
      setErrorMsg(getCryptoErrorMessage(err, "ecc-sign"));
    }
  };

  const verify = async () => {
    if (!keyPair || !signature) return;
    setVerifyStatus("loading");
    setErrorMsg("");
    try {
      const msgToVerify = tampered ? message + "X" : message;
      const result = await eccVerify(msgToVerify, signature, keyPair.publicKey);
      setVerifyResult(result);
      setVerifyStatus("done");
    } catch (err) {
      setVerifyStatus("error");
      setErrorMsg(getCryptoErrorMessage(err, "ecc-verify"));
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
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="mb-1 font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>
            {tc("interactiveDemo")}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">{t("subtitle")}</p>
        </div>
        <ShareDemoButton stationId="ecc" params={{ message }} accentColor={era.color} />
      </div>

      {/* Key comparison table */}
      <div className="rounded-lg border p-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
        <p className="mb-2 font-mono text-[10px] tracking-widest uppercase text-[var(--text-muted)]">{t("keySizeComparison")}</p>
        <div className="space-y-1">
          {comparison.slice(0, 2).map((row) => (
            <div key={row.curve} className="flex items-center justify-between font-mono text-[10px]">
              <span style={{ color: era.color }}>{row.curve} ({row.eccBits}-bit)</span>
              <span className="text-[var(--text-muted)]">≡ RSA-{row.rsaEquivalentBits} · {row.ratio}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Generate keys */}
      <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>{t("step1")}</span>
          {genStatus === "done" && <span className="font-mono text-xs text-green-400">{tc("ready")}</span>}
        </div>
        <button
          onClick={generateKeys}
          disabled={genStatus === "loading"}
          data-testid="ecc-generate-btn"
          aria-label="Generate ECDSA P-256 key pair"
          className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
          style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
        >
          {genStatus === "loading" ? tc("generating") : t("generateECDSA")}
        </button>
        {keyPair?.publicKeyJwk && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] space-y-1">
            <p className="text-[var(--text-muted)]">{t("publicKeyX")}</p>
            <p className="break-all" style={{ color: era.color }}>{keyPair.publicKeyJwk.x?.slice(0, 44)}…</p>
            <p className="text-[var(--text-muted)]">Curve: {keyPair.curve} · Algorithm: ECDSA + SHA-256</p>
          </motion.div>
        )}
      </div>

      {/* Step 2: Sign */}
      <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>{t("step2")}</span>
        <InteractiveInput
          label={t("messageToSign")}
          value={message}
          onChange={(e) => { setMessage(e.target.value); setSignature(""); setVerifyResult(null); }}
          placeholder={t("enterMessage")}
          accentColor={era.color}
          data-testid="ecc-message"
        />
        <button
          onClick={sign}
          disabled={!keyPair || signStatus === "loading" || !message.trim()}
          data-testid="ecc-sign-btn"
          aria-label="Sign message with ECDSA private key"
          className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
          style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
        >
          {signStatus === "loading" ? tc("signing") : !keyPair ? t("generateKeysFirst") : t("signWithPrivateKey")}
        </button>
        {signature && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1">
            <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{t("signatureBase64")}</p>
            <p className="font-mono text-[10px] break-all" style={{ color: era.color }}>{signature.slice(0, 64)}…</p>
          </motion.div>
        )}
      </div>

      {/* Step 3: Verify */}
      {signature && (
        <div className="rounded-lg border p-4 flex flex-col gap-3" style={{ borderColor: era.color + "25", backgroundColor: era.color + "06" }}>
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: era.color }}>{t("step3")}</span>
          <label className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] cursor-pointer">
            <input
              type="checkbox"
              checked={tampered}
              onChange={(e) => { setTampered(e.target.checked); setVerifyResult(null); }}
              data-testid="ecc-tamper-checkbox"
              aria-label={t("simulateTampering")}
              className="rounded"
            />
            {t("simulateTampering")}
          </label>
          <button
            onClick={verify}
            disabled={verifyStatus === "loading"}
            data-testid="ecc-verify-btn"
            aria-label="Verify signature with ECDSA public key"
            className="rounded-lg px-4 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-40"
            style={{ backgroundColor: era.color + "20", color: era.color, border: `1px solid ${era.color}50` }}
          >
            {verifyStatus === "loading" ? tc("verifying") : t("verifyWithPublicKey")}
          </button>
          {verifyResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              aria-live="polite"
              className={`rounded-lg border p-3 ${verifyResult.valid ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
            >
              <p data-testid="ecc-verify-result" className={`font-mono text-xs uppercase tracking-widest mb-1 ${verifyResult.valid ? "text-green-400" : "text-red-400"}`}>
                {verifyResult.valid ? t("valid") : t("invalid")}
              </p>
              <p className="font-mono text-xs text-[var(--text-secondary)]">{verifyResult.message}</p>
            </motion.div>
          )}
        </div>
      )}

      {errorMsg && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  );
}
