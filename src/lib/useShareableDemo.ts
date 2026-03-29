"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { type EraId } from "./constants";

export interface ShareableDemoParams {
  station?: EraId;
  text?: string;
  shift?: number;
  key?: string;
  passphrase?: string;
  bit?: 0 | 1;
  message?: string;
}

const VALID_STATIONS = new Set<string>([
  "caesar",
  "des",
  "aes",
  "rsa",
  "ecc",
  "pqc",
]);

/** Read demo state from URL search params. */
export function useShareableDemoParams(): ShareableDemoParams {
  const searchParams = useSearchParams();

  const station = searchParams.get("station");
  const text = searchParams.get("text");
  const shift = searchParams.get("shift");
  const key = searchParams.get("key");
  const passphrase = searchParams.get("passphrase");
  const bit = searchParams.get("bit");
  const message = searchParams.get("message");

  return {
    station:
      station && VALID_STATIONS.has(station)
        ? (station as EraId)
        : undefined,
    text: text ?? undefined,
    shift: shift ? Math.min(25, Math.max(1, parseInt(shift, 10) || 3)) : undefined,
    key: key ?? undefined,
    passphrase: passphrase ?? undefined,
    bit: bit === "0" ? 0 : bit === "1" ? 1 : undefined,
    message: message ?? undefined,
  };
}

/** Build a shareable URL for a specific demo configuration. */
export function buildShareUrl(
  stationId: EraId,
  params: Record<string, string | number>,
): string {
  if (typeof window === "undefined") return "";

  const url = new URL(window.location.href);
  // Clear existing demo params
  ["station", "text", "shift", "key", "passphrase", "bit", "message"].forEach(
    (k) => url.searchParams.delete(k),
  );

  url.searchParams.set("station", stationId);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }

  // Remove hash, we'll scroll programmatically
  url.hash = "";
  return url.toString();
}

/** Hook that returns a copy-to-clipboard function for sharing demo state. */
export function useShareDemo() {
  const copyShareUrl = useCallback(
    async (stationId: EraId, params: Record<string, string | number>) => {
      const url = buildShareUrl(stationId, params);
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  return { copyShareUrl };
}
