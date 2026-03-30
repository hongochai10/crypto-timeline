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

  it("maintains stable references across rerenders", () => {
    const { result, rerender } = renderHook(() => useBenchmarkWorker());
    const firstRun = result.current.run;
    const firstRunAll = result.current.runAll;

    rerender();

    expect(result.current.run).toBe(firstRun);
    expect(result.current.runAll).toBe(firstRunAll);
  });
});
