export { initWebVitals, getVitalsLog, reportWebVitals } from "./web-vitals";
export type { WebVitalEntry, WebVitalName } from "./web-vitals";

export {
  measureCryptoOp,
  getCryptoTimings,
  clearCryptoTimings,
  printCryptoTimingSummary,
} from "./crypto-perf";
export type { CryptoTimingEntry } from "./crypto-perf";
