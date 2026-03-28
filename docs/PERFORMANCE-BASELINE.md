# Performance Baseline — Crypto Timeline

Captured: 2026-03-29

## Build Output

| Route | Size (First Load JS) |
|-------|---------------------|
| `/` (page) | ~74.9 KB |
| Framework shared | ~85 KB |

## Web Vitals Targets (Google thresholds)

| Metric | Good | Needs Improvement | Poor |
|--------|------|--------------------|------|
| LCP | <= 2.5s | <= 4.0s | > 4.0s |
| CLS | <= 0.1 | <= 0.25 | > 0.25 |
| INP | <= 200ms | <= 500ms | > 500ms |
| FCP | <= 1.8s | <= 3.0s | > 3.0s |
| TTFB | <= 800ms | <= 1.8s | > 1.8s |

## Crypto Operation Benchmarks (dev mode, M-series Mac)

These are approximate — actual times depend on hardware and browser.

| Algorithm | Operation | Expected Range |
|-----------|-----------|---------------|
| Caesar | encrypt/decrypt | < 1ms |
| DES (simulated) | encrypt/decrypt | < 5ms |
| AES-256-GCM | key generation | 1-5ms |
| AES-256-GCM | encrypt | 1-3ms |
| AES-256-GCM | decrypt | 1-3ms |
| RSA-2048 | key generation | 100-500ms |
| RSA-2048 | encrypt | 1-5ms |
| RSA-2048 | decrypt | 5-20ms |
| ECC (P-256) | key generation | 1-10ms |
| ECC (P-256) | sign/verify | 1-10ms |
| PQC (simulated) | key generation | 1-5ms |

## Monitoring Setup

- **Web Vitals**: Captured via `web-vitals` library in `WebVitalsReporter` component. Logged to console in development.
- **Crypto Timings**: Use `measureCryptoOp()` from `src/lib/performance/crypto-perf.ts` to wrap crypto operations. Call `printCryptoTimingSummary()` in dev console.
- **Bundle Analysis**: Run `npm run analyze` to generate bundle visualization.
- **Build Stats**: Run `npm run build:stats` to save build output for tracking.
- **Error Boundary**: `ErrorBoundary` component wraps the app in `layout.tsx`, logging uncaught React errors to console.

## How to Use

### View Web Vitals in Development

Open the browser console — vitals are logged automatically with color-coded ratings.

### Measure Crypto Operations

```ts
import { measureCryptoOp } from "@/lib/performance/crypto-perf";

const key = await measureCryptoOp("AES-256", "keygen", () => aesGenerateKey());
const result = await measureCryptoOp("AES-256", "encrypt", () => aesEncrypt(text, key));
```

### Get Timing Summary

In the browser console:
```js
import("@/lib/performance/crypto-perf").then(m => m.printCryptoTimingSummary());
```

### Run Bundle Analysis

```bash
npm run analyze
```

This opens an interactive treemap showing bundle composition.
