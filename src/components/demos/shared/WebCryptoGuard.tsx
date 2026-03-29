"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { isWebCryptoAvailable } from "@/lib/crypto/errors";

interface WebCryptoGuardProps {
  children: ReactNode;
}

export default function WebCryptoGuard({ children }: WebCryptoGuardProps) {
  const tc = useTranslations("common");

  if (!isWebCryptoAvailable()) {
    return (
      <div className="demo-container rounded-lg border border-amber-500/30 bg-amber-500/10 p-6 text-center" role="alert">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">{tc("webCryptoUnavailable")}</p>
        <p className="text-sm text-[var(--text-secondary)]">{tc("webCryptoMessage")}</p>
      </div>
    );
  }

  return <>{children}</>;
}
