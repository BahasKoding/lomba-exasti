# Backend Bug Report

Seluruh defect pada register ini berasal dari middleware atau API/backend enforcement. Status awal `Open` diberikan karena defect sudah confirmed dan belum ada evidence fix/retest.

## Bug Index

| Bug ID | Feature | Title | Severity | Priority | HTTP Status Code | Status | Related Test Case |
|---|---|---|---|---|---|---|---|
| BUG-BE-001 | Admin guard | Cookie palsu membuka admin | Critical | P0 | 307 tanpa cookie; 200 dengan forged cookie | Open | AUTH-004 |
| BUG-BE-002 | API authorization | API admin dapat diakses tanpa sesi | Critical | P0 | 200 | Open | AUTH-API-001, AUTH-API-002 |
| BUG-BE-003 | Login validation | JSON invalid menghasilkan 500 | Medium | P1 | 500 | Open | AUTH-API-003 |
| BUG-BE-004 | Create validation | Product invalid mengekspos exception | High | P0 | 500 | Open | API-PROD-009 |

## Detailed Bugs

| Bug ID | Module | Feature | Title | Environment | Version | Preconditions | Steps to Reproduce | Test Data | Expected Result | Actual Result | Severity | Priority | Evidence | Related Test Case | HTTP Status Code | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BUG-BE-001 | Auth | Admin guard | Cookie palsu membuka admin | Code review dan local dev | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Caller dapat mengirim cookie `sc_session` arbitrary | 1. Buat cookie acak.<br>2. Buka `/admin`. | `sc_session=qa-invalid-token` | Token divalidasi; akses ditolak | Tanpa cookie return 307 ke login; dengan cookie palsu return 200 dan halaman admin dilayani. | Critical | P0 | `middleware.ts`, `docs/qa/evidence/2026-09-04-runtime.md`, dan `docs/qa/evidence/ui-2026-09-04/bug-forged-cookie-admin.png` | AUTH-004 | 307 tanpa cookie; 200 dengan forged cookie | Open | Migrasi dari BUG-001. Comment dan login flow menunjukkan token dimaksudkan sebagai sesi. |
| BUG-BE-002 | Products / Ingest / Admin Review | API authorization | API admin dapat diakses tanpa sesi | Code review dan local dev; configured DB unknown | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Caller tanpa sesi | 1. Call endpoint admin/products tanpa cookie.<br>2. Call endpoint admin review tanpa cookie. | Request tanpa cookie; payload valid dan isolated untuk endpoint mutation | Endpoint menolak request | GET products sukses dengan 16 produk dan GET admin review sukses dengan 4 row. | Critical | P0 | Route handlers dan `docs/qa/evidence/2026-09-04-runtime.md` | AUTH-API-001, AUTH-API-002 | 200 | Open | Migrasi dari BUG-002. Dapat menyebabkan disclosure, modifikasi/hapus data, dan biaya AI. |
| BUG-BE-003 | Auth | Login validation | JSON invalid menghasilkan 500 | Local dev | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Server aktif | 1. POST `/api/auth/login`.<br>2. Kirim `Content-Type: application/json` dengan body `not-json`. | `not-json` | 400 dengan error JSON | Response 500 tanpa body; server log mencatat SyntaxError. | Medium | P1 | `docs/qa/evidence/2026-09-04-runtime.md` | AUTH-API-003 | 500 | Open | Migrasi dari BUG-003. Handler membaca `request.json()` di luar error guard. |
| BUG-BE-004 | Products | Create validation | Product invalid mengekspos exception | Local dev; configured DB unknown | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Server aktif | 1. POST `/api/products`.<br>2. Kirim product object tanpa field. | `{"products":[{}]}` | 400; DB tidak berubah | Response 500 dengan `Cannot read properties of undefined (reading 'toLowerCase')`. | High | P0 | `docs/qa/evidence/2026-09-04-runtime.md` | API-PROD-009 | 500 | Open | Migrasi dari BUG-004. Gagal saat slugify sebelum insert. |
