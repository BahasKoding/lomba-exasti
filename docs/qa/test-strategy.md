# Test Strategy

## Scope awal

Prioritas risiko: kontrol akses admin/API, integritas publish lifecycle, biaya ingest AI, validasi product payload, fallback yang menyamarkan error, dan konsistensi cart/settings localStorage.

## Pendekatan

1. Code-aware mapping dan impact analysis.
2. API contract tests pada database test terisolasi; operasi create/update/delete memakai data berprefix unik.
3. Browser journey Playwright untuk public dan admin menggunakan credential environment, bukan file tracked.
4. Authentication dan authorization diuji terpisah pada UI dan API.
5. Gemini/upstream diuji dalam dua lapis: contract/stub deterministik untuk regression dan satu manual integration check yang dibatasi biaya.
6. Verifikasi DB dilakukan read-only atau terhadap row test yang dibuat suite sendiri; cleanup hanya pada ID suite dan hanya di environment yang disetujui.

## Quality gates yang diusulkan

- P0: login, protected route, protected API, ingest satu image, review/save parked, publish, tampil di katalog, add cart, logout.
- P1: seluruh validasi utama, status transition, delete, filter/sort/search, settings persistence, negative auth.
- P2: batch boundary 30/31, payload size, partial/rate-limit AI, Unicode/long input, repeated/concurrent request, responsive/accessibility.

## Environment dan data

`NEEDS CONFIRMATION`: URL environment QA, database test, akun admin test, izin call Gemini, nomor WhatsApp dummy, dan kebijakan cleanup. Jangan gunakan Turso production sampai semua ini dikonfirmasi.

## Entry/exit

Entry: app dapat start, test DB diketahui aman, credential tersedia via environment, baseline commit dicatat. Exit: P0 executed, defect P0/P1 ditriage, execution sheet terisi, gap tercatat, dan baseline diperbarui.

## Defect classification dan reporting

- Klasifikasikan berdasarkan root cause, bukan lokasi symptom pertama terlihat.
- Frontend defect wajib masuk `docs/qa/bug-report-fe.md` dengan prefix `BUG-FE-`.
- Backend/API/middleware/persistence defect wajib masuk `docs/qa/bug-report-be.md` dengan prefix `BUG-BE-`.
- Jangan membuat combined bug report. Jika satu E2E flow menemukan dua defect independen, buat satu bug per layer dan hubungkan melalui Notes/Related Test Case.
- Automation failure harus ditriage sebagai FE defect, BE defect, automation defect, environment issue, test-data issue, atau Needs Confirmation sebelum bug dibuat. Hanya FE/BE application defect yang masuk bug report.
