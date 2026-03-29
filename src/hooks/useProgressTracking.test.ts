import { renderHook, act } from "@testing-library/react";

const STORAGE_KEY = "crypto-timeline-progress";

// Provide a localStorage mock if jsdom doesn't supply one
function ensureLocalStorage() {
  if (typeof globalThis.localStorage !== "undefined" && typeof globalThis.localStorage.getItem === "function") return;
  const store: Record<string, string> = {};
  const mock: Storage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
  Object.defineProperty(globalThis, "localStorage", { value: mock, writable: true });
  Object.defineProperty(window, "localStorage", { value: mock, writable: true });
}

ensureLocalStorage();

let useProgressTracking: typeof import("./useProgressTracking").useProgressTracking;

describe("useProgressTracking", () => {
  beforeEach(async () => {
    // Clear storage
    localStorage.removeItem(STORAGE_KEY);

    // Reset module to clear snapshotCache and listeners
    vi.resetModules();
    const mod = await import("./useProgressTracking");
    useProgressTracking = mod.useProgressTracking;
  });

  it("returns default empty progress on first load", () => {
    const { result } = renderHook(() => useProgressTracking());
    expect(result.current.visitedCount).toBe(0);
    expect(result.current.quizCompletedCount).toBe(0);
    expect(result.current.totalStations).toBe(6);
  });

  it("marks a station as visited and persists to localStorage", () => {
    const { result } = renderHook(() => useProgressTracking());

    act(() => {
      result.current.markStationVisited("caesar");
    });

    expect(result.current.isStationVisited("caesar")).toBe(true);
    expect(result.current.visitedCount).toBe(1);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.visitedStations).toContain("caesar");
  });

  it("does not duplicate station visits", () => {
    const { result } = renderHook(() => useProgressTracking());

    act(() => {
      result.current.markStationVisited("des");
    });
    act(() => {
      result.current.markStationVisited("des");
    });

    expect(result.current.visitedCount).toBe(1);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.visitedStations.filter((id: string) => id === "des")).toHaveLength(1);
  });

  it("marks a quiz as completed and persists to localStorage", () => {
    const { result } = renderHook(() => useProgressTracking());

    act(() => {
      result.current.markQuizCompleted("aes");
    });

    expect(result.current.isQuizCompleted("aes")).toBe(true);
    expect(result.current.quizCompletedCount).toBe(1);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.completedQuizzes).toContain("aes");
  });

  it("does not duplicate quiz completions", () => {
    const { result } = renderHook(() => useProgressTracking());

    act(() => {
      result.current.markQuizCompleted("rsa");
    });
    act(() => {
      result.current.markQuizCompleted("rsa");
    });

    expect(result.current.quizCompletedCount).toBe(1);
  });

  it("tracks stations and quizzes independently", () => {
    const { result } = renderHook(() => useProgressTracking());

    act(() => {
      result.current.markStationVisited("caesar");
    });
    act(() => {
      result.current.markStationVisited("des");
    });
    act(() => {
      result.current.markQuizCompleted("caesar");
    });

    expect(result.current.visitedCount).toBe(2);
    expect(result.current.quizCompletedCount).toBe(1);
    expect(result.current.isStationVisited("caesar")).toBe(true);
    expect(result.current.isStationVisited("des")).toBe(true);
    expect(result.current.isQuizCompleted("caesar")).toBe(true);
    expect(result.current.isQuizCompleted("des")).toBe(false);
  });

  it("restores progress from existing localStorage data", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        visitedStations: ["caesar", "des", "aes"],
        completedQuizzes: ["caesar"],
      }),
    );

    const { result } = renderHook(() => useProgressTracking());
    expect(result.current.visitedCount).toBe(3);
    expect(result.current.quizCompletedCount).toBe(1);
    expect(result.current.isStationVisited("aes")).toBe(true);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json{{{");

    const { result } = renderHook(() => useProgressTracking());
    expect(result.current.visitedCount).toBe(0);
    expect(result.current.quizCompletedCount).toBe(0);
  });

  it("handles partial localStorage data gracefully", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ visitedStations: ["pqc"] }));

    const { result } = renderHook(() => useProgressTracking());
    expect(result.current.visitedCount).toBe(1);
    expect(result.current.quizCompletedCount).toBe(0);
  });
});
