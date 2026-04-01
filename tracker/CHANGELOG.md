# Changelog — Crypto Timeline Project

## 2026-04-01 — CEO Audit #12 (TEC-1009)

### Verified (5 fixes confirmed)
- I-30, I-34: Worker handler default cases — FIXED (2375f6f)
- I-31: StationQuiz setTimeout cleanup — FIXED (94ee7c5)
- I-32: BenchmarkComparison unmount guard — FIXED (94ee7c5)
- I-33: error.tsx NODE_ENV guard — FIXED (94ee7c5)

### Metrics
- Unit Tests: 420 pass / 42 files (↑ +2 tests)
- Coverage: 94.75% statement, 81.48% branch (stable)
- npm audit: ✅ 0 vulnerabilities
- Overall Score: 9.4/10 (stable)

### Tracker Updates
- ISSUES.md: Moved I-30→I-34 from Open to Resolved
- DEVELOPMENT.md: Phase 3 updated to 97% complete, build metrics refreshed
- CHANGELOG.md: Audit #12 entry

### Remaining Open (2 items — low priority)
- I-20 (P3): CSP style-src unsafe-inline (Framer Motion upstream)
- I-21 (P2): Middleware → proxy convention (Next.js 16 compat warning)

---

## 2026-03-31 — CEO Audit #11 (TEC-901)

### Identified (5 new issues)
- I-30: Worker `run()` handler missing default case → memory leak risk (P1)
- I-31: StationQuiz setTimeout not cleaned up on unmount (P1)
- I-32: BenchmarkComparison unmounted state updates after await (P2)
- I-33: error.tsx console.error without NODE_ENV guard (P2)
- I-34: Worker `runAll()` handler missing default case (P2)

### Created
- TEC-902: Fix Worker handler default case (I-30, I-34) → Senior Frontend Engineer
- TEC-903: Fix React cleanup issues (I-31, I-32, I-33) → Senior Frontend Engineer

### Metrics
- Unit Tests: 418 pass / 42 files (stable)
- Coverage: 94.75% statement, 81.48% branch (stable)
- npm audit: ✅ 0 vulnerabilities
- Overall Score: 9.5/10 (stable)

### Focus Areas
- Deep lifecycle analysis: useEffect cleanup, Promise leak, unmount guards
- No code changes this audit — pure audit + planning + delegation

---

## 2026-03-31 — CEO Audit #10 (TEC-888)

### Fixed
- I-28: `next lint` broken in Next.js 16 → migrated lint script to `eslint src/`
- I-29: ESLint `react-hooks/set-state-in-effect` error in ThemeProvider.tsx → added eslint-disable comment (valid SSR-safe init pattern)

### Metrics
- Unit Tests: 418 pass / 42 files (↑3 from 415)
- Coverage: 94.75% statement, 81.48% branch (stable)
- npm audit: ✅ 0 vulnerabilities
- Lint: ✅ Clean (migrated from broken `next lint` to `eslint src/`)
- Overall Score: 9.5/10 (↑ from 9.4)

### Deep Code Audit
- Full codebase review: performance, security, accessibility, code duplication
- No critical issues found — code quality excellent
- Minor improvements identified for future Phase 4 work

---

## 2026-03-31 — CEO Audit #9 (TEC-861)

### Completed Since Last Audit (3 issues resolved)
- I-18: Theme preference persisted via localStorage + cross-tab sync (fa558ee)
- I-26: Console.error NODE_ENV guard already implemented
- I-27: ShareDemoButton setTimeout cleanup on unmount (22a4a24)

### Still Open (2 items remaining in Phase 3)
- I-20: CSP style-src unsafe-inline — depends on Framer Motion upstream (P3)
- I-21: Middleware → proxy convention migration (P2)

### Metrics
- Unit Tests: 415 pass / 42 files (stable)
- Coverage: 94.75% statement, 81.48% branch (stable)
- npm audit: ✅ 0 vulnerabilities
- Overall Score: 9.4/10 (stable)

---

## 2026-03-30 — CEO Audit #8 (TEC-787)

### Completed Since Last Audit (8 issues resolved)
- I-16: All uncommitted changes committed (git status clean)
- I-17: E2E visual regression baselines updated (97a0b3b + 12289fc)
- I-19: Light theme accessibility audit passed (27c06ad)
- I-22: Light theme input contrast fixed (27c06ad + 62471a9)
- I-23: VI locale navigation error fixed (0247fd8)
- I-24: unsafe-eval removed from CSP script-src (d754dd2)
- I-25: Coverage regression recovered — 94.75% stmt / 81.48% branch (6909afd)
- Tests expanded: 415 tests / 42 files (↑19 tests, ↑3 files)

### Still Open (5 items remaining in Phase 3)
- I-18: Persist theme preference via localStorage (P1)
- I-21: Middleware → proxy convention migration (P2)
- I-26: Console.error NODE_ENV guard in i18n/request.ts (P2)
- I-27: ShareDemoButton setTimeout cleanup (P2)
- I-20: CSP style-src unsafe-inline — depends on Framer Motion upstream (P3)

### Metrics
- Unit Tests: 415 pass / 42 files (↑ from 396/39)
- Coverage: 94.75% statement, 81.48% branch (↑ from 88.46%/71.85%)
- npm audit: ✅ 0 vulnerabilities
- Overall Score: 9.4/10 (↑ from 9.0) — highest score to date

