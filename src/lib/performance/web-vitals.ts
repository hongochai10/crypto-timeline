import type { Metric } from "web-vitals";

export type WebVitalName = "CLS" | "LCP" | "TTFB" | "INP" | "FCP";

export interface WebVitalEntry {
  name: WebVitalName;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
}

const THRESHOLDS: Record<WebVitalName, [number, number]> = {
  CLS: [0.1, 0.25],
  LCP: [2500, 4000],
  TTFB: [800, 1800],
  INP: [200, 500],
  FCP: [1800, 3000],
};

function getRating(name: WebVitalName, value: number): "good" | "needs-improvement" | "poor" {
  const [good, poor] = THRESHOLDS[name] ?? [Infinity, Infinity];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

function formatMetric(metric: Metric): WebVitalEntry {
  return {
    name: metric.name as WebVitalName,
    value: Math.round(metric.value * 100) / 100,
    rating: getRating(metric.name as WebVitalName, metric.value),
    delta: Math.round(metric.delta * 100) / 100,
    id: metric.id,
    navigationType: metric.navigationType ?? "unknown",
  };
}

const vitalsLog: WebVitalEntry[] = [];

export function getVitalsLog(): readonly WebVitalEntry[] {
  return vitalsLog;
}

export function reportWebVitals(metric: Metric): void {
  const entry = formatMetric(metric);
  vitalsLog.push(entry);

  const style =
    entry.rating === "good"
      ? "color: #0cce6b"
      : entry.rating === "needs-improvement"
        ? "color: #ffa400"
        : "color: #ff4e42";

  if (process.env.NODE_ENV === "development") {
    console.log(
      `%c[Web Vital] ${entry.name}: ${entry.value} (${entry.rating})`,
      style
    );
  }
}

export async function initWebVitals(): Promise<void> {
  const { onCLS, onLCP, onTTFB, onINP, onFCP } = await import("web-vitals");
  onCLS(reportWebVitals);
  onLCP(reportWebVitals);
  onTTFB(reportWebVitals);
  onINP(reportWebVitals);
  onFCP(reportWebVitals);
}
