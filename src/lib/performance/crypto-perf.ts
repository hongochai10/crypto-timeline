export interface CryptoTimingEntry {
  operation: string;
  algorithm: string;
  durationMs: number;
  timestamp: number;
}

const timingLog: CryptoTimingEntry[] = [];

export function getCryptoTimings(): readonly CryptoTimingEntry[] {
  return timingLog;
}

export function clearCryptoTimings(): void {
  timingLog.length = 0;
}

export async function measureCryptoOp<T>(
  algorithm: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const markName = `crypto-${algorithm}-${operation}`;
  const measureName = `${algorithm}:${operation}`;

  performance.mark(`${markName}-start`);
  const result = await fn();
  performance.mark(`${markName}-end`);

  const measure = performance.measure(measureName, `${markName}-start`, `${markName}-end`);
  const durationMs = Math.round(measure.duration * 100) / 100;

  const entry: CryptoTimingEntry = {
    operation,
    algorithm,
    durationMs,
    timestamp: Date.now(),
  };
  timingLog.push(entry);

  if (process.env.NODE_ENV === "development") {
    console.log(
      `%c[Crypto Perf] ${algorithm} ${operation}: ${durationMs}ms`,
      "color: #8b5cf6"
    );
  }

  performance.clearMarks(`${markName}-start`);
  performance.clearMarks(`${markName}-end`);

  return result;
}

export function printCryptoTimingSummary(): void {
  if (timingLog.length === 0) {
    console.log("[Crypto Perf] No timings recorded yet.");
    return;
  }

  const grouped = new Map<string, number[]>();
  for (const entry of timingLog) {
    const key = `${entry.algorithm}:${entry.operation}`;
    const times = grouped.get(key) ?? [];
    times.push(entry.durationMs);
    grouped.set(key, times);
  }

  console.group("[Crypto Perf] Timing Summary");
  for (const [key, times] of grouped) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    console.log(
      `  ${key}: avg=${avg.toFixed(2)}ms  min=${min.toFixed(2)}ms  max=${max.toFixed(2)}ms  (n=${times.length})`
    );
  }
  console.groupEnd();
}
