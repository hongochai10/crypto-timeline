# Changelog — Crypto Timeline Project

## 2026-03-29 — CEO Audit #3 (TEC-619)

### Updated
- Tracker files cập nhật phản ánh TEC-596, TEC-597 đã hoàn thành
- LanguageSwitcher tests đã có (8 test cases)
- SVG aria attributes đã fix (ShareDemoButton + ECCAttack)
- Phase 2 nâng lên 80% complete
- Build metrics: 380 tests (+6), 37 files (+1)
- Ma trận đề xuất mới: 5 improvements + 5 features

### Identified
- Hard-coded demo placeholder strings cần i18n (RSA, ECC, AES, DES)
- Demo component duplication ~400-500 LOC
- Sync benchmarks block main thread ~500ms
- Uncommitted changes cần cleanup + commit

## 2026-03-29 — CEO Audit #2 (TEC-594)

### Fixed
- ESLint ignorePatterns không bao gồm `**/*.test.ts(x)` → build fail khi test files trong `src/components/` bị lint

### Updated
- Tracker files cập nhật phản ánh 6 issues đã resolve (TEC-566–570, TEC-594)
- Build metrics: 374 tests (+43), 36 files (+4), 165 KB first load
- Phase 1 (Security & Stability) → **COMPLETE**
- Phase 2 (Content Quality) → **IN PROGRESS**

## 2026-03-29 — Security & Quality Sprint (TEC-566–570)

### Fixed
- CSP hardened: nonce-based script-src, removed unsafe-inline/unsafe-eval (TEC-566)
- PQC: Math.random() → crypto.getRandomValues() (TEC-567)
- DESDemo: empty catch block → proper error logging (TEC-568)

### Added
- Keyboard navigation: Arrow Up/Down, Home/End, Escape, Vim j/k (TEC-569)
- Quiz expanded: 5 questions per station, multiple question types (TEC-570)
- Lighthouse performance optimization: Speed Index, TTI (TEC-544)

## 2026-03-29 — CEO Audit & Planning (TEC-554)

### Added
- Tracker system (`tracker/` directory) với 5 files
- Audit findings: 10 vấn đề (1 cao, 4 trung bình, 5 thấp)
- Development plan 4 phases

## Previous (from git log)

- `30f316f` — feat(TEC-529): shareable demo states via URL parameters
- `94e7e5c` — feat(TEC-527): real-time algorithm performance benchmarks
- `73def37` — feat(TEC-528): real-world breach stories to crypto stations
- `d10e836` — feat(TEC-525): internationalization (i18n) support — EN + VI
- `3ae29f4` — feat(TEC-508): visual regression testing with Playwright screenshots
- `3767fb1` — feat(TEC-506): automated accessibility audit (axe-core) to CI
- `5ea1961` — feat(TEC-509): PWA / offline support with service workers
- `35d7e6d` — feat(TEC-507): OG image and JSON-LD structured data for SEO
- `c4ead25` — feat(TEC-505): Lighthouse CI performance budget to GitHub Actions
