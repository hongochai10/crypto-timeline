/**
 * Crypto Benchmark Engine
 * Measures encryption/decryption operations per second for each algorithm.
 * Uses performance.now() for accurate timing. Runs on user click only.
 */

import { caesarEncrypt, caesarDecrypt } from "@/lib/crypto/caesar";
import { desEncrypt, desDecrypt } from "@/lib/crypto/des";
import {
  aesGenerateKey,
  aesEncrypt,
  aesDecrypt,
  type AESKey,
} from "@/lib/crypto/aes";
import {
  rsaGenerateKeyPair,
  rsaEncrypt,
  rsaDecrypt,
} from "@/lib/crypto/rsa";
import {
  eccGenerateSigningKeyPair,
  eccSign,
  eccVerify,
} from "@/lib/crypto/ecc";
import {
  pqcGenerateKeyPair,
  pqcEncryptBit,
  pqcDecryptBit,
} from "@/lib/crypto/pqc";

// ─── Types ──────────────────────────────────────────────────────────────────

export type AlgorithmId = "caesar" | "des" | "aes" | "rsa" | "ecc" | "pqc";

export interface BenchmarkResult {
  algorithm: AlgorithmId;
  label: string;
  encryptOpsPerSec: number;
  decryptOpsPerSec: number;
  keyBits: number;
  iterations: number;
  durationMs: number;
}

export interface BenchmarkProgress {
  algorithm: AlgorithmId;
  phase: "keygen" | "encrypt" | "decrypt";
  percent: number;
}

// ─── Configuration ──────────────────────────────────────────────────────────

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog!";
const TARGET_DURATION_MS = 500; // Run each phase for ~500ms

// ─── Helpers ────────────────────────────────────────────────────────────────

function measureSync(fn: () => void, targetMs: number): { ops: number; durationMs: number } {
  let ops = 0;
  const start = performance.now();
  while (performance.now() - start < targetMs) {
    fn();
    ops++;
  }
  const durationMs = performance.now() - start;
  return { ops, durationMs };
}

async function measureAsync(
  fn: () => Promise<void>,
  targetMs: number
): Promise<{ ops: number; durationMs: number }> {
  let ops = 0;
  const start = performance.now();
  while (performance.now() - start < targetMs) {
    await fn();
    ops++;
  }
  const durationMs = performance.now() - start;
  return { ops, durationMs };
}

function opsPerSec(ops: number, durationMs: number): number {
  return Math.round((ops / durationMs) * 1000);
}

// ─── Per-algorithm benchmarks ───────────────────────────────────────────────

async function benchmarkCaesar(): Promise<BenchmarkResult> {
  const shift = 13;
  const enc = measureSync(() => caesarEncrypt(SAMPLE_TEXT, shift), TARGET_DURATION_MS);
  const encrypted = caesarEncrypt(SAMPLE_TEXT, shift).output;
  const dec = measureSync(() => caesarDecrypt(encrypted, shift), TARGET_DURATION_MS);

  return {
    algorithm: "caesar",
    label: "Caesar (shift-13)",
    encryptOpsPerSec: opsPerSec(enc.ops, enc.durationMs),
    decryptOpsPerSec: opsPerSec(dec.ops, dec.durationMs),
    keyBits: 5, // log2(25) ≈ 4.6
    iterations: enc.ops + dec.ops,
    durationMs: enc.durationMs + dec.durationMs,
  };
}

async function benchmarkDES(): Promise<BenchmarkResult> {
  const key = "secret!8";
  const enc = measureSync(() => desEncrypt(SAMPLE_TEXT, key), TARGET_DURATION_MS);
  const encrypted = desEncrypt(SAMPLE_TEXT, key).hex;
  const dec = measureSync(() => desDecrypt(encrypted, key), TARGET_DURATION_MS);

  return {
    algorithm: "des",
    label: "DES (56-bit)",
    encryptOpsPerSec: opsPerSec(enc.ops, enc.durationMs),
    decryptOpsPerSec: opsPerSec(dec.ops, dec.durationMs),
    keyBits: 56,
    iterations: enc.ops + dec.ops,
    durationMs: enc.durationMs + dec.durationMs,
  };
}

async function benchmarkAES(): Promise<BenchmarkResult> {
  const key: AESKey = await aesGenerateKey();
  const enc = await measureAsync(() => aesEncrypt(SAMPLE_TEXT, key).then(() => {}), TARGET_DURATION_MS);
  const encrypted = await aesEncrypt(SAMPLE_TEXT, key);
  const dec = await measureAsync(
    () => aesDecrypt(encrypted.ciphertext, key).then(() => {}),
    TARGET_DURATION_MS
  );

  return {
    algorithm: "aes",
    label: "AES-256-GCM",
    encryptOpsPerSec: opsPerSec(enc.ops, enc.durationMs),
    decryptOpsPerSec: opsPerSec(dec.ops, dec.durationMs),
    keyBits: 256,
    iterations: enc.ops + dec.ops,
    durationMs: enc.durationMs + dec.durationMs,
  };
}

