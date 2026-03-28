import { describe, it, expect, beforeEach, vi } from "vitest";
import { reportWebVitals, getVitalsLog, initWebVitals } from "./web-vitals";
import type { Metric } from "web-vitals";

function makeMetric(overrides: Partial<Metric> = {}): Metric {
  return {
    name: "LCP",
    value: 1200,
    delta: 1200,
    id: "v1-123",
    rating: "good",
    navigationType: "navigate",
    entries: [],
    ...overrides,
  } as Metric;
}

// We need a fresh module for each test since vitalsLog is module-scoped.
// Reset by re-importing won't work easily, so we test carefully around accumulation.

beforeEach(() => {
  // Clear the internal log by accessing the array reference
  const log = getVitalsLog() as unknown[];
  log.length = 0;
  vi.restoreAllMocks();
});

// ─── getRating (tested via reportWebVitals output) ──────────────────────────

describe("reportWebVitals", () => {
  it("formats and stores a metric entry", () => {
    reportWebVitals(makeMetric({ name: "LCP", value: 1200, delta: 50 }));
    const log = getVitalsLog();
    expect(log).toHaveLength(1);
    expect(log[0]).toMatchObject({
      name: "LCP",
      value: 1200,
      delta: 50,
      id: "v1-123",
      navigationType: "navigate",
    });
  });

  it("rates LCP as good when value <= 2500", () => {
    reportWebVitals(makeMetric({ name: "LCP", value: 2500 }));
    expect(getVitalsLog()[0].rating).toBe("good");
  });

  it("rates LCP as needs-improvement when 2500 < value <= 4000", () => {
    reportWebVitals(makeMetric({ name: "LCP", value: 3000 }));
    expect(getVitalsLog()[0].rating).toBe("needs-improvement");
  });

  it("rates LCP as poor when value > 4000", () => {
    reportWebVitals(makeMetric({ name: "LCP", value: 5000 }));
    expect(getVitalsLog()[0].rating).toBe("poor");
  });

  it("rates CLS correctly across thresholds", () => {
    reportWebVitals(makeMetric({ name: "CLS", value: 0.05 }));
    expect(getVitalsLog()[0].rating).toBe("good");

    (getVitalsLog() as unknown[]).length = 0;
    reportWebVitals(makeMetric({ name: "CLS", value: 0.2 }));
    expect(getVitalsLog()[0].rating).toBe("needs-improvement");

    (getVitalsLog() as unknown[]).length = 0;
    reportWebVitals(makeMetric({ name: "CLS", value: 0.3 }));
    expect(getVitalsLog()[0].rating).toBe("poor");
  });

  it("rates TTFB correctly", () => {
    reportWebVitals(makeMetric({ name: "TTFB", value: 500 }));
    expect(getVitalsLog()[0].rating).toBe("good");

    (getVitalsLog() as unknown[]).length = 0;
    reportWebVitals(makeMetric({ name: "TTFB", value: 1000 }));
    expect(getVitalsLog()[0].rating).toBe("needs-improvement");

    (getVitalsLog() as unknown[]).length = 0;
    reportWebVitals(makeMetric({ name: "TTFB", value: 2000 }));
    expect(getVitalsLog()[0].rating).toBe("poor");
  });

  it("rates INP correctly", () => {
    reportWebVitals(makeMetric({ name: "INP", value: 100 }));
    expect(getVitalsLog()[0].rating).toBe("good");

    (getVitalsLog() as unknown[]).length = 0;
    reportWebVitals(makeMetric({ name: "INP", value: 300 }));
    expect(getVitalsLog()[0].rating).toBe("needs-improvement");

    (getVitalsLog() as unknown[]).length = 0;
    reportWebVitals(makeMetric({ name: "INP", value: 600 }));
    expect(getVitalsLog()[0].rating).toBe("poor");
  });

  it("rates FCP correctly", () => {
    reportWebVitals(makeMetric({ name: "FCP", value: 1500 }));
    expect(getVitalsLog()[0].rating).toBe("good");

    (getVitalsLog() as unknown[]).length = 0;
    reportWebVitals(makeMetric({ name: "FCP", value: 2500 }));
    expect(getVitalsLog()[0].rating).toBe("needs-improvement");

    (getVitalsLog() as unknown[]).length = 0;
    reportWebVitals(makeMetric({ name: "FCP", value: 3500 }));
    expect(getVitalsLog()[0].rating).toBe("poor");
  });

  it("rounds value and delta to two decimal places", () => {
    reportWebVitals(
      makeMetric({ name: "CLS", value: 0.12345, delta: 0.06789 })
    );
    const entry = getVitalsLog()[0];
    expect(entry.value).toBe(0.12);
    expect(entry.delta).toBe(0.07);
  });

  it("defaults navigationType to unknown when missing", () => {
    reportWebVitals(
      makeMetric({ navigationType: undefined as unknown as string })
    );
    expect(getVitalsLog()[0].navigationType).toBe("unknown");
  });

  it("logs to console in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    reportWebVitals(makeMetric({ name: "LCP", value: 1200 }));
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Web Vital] LCP: 1200"),
      expect.any(String)
    );

    process.env.NODE_ENV = originalEnv;
  });

  it("does not log in production mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    reportWebVitals(makeMetric({ name: "LCP", value: 1200 }));
    expect(logSpy).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it("accumulates multiple entries", () => {
    reportWebVitals(makeMetric({ name: "LCP", value: 1200, id: "a" }));
    reportWebVitals(makeMetric({ name: "CLS", value: 0.05, id: "b" }));
    expect(getVitalsLog()).toHaveLength(2);
  });
});

// ─── getVitalsLog ────────────────────────────────────────────────────────────

describe("getVitalsLog", () => {
  it("returns an empty array initially", () => {
    expect(getVitalsLog()).toEqual([]);
  });
});

// ─── initWebVitals ───────────────────────────────────────────────────────────

describe("initWebVitals", () => {
  it("registers callbacks for all five metrics", async () => {
    const onCLS = vi.fn();
    const onLCP = vi.fn();
    const onTTFB = vi.fn();
    const onINP = vi.fn();
    const onFCP = vi.fn();

    vi.doMock("web-vitals", () => ({
      onCLS,
      onLCP,
      onTTFB,
      onINP,
      onFCP,
    }));

    // Re-import to pick up the mock
    const { initWebVitals: init } = await import("./web-vitals");
    await init();

    expect(onCLS).toHaveBeenCalledWith(expect.any(Function));
    expect(onLCP).toHaveBeenCalledWith(expect.any(Function));
    expect(onTTFB).toHaveBeenCalledWith(expect.any(Function));
    expect(onINP).toHaveBeenCalledWith(expect.any(Function));
    expect(onFCP).toHaveBeenCalledWith(expect.any(Function));

    vi.doUnmock("web-vitals");
  });
});
