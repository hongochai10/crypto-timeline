# Development Plan — Crypto Timeline Project

> Cập nhật: 2026-03-29 (TEC-619)

## Tech Stack

- **Framework**: Next.js 14.2.35 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4.1
- **Animation**: Framer Motion 12.38.0
- **i18n**: next-intl 4.8.3 (EN + VI, 1236 keys/locale)
- **PWA**: Serwist 9.5.7
- **Testing**: Vitest 4.1.1 + Playwright 1.58.2 + axe-core
- **Deploy**: Vercel + GitHub Actions CI (8 jobs)

## Build Metrics (2026-03-29 — TEC-619)

| Metric | Value | Trend |
|--------|-------|-------|
| First Load JS | 164 KB (page) / 89.1 KB (shared) | Stable |
| Unit Tests | 380 pass / 0 fail | +6 tests từ TEC-594 |
| Test Files | 37/37 pass | +1 file mới |
| Lint | Clean | — |
| TypeScript | Zero errors (strict mode) | — |
| Static Pages | 6 (2 locales × 3 routes) | — |
| Coverage Threshold | 80% (lines/functions/branches/statements) | — |

## Milestones

### Phase 1 — Security & Stability (P0/P1) ✅ COMPLETE
- [x] CSP hardening — nonce-based, loại unsafe-inline/unsafe-eval (TEC-566)
- [x] Fix PQC Math.random() → crypto.getRandomValues() (TEC-567)
- [x] Fix empty catch blocks (TEC-568)
- [x] Keyboard navigation cho accessibility (TEC-569)
- [x] Interactive Quiz System — 5 câu/station (TEC-570)
- [x] Fix ESLint ignorePatterns cho test files (TEC-594)

### Phase 2 — Content Quality (P1/P2) 🔄 IN PROGRESS (80% complete)
- [x] i18n cho era metadata — constants.ts → messages (TEC-596)
- [x] Translation fallbacks cho missing keys (TEC-597)
- [x] Unit tests cho LanguageSwitcher (đã có 8 test cases)
- [x] SVG aria attributes cho ShareDemoButton + ECCAttack
- [ ] Commit & cleanup uncommitted changes (I-11)
- [ ] Update visual regression baselines cross-platform (I-12)

### Phase 3 — UX Polish (P2) ⏳ NEXT
- [ ] i18n demo placeholder strings — RSA, ECC, AES, DES (I-13)
- [ ] Refactor Demo components — reduce ~400-500 LOC duplication (I-05)
- [ ] Progress tracking / completion badges (F-02)
- [ ] Dark/Light theme toggle (F-03)

### Phase 4 — Advanced Features (P3)
- [ ] Web Worker cho crypto benchmarks (I-08)
- [ ] Analytics dashboard cho educators (F-05)
- [ ] Export/Print certificate (F-06)
- [ ] Share quiz results to social media (F-07)

## Ghi chú kỹ thuật

- Web Crypto API yêu cầu HTTPS context ở production (localhost OK cho dev)
- Lighthouse CI budgets: FCP <1800ms, LCP <2500ms, CLS <0.1
- Coverage threshold: 80% (lines/functions/branches/statements)
- Visual regression: 0.5% diff threshold across 3 browsers + 3 mobile
- CSP: nonce-based per-request via middleware.ts
- E2E: 6 browser projects (chromium, firefox, webkit, pixel 5, iphone 13, ipad 7)
- Console.logs trong production code đều được guard bởi NODE_ENV check
- No TODO/FIXME/HACK comments — codebase sạch
