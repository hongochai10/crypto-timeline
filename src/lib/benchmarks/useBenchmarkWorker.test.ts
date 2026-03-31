import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBenchmarkWorker } from "./useBenchmarkWorker";
import { runBenchmark, runAllBenchmarks } from "./crypto-benchmark";

// Mock crypto-benchmark for fallback path
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

// In jsdom, Worker is not defined, so createWorker() returns null
// and the hook falls back to main-thread execution.
describe("useBenchmarkWorker", () => {
  it("returns run and runAll callbacks", () => {
    const { result } = renderHook(() => useBenchmarkWorker());
    expect(result.current.run).toBeInstanceOf(Function);
    expect(result.current.runAll).toBeInstanceOf(Function);
  });

  it("run() falls back to runBenchmark on main thread", async () => {
    const { result } = renderHook(() => useBenchmarkWorker());

    let benchResult: unknown;
    await act(async () => {
      benchResult = await result.current.run("aes");
    });

    expect(runBenchmark).toHaveBeenCalledWith("aes");
    expect(benchResult).toEqual({
      algorithm: "aes",
      opsPerSecond: 1000,
      avgTimeMs: 1,
      iterations: 100,
    });
  });

  it("run() can be called with different algorithms", async () => {
    const { result } = renderHook(() => useBenchmarkWorker());

    await act(async () => {
      await result.current.run("rsa");
    });

    expect(runBenchmark).toHaveBeenCalledWith("rsa");
  });

  it("runAll() falls back to runAllBenchmarks on main thread", async () => {
    const { result } = renderHook(() => useBenchmarkWorker());

    const progressCalls: unknown[] = [];
    let allResults: unknown;
    await act(async () => {
      allResults = await result.current.runAll((r) => progressCalls.push(r));
    });

    expect(runAllBenchmarks).toHaveBeenCalled();
    expect(allResults).toEqual([
      { algorithm: "aes", opsPerSecond: 1000, avgTimeMs: 1, iterations: 100 },
    ]);
    expect(progressCalls).toHaveLength(1);
  });

  it("runAll() works without onProgress callback", async () => {
    const { result } = renderHook(() => useBenchmarkWorker());

    let allResults: unknown;
    await act(async () => {
      allResults = await result.current.runAll();
    });

    expect(allResults).toEqual([
      { algorithm: "aes", opsPerSecond: 1000, avgTimeMs: 1, iterations: 100 },
    ]);
  });

  describe("unexpected worker message type handling", () => {
    let listeners: Array<(e: unknown) => void>;
    let mockWorker: {
      addEventListener: ReturnType<typeof vi.fn>;
      removeEventListener: ReturnType<typeof vi.fn>;
      postMessage: ReturnType<typeof vi.fn>;
      terminate: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      listeners = [];
      mockWorker = {
        addEventListener: vi.fn((_event: string, fn: (e: unknown) => void) => {
          listeners.push(fn);
        }),
        removeEventListener: vi.fn(),
        postMessage: vi.fn(),
        terminate: vi.fn(),
      };
      vi.stubGlobal(
        "Worker",
        class MockWorker {
          addEventListener = mockWorker.addEventListener;
          removeEventListener = mockWorker.removeEventListener;
          postMessage = mockWorker.postMessage;
          terminate = mockWorker.terminate;
        }
      );
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("run() rejects on unexpected message type", async () => {
      const { result } = renderHook(() => useBenchmarkWorker());

      // Start run without awaiting — promise won't resolve until message arrives
      let runPromise!: Promise<unknown>;
      act(() => {
        runPromise = result.current.run("aes");
      });

      // Find the message handler registered by run()
      const handler = listeners[listeners.length - 1];

      // Simulate unexpected message
      act(() => {
        handler({ data: { type: "unexpected" } });
      });

      await expect(runPromise).rejects.toThrow("Unexpected worker message type: unexpected");
      expect(mockWorker.removeEventListener).toHaveBeenCalledWith("message", expect.any(Function));
    });

    it("runAll() rejects on unexpected message type", async () => {
      const { result } = renderHook(() => useBenchmarkWorker());

      let runAllPromise!: Promise<unknown>;
      act(() => {
        runAllPromise = result.current.runAll();
      });

      const handler = listeners[listeners.length - 1];

      act(() => {
        handler({ data: { type: "unknown" } });
      });

      await expect(runAllPromise).rejects.toThrow("Unexpected worker message type: unknown");
      expect(mockWorker.removeEventListener).toHaveBeenCalledWith("message", expect.any(Function));
    });
  });

  it("maintains stable references across rerenders", () => {
    const { result, rerender } = renderHook(() => useBenchmarkWorker());
    const firstRun = result.current.run;
    const firstRunAll = result.current.runAll;

    rerender();

    expect(result.current.run).toBe(firstRun);
    expect(result.current.runAll).toBe(firstRunAll);
  });
});
