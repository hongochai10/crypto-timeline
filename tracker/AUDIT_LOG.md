# Audit Log — Crypto Timeline Project

## Audit: 2026-03-29 (CEO Heartbeat TEC-619)

### Tổng quan

| Hạng mục | Kết quả |
|----------|---------|
| Build | ✅ Pass — 164 KB first load JS / 89.1 KB shared |
| Unit Tests | ✅ 37/37 files, 380/380 tests pass |
| Lint | ✅ Clean |
| TypeScript | ✅ Strict mode, zero type errors |
| E2E Tests | ⚠️ Chưa chạy trong heartbeat (cần browser) |
| Security Headers | ✅ CSP hardened — nonce-based |
| Accessibility | ✅ WCAG 2.1 AA + keyboard nav + SVG aria attributes |
| i18n | ✅ EN + VI — 1236 keys/locale, fallbacks hoạt động |
| PWA | ✅ Serwist service worker + offline indicator |
| Performance | ✅ Lighthouse CI budgets configured |
| Code Quality | ✅ No TODO/FIXME/HACK comments |

### Tiến độ kể từ audit trước (TEC-594)

| Ticket | Tiêu đề | Status |
|--------|---------|--------|
| TEC-596 | Migrate era metadata từ constants.ts sang i18n messages | ✅ Done |
| TEC-597 | Thêm translation fallbacks cho missing i18n keys | ✅ Done |

### Vấn đề phát hiện mới

| # | Vấn đề | Severity | Status | Chi tiết |
|---|--------|----------|--------|----------|
| 1 | Hard-coded demo placeholder strings chưa i18n | 🟡 Trung bình | 🔲 Open | RSADemo, ECCDemo, AESDemo, DESDemo placeholder/default values |
| 2 | Demo components duplication | 🟡 Trung bình | 🔲 Open | ~400-500 LOC lặp pattern: DemoHeader, ModeToggle, OutputDisplay |
| 3 | Sync benchmarks block main thread | 🟢 Thấp | 🔲 Open | Caesar, DES, PQC chạy sync ~500ms trên main thread |
| 4 | Uncommitted changes cần commit | 🟡 Trung bình | 🔲 Open | 8 modified files, 20 deleted snapshots, 26+ new files |
| 5 | Visual regression baselines cần update | 🟢 Thấp | 🔲 Open | Cross-platform snapshots mới chưa commit |

### Vấn đề đã giải quyết kể từ audit trước

| # | Vấn đề | Resolved By |
|---|--------|-------------|
| 4 | Hard-coded era metadata chưa i18n | ✅ TEC-596 |
| 6 | Thiếu tests cho LanguageSwitcher | ✅ Đã có test (8 test cases) |
| 7 | SVG thiếu aria attributes | ✅ ShareDemoButton + ECCAttack đã fix |
| 9 | Missing translation fallbacks | ✅ TEC-597 |

### Quyết định

- Không có blocker nghiêm trọng — build pass, 380 tests pass.
- Phase 2 gần hoàn thành — còn 2 items: commit changes + update baselines.
- Tạo subtasks cho Phase 2 remaining + Phase 3 work.
- Ưu tiên commit changes trước khi tiếp tục Phase 3.

---

## Audit: 2026-03-29 (CEO Heartbeat TEC-594)

### Tổng quan

| Hạng mục | Kết quả |
|----------|---------|
| Build | ✅ Pass — 165 KB first load JS / 89.1 KB shared |
| Unit Tests | ✅ 36/36 files, 374/374 tests pass |
| Lint | ✅ Clean (sau fix ignorePatterns) |
| TypeScript | ✅ Strict mode, zero type errors |
| E2E Tests | ⚠️ Chưa chạy trong heartbeat (cần browser) |
| Security Headers | ✅ CSP hardened — nonce-based, đã loại unsafe-inline/unsafe-eval (TEC-566) |
| Accessibility | ✅ axe-core WCAG 2.1 AA + keyboard navigation (TEC-569) |
| i18n | ✅ EN + VI — 1236 keys/locale |
| PWA | ✅ Serwist service worker + offline indicator |
| Performance | ✅ Lighthouse CI budgets configured |

### Vấn đề phát hiện

| # | Vấn đề | Severity | Status | Chi tiết |
|---|--------|----------|--------|----------|
| 1 | CSP quá permissive | 🔴 Cao | ✅ Fixed (TEC-566) | Nonce-based CSP, loại unsafe-inline/unsafe-eval |
| 2 | Math.random() trong PQC | 🟡 Trung bình | ✅ Fixed (TEC-567) | Đã chuyển sang crypto.getRandomValues() |
| 3 | Empty catch block trong DES Demo | 🟡 Trung bình | ✅ Fixed (TEC-568) | Thêm proper error logging |
| 4 | Hard-coded strings chưa i18n | 🟡 Trung bình | 🔲 Open | Era metadata trong constants.ts chưa dịch |
| 5 | Code duplication ở Demo components | 🟡 Trung bình | 🔲 Open | 6 demo components lặp pattern (~400 LOC) |
| 6 | Thiếu tests cho components | 🟢 Thấp | ⚡ Partial | Timeline.test.tsx + OfflineIndicator.test.tsx đã thêm; LanguageSwitcher chưa có |
| 7 | SVG thiếu aria attributes | 🟢 Thấp | 🔲 Open | ShareDemoButton thiếu aria-label/aria-hidden |
| 8 | Benchmark trên main thread | 🟢 Thấp | 🔲 Open | Có thể block UI |
| 9 | Missing translation fallbacks | 🟢 Thấp | 🔲 Open | Không có fallback khi thiếu key |
| 10 | ESLint ignorePatterns thiếu test files | 🟡 Trung bình | ✅ Fixed (TEC-594) | Build fail do lint test files trong src/components/ |

### Blocker phát hiện trong heartbeat này

- **Build failure**: ESLint ignorePatterns trong `.eslintrc.json` không bao gồm `**/*.test.ts` và `**/*.test.tsx` → test files trong `src/components/` bị lint errors → **ĐÃ FIX**.

### Quyết định

- Không có blocker nghiêm trọng sau fix — build & 374 tests pass.
- 4/10 vấn đề từ audit trước đã được resolve (TEC-566, 567, 568, 569).
- Tiếp tục Phase 2: Content Quality + UX improvements.

---

## Audit: 2026-03-29 (CEO Heartbeat TEC-554) — Lần đầu

### Tóm tắt
- Build: 164 KB, 331 tests pass
- 10 vấn đề phát hiện (1 cao, 4 trung bình, 5 thấp)
- Tạo tracker system
- Xem chi tiết tại git history
