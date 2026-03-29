"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ERAS, type EraId } from "@/lib/constants";

const ERA_IDS = ERAS.map((e) => e.id);

interface UseKeyboardNavigationOptions {
  /** Called when the active station changes via keyboard */
  onStationChange?: (eraId: EraId, index: number) => void;
}

/**
 * Manages keyboard navigation between timeline stations.
 * - Arrow Up/Down to traverse stations
 * - Home/End to jump to first/last station
 * - Escape to blur the current station
 */
export function useKeyboardNavigation(options?: UseKeyboardNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const announcementRef = useRef<HTMLDivElement | null>(null);

  const navigateTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= ERA_IDS.length) return;

      const eraId = ERA_IDS[index];
      const stationEl = document.getElementById(eraId);
      if (!stationEl) return;

      setActiveIndex(index);

      // Scroll station into view
      stationEl.scrollIntoView({ behavior: "smooth", block: "start" });

      // Focus the station section for screen readers
      stationEl.focus({ preventScroll: true });

      options?.onStationChange?.(eraId, index);
    },
    [options],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Only handle when no input/textarea/select is focused
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select") {
        return;
      }

      // Check if we are inside a station or the timeline
      const inTimeline = target.closest("[data-testid='timeline']");
      if (!inTimeline) return;

      let nextIndex = activeIndex;

      switch (e.key) {
        case "ArrowDown":
        case "j": // vim-style
          e.preventDefault();
          nextIndex = activeIndex < ERA_IDS.length - 1 ? activeIndex + 1 : activeIndex;
          break;
        case "ArrowUp":
        case "k": // vim-style
          e.preventDefault();
          nextIndex = activeIndex > 0 ? activeIndex - 1 : 0;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = ERA_IDS.length - 1;
          break;
        case "Escape":
          e.preventDefault();
          setActiveIndex(-1);
          (document.activeElement as HTMLElement)?.blur();
          return;
        default:
          return;
      }

      if (nextIndex !== activeIndex) {
        navigateTo(nextIndex);
      }
    },
    [activeIndex, navigateTo],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Sync activeIndex when user scrolls a station into view
  const updateActiveFromScroll = useCallback((eraId: EraId) => {
    const idx = ERA_IDS.indexOf(eraId);
    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, []);

  return {
    activeIndex,
    activeEraId: activeIndex >= 0 ? ERA_IDS[activeIndex] : null,
    navigateTo,
    updateActiveFromScroll,
    announcementRef,
  };
}