async function benchmarkRSA(): Promise<BenchmarkResult> {
  const keyPair = await rsaGenerateKeyPair(2048);
  const shortText = SAMPLE_TEXT.slice(0, 100); // RSA-OAEP has size limits
  const enc = await measureAsync(
    () => rsaEncrypt(shortText, keyPair.publicKey).then(() => {}),
    TARGET_DURATION_MS
  );
  const encrypted = await rsaEncrypt(shortText, keyPair.publicKey);
  const dec = await measureAsync(
    () => rsaDecrypt(encrypted.ciphertext, keyPair.privateKey).then(() => {}),
    TARGET_DURATION_MS
  );

  return {
    algorithm: "rsa",
    label: "RSA-2048-OAEP",
    encryptOpsPerSec: opsPerSec(enc.ops, enc.durationMs),
    decryptOpsPerSec: opsPerSec(dec.ops, dec.durationMs),
    keyBits: 2048,
    iterations: enc.ops + dec.ops,
    durationMs: enc.durationMs + dec.durationMs,
  };
}

async function benchmarkECC(): Promise<BenchmarkResult> {
  const keyPair = await eccGenerateSigningKeyPair("P-256");
  const enc = await measureAsync(
    () => eccSign(SAMPLE_TEXT, keyPair.privateKey).then(() => {}),
    TARGET_DURATION_MS
  );
  const signed = await eccSign(SAMPLE_TEXT, keyPair.privateKey);
  const dec = await measureAsync(
    () => eccVerify(SAMPLE_TEXT, signed.signature, keyPair.publicKey).then(() => {}),
    TARGET_DURATION_MS
  );

  return {
    algorithm: "ecc",
    label: "ECDSA P-256",
    encryptOpsPerSec: opsPerSec(enc.ops, enc.durationMs),
    decryptOpsPerSec: opsPerSec(dec.ops, dec.durationMs),
    keyBits: 256,
    iterations: enc.ops + dec.ops,
    durationMs: enc.durationMs + dec.durationMs,
  };
}

async function benchmarkPQC(): Promise<BenchmarkResult> {
  const keyPair = pqcGenerateKeyPair();
  const enc = measureSync(() => pqcEncryptBit(1, keyPair.publicKey), TARGET_DURATION_MS);
  const encrypted = pqcEncryptBit(1, keyPair.publicKey);
  const dec = measureSync(() => pqcDecryptBit(encrypted, keyPair.privateKey), TARGET_DURATION_MS);

  return {
    algorithm: "pqc",
    label: "LWE (toy, n=8)",
    encryptOpsPerSec: opsPerSec(enc.ops, enc.durationMs),
    decryptOpsPerSec: opsPerSec(dec.ops, dec.durationMs),
    keyBits: 256, // ML-KEM equivalent
    iterations: enc.ops + dec.ops,
    durationMs: enc.durationMs + dec.durationMs,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

const BENCHMARKS: Record<AlgorithmId, () => Promise<BenchmarkResult>> = {
  caesar: benchmarkCaesar,
  des: benchmarkDES,
  aes: benchmarkAES,
  rsa: benchmarkRSA,
  ecc: benchmarkECC,
  pqc: benchmarkPQC,
};

/**
 * Run benchmark for a single algorithm.
 * Runs on-demand only (user-triggered), never auto.
 */
export async function runBenchmark(algorithm: AlgorithmId): Promise<BenchmarkResult> {
  const fn = BENCHMARKS[algorithm];
  return fn();
}

/**
 * Run benchmarks for all algorithms sequentially.
 * Returns results as they complete via callback.
 */
export async function runAllBenchmarks(
  onProgress?: (result: BenchmarkResult) => void
): Promise<BenchmarkResult[]> {
  const algorithms: AlgorithmId[] = ["caesar", "des", "aes", "rsa", "ecc", "pqc"];
  const results: BenchmarkResult[] = [];

  for (const algo of algorithms) {
    const result = await runBenchmark(algo);
    results.push(result);
    onProgress?.(result);
  }

  return results;
}

/**
 * Algorithm metadata for display purposes.
 */
export const ALGORITHM_META: Record<AlgorithmId, { label: string; keyBits: number; era: string }> = {
  caesar: { label: "Caesar", keyBits: 5, era: "50 BC" },
  des: { label: "DES", keyBits: 56, era: "1977" },
  aes: { label: "AES-256", keyBits: 256, era: "2001" },
  rsa: { label: "RSA-2048", keyBits: 2048, era: "1977" },
  ecc: { label: "ECDSA P-256", keyBits: 256, era: "1985" },
  pqc: { label: "PQC (LWE)", keyBits: 256, era: "2024+" },
};
