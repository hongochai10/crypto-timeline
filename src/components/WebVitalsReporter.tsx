"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/performance/web-vitals";

export default function WebVitalsReporter() {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null;
}
