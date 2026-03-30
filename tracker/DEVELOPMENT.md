# Development Plan — Crypto Timeline Project

> Cập nhật: 2026-03-30 (TEC-787)

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router) — upgraded from 14.2.35
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4.1
- **Animation**: Framer Motion 12.38.0
- **i18n**: next-intl 4.8.3 (EN + VI, 1256 keys/locale)
- **PWA**: Serwist 9.5.7
- **Testing**: Vitest 4.1.1 + Playwright 1.58.2 + axe-core
- **Deploy**: Vercel + GitHub Actions CI (8 jobs)

## Build Metrics (2026-03-30 — TEC-787)

| Metric | Value | Trend |
|--------|-------|-------|
| First Load JS | 164 KB (page) / 89.1 KB (shared) | Stable |
| Unit Tests | 415 pass / 0 fail | ↑ +19 tests |
| Test Files | 42/42 pass | ↑ +3 files |
| Lint | Clean | — |
| TypeScript | Zero errors (strict mode) | — |
| Statement Coverage | 94.75% | ↑ +6.29% (was 88.46%) |
| Branch Coverage | 81.48% | ↑ +9.63% (was 71.85%) |
| npm audit | ✅ 0 vulnerabilities | → Clean |
| Coverage Threshold | 80% (lines/functions/branches/statements) | ✅ All above |

## Milestones

### Phase 1 — Security & Stability (P0/P1) ✅ COMPLETE
- [x] CSP hardening — nonce-based, loại unsafe-inline/unsafe-eval (TEC-566)
- [x] Fix PQC Math.random() → crypto.getRandomValues() (TEC-567)
- [x] Fix empty catch blocks (TEC-568)
- [x] Keyboard navigation cho accessibility (TEC-569)
- [x] Interactive Quiz System — 5 câu/station (TEC-570)
- [x] Fix ESLint ignorePatterns cho test files (TEC-594)

### Phase 2 — Content Quality (P1/P2) ✅ COMPLETE
- [x] i18n cho era metadata — constants.ts → messages (TEC-596)
- [x] Translation fallbacks cho missing keys (TEC-597)
- [x] Unit tests cho LanguageSwitcher (đã có 8 test cases)
- [x] SVG aria attributes cho ShareDemoButton + ECCAttack
- [x] i18n demo placeholder strings — RSA, ECC, AES, DES (f1134b3)
- [x] Refactor Demo components — extract shared components (79fc622)
- [x] Progress tracking / completion badges (6231978, d0f52b5, 8757c17)

### Phase 3 — UX Polish & Security (P0/P2) ⏳ 90% COMPLETE
- [x] **Upgrade Next.js 14→16** — fix 9 npm audit vulns (0b22608 / TEC-666)
- [x] Add NODE_ENV guards cho console.log (11d85d2 / TEC-667)
- [x] Move benchmarks to Web Worker (bb4caa8 / TEC-668)
- [x] Dark/Light theme toggle (TEC-669)
- [x] Commit all uncommitted changes (I-16) ✅
- [x] Update E2E visual regression baselines (I-17) ✅ 97a0b3b + 12289fc
- [x] Light theme accessibility audit (I-19) ✅ 27c06ad
- [x] Fix light theme input contrast issues (I-22) ✅ 27c06ad + 62471a9
- [x] Fix VI locale navigation error (I-23) ✅ 0247fd8
- [x] **Remove unsafe-eval from CSP script-src (I-24)** ✅ d754dd2 / TEC-764
- [x] Investigate & fix coverage drop (I-25) ✅ 94.75% stmt / 81.48% branch
- [ ] Persist theme preference via localStorage (I-18) **P1**
- [ ] Migrate middleware → proxy convention (I-21) **P2**
- [ ] Console.error NODE_ENV guard in i18n/request.ts (I-26) **P2**
- [ ] ShareDemoButton setTimeout cleanup (I-27) **P2**

### Phase 4 — Advanced Features (P2/P3) ⏳ NEXT
- [ ] Production Web Vitals analytics export (F-08)
- [ ] Dependabot / automated vulnerability alerts (F-10)
- [ ] Analytics dashboard cho educators (F-05)
- [ ] Export/Print certificate (F-06)
- [ ] Share quiz results to social media (F-07)
- [ ] Additional i18n languages — ES, ZH (F-09)
- [ ] CSP style-src unsafe-inline hardening (I-20)

## Ghi chú kỹ thuật

- Web Crypto API yêu cầu HTTPS context ở production (localhost OK cho dev)
- Lighthouse CI budgets: FCP <1800ms, LCP <2500ms, CLS <0.1
- Coverage threshold: 80% (lines/functions/branches/statements)
- Visual regression: 0.5% diff threshold across 3 browsers + 3 mobile
- CSP: nonce-based per-request via middleware.ts
- E2E: 6 browser projects (chromium, firefox, webkit, pixel 5, iphone 13, ipad 7)
- Console.logs trong production code đều được guard bởi NODE_ENV check
- No TODO/FIXME/HACK comments — codebase sạch
- Benchmarks chạy off-thread via Web Worker (bb4caa8)
- Theme toggle: ThemeProvider + ThemeToggle components (cần persist localStorage — I-18)
