/**
 * Crypto Benchmark Engine — unit tests
 */
import { describe, test, expect } from "vitest";
import {
  runBenchmark,
  runAllBenchmarks,
  ALGORITHM_META,
  type AlgorithmId,
  type BenchmarkResult,
} from "./crypto-benchmark";

function validateResult(result: BenchmarkResult, algorithm: AlgorithmId) {
  expect(result.algorithm).toBe(algorithm);
  expect(result.label).toBeTruthy();
  expect(result.encryptOpsPerSec).toBeGreaterThan(0);
  expect(result.decryptOpsPerSec).toBeGreaterThan(0);
  expect(result.keyBits).toBeGreaterThan(0);
  expect(result.iterations).toBeGreaterThan(0);
  expect(result.durationMs).toBeGreaterThan(0);
}

describe("ALGORITHM_META", () => {
  test("contains all 6 algorithms", () => {
    const ids: AlgorithmId[] = ["caesar", "des", "aes", "rsa", "ecc", "pqc"];
    for (const id of ids) {
      expect(ALGORITHM_META[id]).toBeDefined();
      expect(ALGORITHM_META[id].label).toBeTruthy();
      expect(ALGORITHM_META[id].keyBits).toBeGreaterThan(0);
    }
  });
});

describe("runBenchmark", () => {
  test("benchmarks Caesar cipher", async () => {
    const result = await runBenchmark("caesar");
    validateResult(result, "caesar");
  }, 10_000);

  test("benchmarks DES", async () => {
    const result = await runBenchmark("des");
    validateResult(result, "des");
  }, 10_000);

  test("benchmarks AES-256", async () => {
    const result = await runBenchmark("aes");
    validateResult(result, "aes");
  }, 10_000);

  test("benchmarks RSA-2048", async () => {
    const result = await runBenchmark("rsa");
    validateResult(result, "rsa");
  }, 30_000);

  test("benchmarks ECC (ECDSA P-256)", async () => {
    const result = await runBenchmark("ecc");
    validateResult(result, "ecc");
  }, 10_000);

  test("benchmarks PQC (LWE)", async () => {
    const result = await runBenchmark("pqc");
    validateResult(result, "pqc");
  }, 10_000);
});

describe("runAllBenchmarks", () => {
  test("returns results for all 6 algorithms", async () => {
    const results = await runAllBenchmarks();
    expect(results).toHaveLength(6);
    const algos = results.map((r) => r.algorithm);
    expect(algos).toContain("caesar");
    expect(algos).toContain("des");
    expect(algos).toContain("aes");
    expect(algos).toContain("rsa");
    expect(algos).toContain("ecc");
    expect(algos).toContain("pqc");
  }, 60_000);

  test("calls onProgress callback for each result", async () => {
    const progressResults: BenchmarkResult[] = [];
    await runAllBenchmarks((result) => progressResults.push(result));
    expect(progressResults).toHaveLength(6);
  }, 60_000);
});
