# Issues & Tasks — Crypto Timeline Project

> Cập nhật: 2026-03-31 (TEC-861)

## Đã hoàn thành (Recently Resolved)

| ID | Tiêu đề | Priority | Resolved By | Ticket |
|----|---------|----------|-------------|--------|
| I-01 | Tighten CSP: loại bỏ unsafe-inline/unsafe-eval | P0 | TEC-566 | ✅ Done |
| I-02 | Thay Math.random() bằng crypto.getRandomValues() trong PQC | P1 | TEC-567 | ✅ Done |
| I-03 | Fix empty catch block trong DES Demo | P1 | TEC-568 | ✅ Done |
| F-04 | Keyboard navigation cho timeline stations | P1 | TEC-569 | ✅ Done |
| F-01 | Interactive Quiz System hoàn chỉnh (5 câu/station) | P1 | TEC-570 | ✅ Done |
| I-10 | ESLint ignorePatterns thiếu test files | P1 | TEC-594 | ✅ Done |
| I-04 | Di chuyển era metadata sang i18n messages | P1 | TEC-596 | ✅ Done |
| I-09 | Thêm translation fallbacks cho missing keys | P2 | TEC-597 | ✅ Done |
| I-06 | Thêm unit tests cho LanguageSwitcher | P2 | — | ✅ Done |
| I-07 | Thêm aria attributes cho SVG icons | P2 | — | ✅ Done |
| I-13 | i18n demo placeholder strings (RSA, ECC, AES, DES) | P2 | f1134b3 | ✅ Done |
| I-05 | Refactor Demo components giảm duplication | P2 | 79fc622 | ✅ Done |
| F-02 | Progress tracking / completion badges | P2 | 6231978 | ✅ Done |
| I-14 | Upgrade Next.js 14→16 (9 npm audit vulns) | P0 | 0b22608 / TEC-666 | ✅ Done |
| I-15 | Add NODE_ENV guards cho console.log calls | P2 | 11d85d2 / TEC-667 | ✅ Done |
| I-08 | Move crypto benchmark sang Web Worker | P2 | bb4caa8 / TEC-668 | ✅ Done |
| F-03 | Dark/Light theme toggle | P2 | TEC-669 | ✅ Done |
| I-16 | Commit uncommitted changes | P0 | All committed (git clean) | ✅ Done |
| I-17 | Update E2E visual regression baselines | P0 | 97a0b3b + 12289fc | ✅ Done |
| I-19 | Light theme accessibility audit (contrast ratios) | P1 | 27c06ad | ✅ Done |
| I-22 | Light theme input contrast issues | P1 | 27c06ad + 62471a9 | ✅ Done |
| I-23 | VI locale navigation error | P1 | 0247fd8 | ✅ Done |
| I-24 | Remove unsafe-eval from CSP script-src | P0 | d754dd2 / TEC-764 | ✅ Done |
| I-25 | Coverage regression — investigate & fix | P1 | 6909afd (94.75% stmt / 81.48% branch) | ✅ Done |
| I-18 | Persist theme preference (localStorage + cross-tab sync) | P1 | fa558ee | ✅ Done |
| I-26 | Console.error NODE_ENV guard trong i18n/request.ts | P2 | Already implemented (line 48-50) | ✅ Done |
| I-27 | ShareDemoButton setTimeout cleanup on unmount | P2 | 22a4a24 | ✅ Done |

## Cải thiện (Improvements) — Open

| ID | Tiêu đề | Priority | Owner | Status | Dependency |
|----|---------|----------|-------|--------|------------|
| I-20 | CSP style-src unsafe-inline (Framer Motion) | P3 | Security Engineer | backlog | Framer Motion upstream |
| I-21 | Middleware deprecated → proxy convention (Next.js 16) | P2 | Senior Frontend Engineer | backlog | — |

## Tính năng mới (New Features) — Open

| ID | Tiêu đề | Priority | Owner | Status | Dependency |
|----|---------|----------|-------|--------|------------|
| F-05 | Analytics dashboard cho educators | P2 | Senior Frontend Engineer | backlog | F-02 |
| F-06 | Export/Print certificate khi hoàn thành | P2 | Senior Frontend Engineer | backlog | F-02 |
| F-07 | Share quiz results to social media | P3 | Senior Frontend Engineer | backlog | — |
| F-08 | Production Web Vitals analytics export | P2 | DevOps Engineer | backlog | — |
| F-09 | Additional i18n languages (ES, ZH) | P3 | Technical Writer | backlog | — |
| F-10 | Dependabot / automated vulnerability alerts | P2 | 7164a60 (config added) | ✅ Done |
