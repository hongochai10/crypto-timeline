"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { type EraId, ERAS } from "@/lib/constants";

const STORAGE_KEY = "crypto-timeline-progress";

interface ProgressData {
  visitedStations: EraId[];
  completedQuizzes: EraId[];
}

const DEFAULT_PROGRESS: ProgressData = {
  visitedStations: [],
  completedQuizzes: [],
};

// ---------------------------------------------------------------------------
// Tiny external store so every consumer re-renders on the same write
// ---------------------------------------------------------------------------

let listeners: Array<() => void> = [];

function subscribe(cb: () => void) {
  listeners = [...listeners, cb];
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function emitChange() {
  for (const l of listeners) l();
}

function readProgress(): ProgressData {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    return {
      visitedStations: Array.isArray(parsed.visitedStations) ? parsed.visitedStations : [],
      completedQuizzes: Array.isArray(parsed.completedQuizzes) ? parsed.completedQuizzes : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function writeProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
  emitChange();
}

// Snapshot references for useSyncExternalStore
let snapshotCache: ProgressData | null = null;

function getSnapshot(): ProgressData {
  const fresh = readProgress();
  if (
    snapshotCache &&
    snapshotCache.visitedStations.length === fresh.visitedStations.length &&
    snapshotCache.completedQuizzes.length === fresh.completedQuizzes.length &&
    snapshotCache.visitedStations.every((id, i) => id === fresh.visitedStations[i]) &&
    snapshotCache.completedQuizzes.every((id, i) => id === fresh.completedQuizzes[i])
  ) {
    return snapshotCache;
  }
  snapshotCache = fresh;
  return fresh;
}

function getServerSnapshot(): ProgressData {
  return DEFAULT_PROGRESS;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProgressTracking() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Listen to cross-tab storage events
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) emitChange();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const markStationVisited = useCallback((eraId: EraId) => {
    const current = readProgress();
    if (current.visitedStations.includes(eraId)) return;
    writeProgress({
      ...current,
      visitedStations: [...current.visitedStations, eraId],
    });
  }, []);

  const markQuizCompleted = useCallback((eraId: EraId) => {
    const current = readProgress();
    if (current.completedQuizzes.includes(eraId)) return;
    writeProgress({
      ...current,
      completedQuizzes: [...current.completedQuizzes, eraId],
    });
  }, []);

  const isStationVisited = useCallback(
    (eraId: EraId) => progress.visitedStations.includes(eraId),
    [progress.visitedStations],
  );

  const isQuizCompleted = useCallback(
    (eraId: EraId) => progress.completedQuizzes.includes(eraId),
    [progress.completedQuizzes],
  );

  const totalStations = ERAS.length;
  const visitedCount = progress.visitedStations.length;
  const quizCompletedCount = progress.completedQuizzes.length;

  return {
    progress,
    markStationVisited,
    markQuizCompleted,
    isStationVisited,
    isQuizCompleted,
    visitedCount,
    quizCompletedCount,
    totalStations,
  };
}
