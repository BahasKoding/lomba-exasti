# Automation Strategy

## Tooling yang sesuai

Gunakan Playwright Test yang sudah ada untuk UI E2E dan API request context. Tidak perlu package baru. Konfigurasi sekarang menunjuk `qa/automation`, tetapi seluruh tree `qa/` sedang deleted di worktree; jangan mengembalikannya tanpa keputusan pemilik perubahan.

Setiap automated-test failure wajib diinvestigasi terlebih dahulu sebagai frontend defect, backend defect, automation defect, environment issue, test-data issue, atau Needs Confirmation. Hanya confirmed FE/BE application defect yang dicatat, masing-masing di `bug-report-fe.md` (`BUG-FE-`) atau `bug-report-be.md` (`BUG-BE-`).

## Struktur yang direkomendasikan

Setelah lokasi test dikonfirmasi, pertahankan satu struktur saja:

```text
tests/
  e2e/
  api/
  auth/
  fixtures/
  data/
  helpers/
```

Lalu ubah `playwright.config.ts` hanya dengan persetujuan, atau gunakan kembali `qa/automation` bila penghapusan saat ini memang akan dibatalkan oleh pemiliknya.

## Desain

- Fixture `publicPage`, `adminPage`, `apiRequest`, unique test IDs, dan auth state per actor.
- Credential dari `QA_ADMIN_EMAIL`/`QA_ADMIN_PASSWORD`; base URL dari `PLAYWRIGHT_BASE_URL`.
- Jangan membuat auth state dengan cookie palsu untuk happy path; gunakan login nyata. Cookie palsu hanya untuk negative security test.
- Gunakan role/name/test-id selector. Tambahkan test-id ke production UI hanya bila tim menyetujui perubahan terpisah.
- Intercept Gemini pada regression agar deterministik; jalankan live AI test terpisah dan serial dengan budget/counter.
- Aktifkan screenshot/trace/video failure yang sudah ada; simpan report sebagai artifact, bukan source.
- Uji response status/schema dan dampak DB, bukan hanya perubahan visual.

## P0 journey usulan

Login valid → akses `/admin` → ingest satu image fixture → review dan approve → save sebagai parked → publish dari directory → produk muncul di `/katalog` → buka detail → add cart → verifikasi total → logout → direct `/admin` ditolak → protected API tanpa sesi ditolak.

Journey ini belum bisa disebut Automated sampai file test dibuat dan environment aman dikonfirmasi.

## Kandidat berdasarkan exploratory execution 2026-09-04

Urutan implementasi regression yang direkomendasikan:

1. `AUTH-004`, `AUTH-API-001/002/004`: forged cookie dan seluruh protected API harus ditolak; regression BUG-BE-001/002.
2. `FE-CART-001/002/003`: add, quantity, empty persistence, dan repeated add; regression BUG-FE-001/003.
3. `ADMIN-REV-001`: reject-before-selected mapping; regression BUG-FE-002 tanpa DB mutation melalui request interception.
4. `ADMIN-UPLOAD-001`, `API-ING-004`: MIME/extension/base64 validation; regression BUG-FE-004 dan backend boundary.
5. `AUTH-API-003`, `API-PROD-009`: malformed payload selalu 4xx terstruktur; regression BUG-BE-003/004.
6. `FE-CAT-001/002`, `FE-DETAIL-002`: search/sort, explicit error/fallback policy, dan loading state detail.
7. P0 mutation journey hanya setelah QA DB, credential, cleanup policy, dan Gemini stub disetujui.

Framework/dependency baru tidak diperlukan: `@playwright/test`/`playwright` 1.62.1 sudah resolve. Perubahan yang dibutuhkan sebelum membuat suite permanen hanya keputusan lokasi test, lalu salah satu dari:

- pulihkan `qa/automation/` yang saat baseline sudah deleted; atau
- ubah `playwright.config.ts` agar menunjuk struktur `tests/` baru.

Browser bundle Playwright tidak tersedia pada cache lokal, tetapi installed Microsoft Edge terbukti dapat dipakai melalui `executablePath`/project channel. File produksi tidak perlu diubah untuk tahap automation ini.
