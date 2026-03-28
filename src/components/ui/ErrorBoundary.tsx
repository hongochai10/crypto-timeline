"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Station/era name for contextual error messaging */
  stationName?: string;
  /** Accent color for styling the fallback UI */
  accentColor?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { stationName, accentColor = "#ef4444" } = this.props;
    const errorMessage = getUserFriendlyMessage(this.state.error);

    return (
      <div
        className="flex flex-col items-center gap-4 rounded-xl border p-8 text-center"
        style={{
          borderColor: accentColor + "30",
          backgroundColor: accentColor + "08",
        }}
        role="alert"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
          style={{ backgroundColor: accentColor + "18", color: accentColor }}
        >
          ⚠
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: accentColor }}>
            {stationName ? `${stationName} — Error` : "Something went wrong"}
          </p>
          <p className="max-w-md text-sm text-[var(--text-secondary)]">{errorMessage}</p>
        </div>
        <button
          onClick={this.handleRetry}
          className="rounded-lg px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest transition-all hover:brightness-110"
          style={{
            backgroundColor: accentColor + "20",
            color: accentColor,
            border: `1px solid ${accentColor}50`,
          }}
        >
          ↻ Try Again
        </button>
      </div>
    );
  }
}

function getUserFriendlyMessage(error: Error | null): string {
  if (!error) return "An unexpected error occurred.";
  const msg = error.message.toLowerCase();

  if (msg.includes("crypto") || msg.includes("subtle")) {
    return "This browser doesn't fully support the Web Crypto API needed for this demo. Try using a modern browser like Chrome, Firefox, or Safari.";
  }
  if (msg.includes("key") || msg.includes("importkey") || msg.includes("exportkey")) {
    return "A cryptographic key operation failed. The key may be invalid or corrupted.";
  }
  if (msg.includes("encrypt")) {
    return "Encryption failed. The input may be too large or the key is invalid.";
  }
  if (msg.includes("decrypt")) {
    return "Decryption failed. The key may be wrong or the ciphertext was tampered with.";
  }
  return "An unexpected error occurred in this demo. Please try again.";
}
