# QA Findings — Needs Confirmation

Register ini mempertahankan temuan lama yang belum memenuhi syarat sebagai application bug. Item di sini tidak dihitung sebagai frontend/backend bug sampai expected behavior dikonfirmasi.

## CANDIDATE-004 — Slug produk tidak ada menampilkan produk lain

- Classification: Frontend behavior; Needs Confirmation.
- Module/Feature: Product detail / Not found.
- Severity/Priority: High / P1.
- Evidence: fallback key default selalu `urban-baseball-cap`; `docs/qa/evidence/ui-2026-09-04/candidate-invalid-slug-fallback.png`.
- Related Test Case: FE-DETAIL-001.
- Expected/Actual: 404/empty behavior `NEEDS CONFIRMATION`; kode dan runtime menampilkan produk default.

## CANDIDATE-006 — Detail menampilkan produk fallback lain selama loading

- Classification: Frontend behavior; Needs Confirmation.
- Module/Feature: Product detail / Loading state.
- Severity/Priority: Medium / P1.
- Evidence: Enam sample heading menghasilkan dua kali `URBAN BASEBALL CAP`, lalu empat kali `TOPI BASEBALL CORDUROY`; screenshot final `docs/qa/evidence/ui-2026-09-04/bug-card-detail-mismatch.png`.
- Related Test Case: FE-DETAIL-002.
- Expected/Actual: Final mapping benar; perlu keputusan UX apakah stale product content boleh terlihat selama fetch.

## CANDIDATE-007 — Catalog API 500 disamarkan dengan fallback product

- Classification: Frontend behavior; Needs Confirmation.
- Module/Feature: Catalog / Error handling.
- Severity/Priority: Medium / P1.
- Evidence: API diintercept 500; enam fallback card tampil tanpa pesan error; `docs/qa/evidence/ui-2026-09-04/candidate-catalog-api-fallback.png`.
- Related Test Case: FE-CAT-002.
- Expected/Actual: Actual confirmed; expected fallback versus explicit outage state belum disepakati.
