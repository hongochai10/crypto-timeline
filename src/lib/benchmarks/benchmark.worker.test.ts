import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BenchmarkWorkerMessage, BenchmarkWorkerResponse } from "./benchmark.worker";

// Mock the crypto-benchmark module
vi.mock("./crypto-benchmark", () => ({
  runBenchmark: vi.fn().mockResolvedValue({
    algorithm: "aes",
    opsPerSecond: 1000,
    avgTimeMs: 1,
    iterations: 100,
  }),
  runAllBenchmarks: vi.fn().mockImplementation(async (onProgress?: (r: unknown) => void) => {
    const result = { algorithm: "aes", opsPerSecond: 1000, avgTimeMs: 1, iterations: 100 };
    onProgress?.(result);
    return [result];
  }),
}));

describe("benchmark.worker", () => {
  let postedMessages: BenchmarkWorkerResponse[];
  let onmessageHandler: ((e: MessageEvent<BenchmarkWorkerMessage>) => void) | null;

  beforeEach(() => {
    postedMessages = [];
    onmessageHandler = null;

    // Mock self.postMessage and self.onmessage
    vi.stubGlobal("self", {
      postMessage: (msg: BenchmarkWorkerResponse) => {
        postedMessages.push(msg);
      },
      set onmessage(handler: ((e: MessageEvent<BenchmarkWorkerMessage>) => void) | null) {
        onmessageHandler = handler;
      },
      get onmessage() {
        return onmessageHandler;
      },
    });
  });

  async function loadWorkerAndDispatch(data: BenchmarkWorkerMessage) {
    // Reset module to re-execute worker script with mocked self
    vi.resetModules();
    await import("./benchmark.worker");
    // The import sets self.onmessage
    expect(onmessageHandler).toBeDefined();
    await onmessageHandler!({ data } as MessageEvent<BenchmarkWorkerMessage>);
  }

  it("handles 'run' message and posts result", async () => {
    await loadWorkerAndDispatch({ type: "run", algorithm: "aes" });
    expect(postedMessages).toHaveLength(1);
    expect(postedMessages[0].type).toBe("result");
    if (postedMessages[0].type === "result") {
      expect(postedMessages[0].result.algorithm).toBe("aes");
    }
  });

  it("handles 'runAll' message with progress and allDone", async () => {
    await loadWorkerAndDispatch({ type: "runAll" });
    // Should have progress + allDone
    expect(postedMessages.length).toBeGreaterThanOrEqual(2);
    expect(postedMessages[0].type).toBe("progress");
    expect(postedMessages[postedMessages.length - 1].type).toBe("allDone");
  });

  it("handles errors and posts error message", async () => {
    // Make runBenchmark throw
    const { runBenchmark } = await import("./crypto-benchmark");
    vi.mocked(runBenchmark).mockRejectedValueOnce(new Error("Benchmark crashed"));

    vi.resetModules();
    // Re-mock after resetModules
    vi.doMock("./crypto-benchmark", () => ({
      runBenchmark: vi.fn().mockRejectedValue(new Error("Benchmark crashed")),
      runAllBenchmarks: vi.fn(),
    }));

    postedMessages = [];
    onmessageHandler = null;
    await import("./benchmark.worker");
    expect(onmessageHandler).toBeDefined();
    await onmessageHandler!({ data: { type: "run", algorithm: "aes" } } as MessageEvent<BenchmarkWorkerMessage>);

    expect(postedMessages).toHaveLength(1);
    expect(postedMessages[0].type).toBe("error");
    if (postedMessages[0].type === "error") {
      expect(postedMessages[0].message).toBe("Benchmark crashed");
    }

    vi.doUnmock("./crypto-benchmark");
  });

  it("handles non-Error thrown values", async () => {
    vi.resetModules();
    vi.doMock("./crypto-benchmark", () => ({
      runBenchmark: vi.fn().mockRejectedValue("string error"),
      runAllBenchmarks: vi.fn(),
    }));

    postedMessages = [];
    onmessageHandler = null;
    await import("./benchmark.worker");
    await onmessageHandler!({ data: { type: "run", algorithm: "aes" } } as MessageEvent<BenchmarkWorkerMessage>);

    expect(postedMessages[0].type).toBe("error");
    if (postedMessages[0].type === "error") {
      expect(postedMessages[0].message).toBe("Benchmark failed");
    }

    vi.doUnmock("./crypto-benchmark");
  });
});
