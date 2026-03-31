import { useRef, useCallback, useEffect } from "react";
import type { BenchmarkWorkerResponse } from "./benchmark.worker";
import {
  runBenchmark,
  runAllBenchmarks,
  type AlgorithmId,
  type BenchmarkResult,
} from "./crypto-benchmark";

function createWorker(): Worker | null {
  if (typeof window === "undefined" || typeof Worker === "undefined") return null;
  try {
    return new Worker(new URL("./benchmark.worker.ts", import.meta.url));
  } catch {
    return null;
  }
}

/**
 * Hook that runs benchmarks in a Web Worker when available,
 * falling back to main thread otherwise.
 */
export function useBenchmarkWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = createWorker();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const run = useCallback(
    (algorithm: AlgorithmId): Promise<BenchmarkResult> => {
      const worker = workerRef.current;
      if (!worker) return runBenchmark(algorithm);

      return new Promise((resolve, reject) => {
        const handler = (e: MessageEvent<BenchmarkWorkerResponse>) => {
          worker.removeEventListener("message", handler);
          if (e.data.type === "result") resolve(e.data.result);
          else if (e.data.type === "error") reject(new Error(e.data.message));
          else reject(new Error(`Unexpected worker message type: ${(e.data as { type: string }).type}`));
        };
        worker.addEventListener("message", handler);
        worker.postMessage({ type: "run", algorithm });
      });
    },
    []
  );

  const runAll = useCallback(
    (onProgress?: (result: BenchmarkResult) => void): Promise<BenchmarkResult[]> => {
      const worker = workerRef.current;
      if (!worker) return runAllBenchmarks(onProgress);

      return new Promise((resolve, reject) => {
        const handler = (e: MessageEvent<BenchmarkWorkerResponse>) => {
          if (e.data.type === "progress") {
            onProgress?.(e.data.result);
          } else if (e.data.type === "allDone") {
            worker.removeEventListener("message", handler);
            resolve(e.data.results);
          } else if (e.data.type === "error") {
            worker.removeEventListener("message", handler);
            reject(new Error(e.data.message));
          } else {
            worker.removeEventListener("message", handler);
            reject(new Error(`Unexpected worker message type: ${(e.data as { type: string }).type}`));
          }
        };
        worker.addEventListener("message", handler);
        worker.postMessage({ type: "runAll" });
      });
    },
    []
  );

  return { run, runAll };
}
