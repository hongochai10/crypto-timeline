"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { type EraId } from "@/lib/constants";
import { useShareDemo } from "@/lib/useShareableDemo";

interface Props {
  stationId: EraId;
  params: Record<string, string | number>;
  accentColor: string;
}

export default function ShareDemoButton({ stationId, params, accentColor }: Props) {
  const t = useTranslations("common");
  const { copyShareUrl } = useShareDemo();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = useCallback(async () => {
    const ok = await copyShareUrl(stationId, params);
    if (ok) {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  }, [copyShareUrl, stationId, params]);

  return (
    <button
      onClick={handleClick}
      aria-label={t("shareThisDemo")}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase transition-all"
      style={{
        backgroundColor: copied ? accentColor + "25" : "transparent",
        color: copied ? accentColor : "var(--text-muted)",
        border: `1px solid ${copied ? accentColor + "60" : "var(--border-default)"}`,
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t("copied")}
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {t("shareThisDemo")}
        </>
      )}
    </button>
  );
}
