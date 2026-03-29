/**
 * Web Worker for running crypto benchmarks off the main thread.
 * Communicates via postMessage with BenchmarkWorkerMessage / BenchmarkWorkerResponse types.
 */

import { runBenchmark, runAllBenchmarks, type AlgorithmId, type BenchmarkResult } from "./crypto-benchmark";

export type BenchmarkWorkerMessage =
  | { type: "run"; algorithm: AlgorithmId }
  | { type: "runAll" };

export type BenchmarkWorkerResponse =
  | { type: "result"; result: BenchmarkResult }
  | { type: "progress"; result: BenchmarkResult }
  | { type: "allDone"; results: BenchmarkResult[] }
  | { type: "error"; message: string };

self.onmessage = async (e: MessageEvent<BenchmarkWorkerMessage>) => {
  try {
    if (e.data.type === "run") {
      const result = await runBenchmark(e.data.algorithm);
      self.postMessage({ type: "result", result } satisfies BenchmarkWorkerResponse);
    } else if (e.data.type === "runAll") {
      const results = await runAllBenchmarks((result) => {
        self.postMessage({ type: "progress", result } satisfies BenchmarkWorkerResponse);
      });
      self.postMessage({ type: "allDone", results } satisfies BenchmarkWorkerResponse);
    }
  } catch (err) {
    self.postMessage({
      type: "error",
      message: err instanceof Error ? err.message : "Benchmark failed",
    } satisfies BenchmarkWorkerResponse);
  }
};
