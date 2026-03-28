"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      "[ErrorBoundary] Uncaught error:",
      error.message,
      "\nComponent stack:",
      errorInfo.componentStack
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-red-500/30 bg-red-950/20 p-6">
            <div className="text-center">
              <h2 className="mb-2 text-lg font-semibold text-red-400">
                Something went wrong
              </h2>
              <p className="text-sm text-red-300/70">
                {this.state.error?.message ?? "An unexpected error occurred."}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="mt-4 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
