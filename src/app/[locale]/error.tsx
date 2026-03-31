"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[locale error]", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary,#080b14)]">
      <div className="text-center">
        <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary,#e0e0e0)]">
          Something went wrong
        </h2>
        <button
          onClick={reset}
          className="rounded-lg border border-[var(--border-default,#333)] px-6 py-2 text-sm text-[var(--text-primary,#e0e0e0)] transition-colors hover:bg-[var(--bg-overlay,#ffffff10)]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
