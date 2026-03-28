import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  measureCryptoOp,
  getCryptoTimings,
  clearCryptoTimings,
  printCryptoTimingSummary,
} from "./crypto-perf";

beforeEach(() => {
  clearCryptoTimings();
  vi.restoreAllMocks();
});

// ─── getCryptoTimings / clearCryptoTimings ───────────────────────────────────

describe("getCryptoTimings", () => {
  it("returns an empty array when no ops have been measured", () => {
    expect(getCryptoTimings()).toEqual([]);
  });
});

describe("clearCryptoTimings", () => {
  it("empties the timing log", async () => {
    await measureCryptoOp("AES", "encrypt", async () => "ok");
    expect(getCryptoTimings().length).toBe(1);
    clearCryptoTimings();
    expect(getCryptoTimings()).toEqual([]);
  });
});

// ─── measureCryptoOp ─────────────────────────────────────────────────────────

describe("measureCryptoOp", () => {
  it("returns the result of the wrapped function", async () => {
    const result = await measureCryptoOp("RSA", "keygen", async () => 42);
    expect(result).toBe(42);
  });

  it("records a timing entry with correct fields", async () => {
    await measureCryptoOp("AES", "encrypt", async () => "cipher");

    const entries = getCryptoTimings();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      operation: "encrypt",
      algorithm: "AES",
    });
    expect(typeof entries[0].durationMs).toBe("number");
    expect(entries[0].durationMs).toBeGreaterThanOrEqual(0);
    expect(typeof entries[0].timestamp).toBe("number");
  });

  it("rounds durationMs to two decimal places", async () => {
    await measureCryptoOp("ECC", "sign", async () => null);
    const entry = getCryptoTimings()[0];
    // durationMs * 100 should be an integer (rounded)
    expect(Math.round(entry.durationMs * 100)).toBe(entry.durationMs * 100);
  });

  it("accumulates multiple entries", async () => {
    await measureCryptoOp("AES", "encrypt", async () => "a");
    await measureCryptoOp("RSA", "decrypt", async () => "b");
    expect(getCryptoTimings()).toHaveLength(2);
  });

  it("calls performance.mark and performance.measure", async () => {
    const markSpy = vi.spyOn(performance, "mark");
    const measureSpy = vi.spyOn(performance, "measure");
    const clearMarksSpy = vi.spyOn(performance, "clearMarks");

    await measureCryptoOp("DES", "encrypt", async () => "done");

    expect(markSpy).toHaveBeenCalledWith("crypto-DES-encrypt-start");
    expect(markSpy).toHaveBeenCalledWith("crypto-DES-encrypt-end");
    expect(measureSpy).toHaveBeenCalledWith(
      "DES:encrypt",
      "crypto-DES-encrypt-start",
      "crypto-DES-encrypt-end"
    );
    expect(clearMarksSpy).toHaveBeenCalledWith("crypto-DES-encrypt-start");
    expect(clearMarksSpy).toHaveBeenCalledWith("crypto-DES-encrypt-end");
  });

  it("logs to console in development mode", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await measureCryptoOp("AES", "encrypt", async () => "x");
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Crypto Perf] AES encrypt:"),
      "color: #8b5cf6"
    );

    process.env.NODE_ENV = originalEnv;
  });

  it("does not log in production mode", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await measureCryptoOp("AES", "encrypt", async () => "x");
    expect(logSpy).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it("propagates errors from the wrapped function", async () => {
    await expect(
      measureCryptoOp("AES", "fail", async () => {
        throw new Error("boom");
      })
    ).rejects.toThrow("boom");
  });
});

// ─── printCryptoTimingSummary ────────────────────────────────────────────────

describe("printCryptoTimingSummary", () => {
  it("prints a no-data message when the log is empty", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    printCryptoTimingSummary();
    expect(logSpy).toHaveBeenCalledWith(
      "[Crypto Perf] No timings recorded yet."
    );
  });

  it("prints grouped summary statistics", async () => {
    const groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const groupEndSpy = vi
      .spyOn(console, "groupEnd")
      .mockImplementation(() => {});

    await measureCryptoOp("AES", "encrypt", async () => "a");
    await measureCryptoOp("AES", "encrypt", async () => "b");
    await measureCryptoOp("RSA", "keygen", async () => "c");

    printCryptoTimingSummary();

    expect(groupSpy).toHaveBeenCalledWith("[Crypto Perf] Timing Summary");
    expect(groupEndSpy).toHaveBeenCalled();
    // Two groups: AES:encrypt and RSA:keygen
    // logSpy calls: 3 from measureCryptoOp (dev logs may/may not fire) + 2 from summary
    const summaryLines = logSpy.mock.calls.filter(
      (c) => typeof c[0] === "string" && c[0].includes("avg=")
    );
    expect(summaryLines).toHaveLength(2);
  });
});