---

## 2026-03-30 — CEO Audit #7 (TEC-762)

### Completed Since Last Audit
- middleware.ts simplified: removed complex intl+CSP response merging logic (uncommitted)
- error.tsx + not-found.tsx added for locale error handling (untracked)
- Visual regression snapshots updated (3 files — uncommitted)

### Identified (New)
- I-24: `unsafe-eval` removed from CSP script-src — regression fixed (TEC-764) ✅
- I-25: Coverage dropped to 88.46% stmt / 71.85% branch (P1)
- I-26: Console.error missing NODE_ENV guard in i18n/request.ts (P2)
- I-27: ShareDemoButton setTimeout not cleaned up on unmount (P2)

### Still Open from Previous Audits
- I-16 through I-23: All remain open — no commits since TEC-716

### Metrics
- Unit Tests: 396 pass / 39 files (stable)
- Coverage: 88.46% statement, 71.85% branch (↓ from 96.82% / 85.32%)
- npm audit: ✅ 0 vulnerabilities
- Overall Score: 9.0/10 (unsafe-eval fixed, coverage regression still pending)

---

## 2026-03-30 — CEO Audit #6 (TEC-716)

### Completed Since Last Audit
- FOUC prevention script + ThemeProvider unit tests (5e101fe)
- Rich text (em/em2) cho station narrative paragraphs (6 stations — uncommitted)
- E2E visual regression spec refactor: removed CSP stripping workaround (uncommitted)
- Snapshot path template update + CI_USE_BUILD=1 script (uncommitted)

### Identified (New)
- I-21: Middleware deprecated warning (Next.js 16 "proxy" convention)
- I-22: Light theme input fields giữ nền tối → contrast issue
- I-23: VI locale navigation gây error page tạm thời

### QA Results (Browser Testing)
- ✅ Hero section: dark theme renders correctly
- ✅ Theme toggle: dark → light switching works
- ✅ Caesar station: interactive demo + attack demo functional
- ⚠️ Light theme: subtitle text contrast low on hero
- ⚠️ Light theme: input fields retain dark background
- ⚠️ VI locale: navigation from EN gây transient error

### Metrics
- Unit Tests: 396 pass / 39 files (↑7 tests, ↑1 file)
- Coverage: 96.82% statement, 85.32% branch (stable)
- npm audit: ✅ 0 vulnerabilities
- Overall Score: 9.1/10

---

## 2026-03-29 — CEO Audit #5 (TEC-672)

### Completed Since Last Audit
- Next.js 14→16 upgrade + ESLint 8→9 (0b22608 / TEC-666) — 9 npm audit vulns resolved
- NODE_ENV guards added to all console.log/error calls (11d85d2 / TEC-667)
- Crypto benchmarks moved to Web Worker (bb4caa8 / TEC-668) — off-main-thread
- Dark/Light theme toggle implemented (TEC-669) — ThemeProvider + ThemeToggle (uncommitted)

### Identified (New)
- I-16: Uncommitted changes need committing (theme, i18n, trackers)
- I-17: E2E visual regression baselines need update
- I-18: Theme preference not persisted via localStorage
- I-19: Light theme accessibility audit needed
- I-20: CSP style-src unsafe-inline (Framer Motion upstream)
- F-08: Production Web Vitals analytics export
- F-09: Additional i18n languages (ES, ZH)
- F-10: Dependabot / automated vulnerability alerts

### Metrics
- Unit Tests: 389 pass / 38 files (stable)
- Coverage: 96.82% statement, 85.32% branch
- npm audit: ✅ 0 vulnerabilities
- Overall Score: 9.1/10

### Milestones
- Phase 1 (Security & Stability): ✅ COMPLETE
- Phase 2 (Content Quality): ✅ COMPLETE
- Phase 3 (UX Polish & Security): ✅ COMPLETE (pending commit)
- Phase 4 (Advanced Features): ⏳ NEXT

## 2026-03-29 — CEO Audit #4 (TEC-646)

### Completed Since Last Audit
- Shared Demo components extracted (79fc622) — giảm ~400 LOC duplication
- i18n demo placeholder strings cho RSA, ECC, AES, DES (f1134b3)
- Progress tracking: station visits + quiz completion (6231978, d0f52b5, 8757c17)
- i18n translations + unit tests for progress tracking (8757c17)

### Identified
- npm audit: 9 vulnerabilities (8 high, 1 moderate) — Next.js 14 cần upgrade → TEC-666
- Console.log production guards missing (9 calls) → TEC-667
- Web Worker cho benchmarks chưa có → TEC-668
- Dark/Light theme toggle cần thêm → TEC-669

### Created
- TEC-666: Upgrade Next.js 14→16 (P0, assigned Senior Frontend Engineer)
- TEC-667: Add NODE_ENV guards (P2, assigned Senior Frontend Engineer)
- TEC-668: Move benchmarks to Web Worker (P2, assigned Senior Frontend Engineer)
- TEC-669: Dark/Light theme toggle (P2, assigned Senior Frontend Engineer)

### Metrics
- Unit Tests: 389 pass / 38 files (↑9 tests, ↑1 file từ TEC-619)
- Coverage: 96.82% statement, 85.32% branch
- Lint: Clean | TypeScript: Zero errors

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
