# QA Summary

## Build Information

| Field | Value |
|---|---|
| Version | Baseline QA `ba2bdf88f3dbe650bb98158628cec708534eaacb` |
| Branch | `main` |
| Commit | `ba2bdf88f3dbe650bb98158628cec708534eaacb` |
| Environment | Local Next.js dev; Microsoft Edge headless via Playwright 1.62.1; configured database identity unknown |
| URL | `http://127.0.0.1:3000` |
| Tester | Codex QA |
| Test Date | 2026-09-04 (Asia/Jakarta) |

## Test Execution Summary

| Layer | Total | Pass | Fail | Blocked | Not Run | Needs Confirmation |
|---|---:|---:|---:|---:|---:|---:|
| Frontend | 18 | 9 | 6 | 1 | 0 | 2 |
| Backend/API | 17 | 12 | 5 | 0 | 0 | 0 |
| Overall | 35 | 21 | 11 | 1 | 0 | 2 |

Pass Rate: **65.63%** — 21 Pass / 32 conclusive executions (`Pass + Fail`). Satu Blocked dan dua Needs Confirmation tidak dimasukkan ke denominator. Sumber: [FE execution](test-execution-fe.tsv) dan [BE execution](test-execution-be.tsv).

`Not Run` menghitung hanya record yang secara eksplisit berstatus Not Run di execution sheets; saat ini tidak ada. Ini tidak berarti seluruh planned scope sudah dieksekusi—gap dan skenario yang belum dapat dijalankan dicatat pada Blocked Testing dan coverage.

## Bug Summary

### Frontend Bugs

| Open | In Progress | Ready to Retest | Closed | Rejected | Duplicate | Total |
|---:|---:|---:|---:|---:|---:|---:|
| 4 | 0 | 0 | 0 | 0 | 0 | 4 |

### Backend Bugs

| Open | In Progress | Ready to Retest | Closed | Rejected | Duplicate | Total |
|---:|---:|---:|---:|---:|---:|---:|
| 4 | 0 | 0 | 0 | 0 | 0 | 4 |

### Critical Findings

| Bug ID | Layer | Feature | Title | Severity | Priority | Status |
|---|---|---|---|---|---|---|
| BUG-BE-001 | Backend | Admin guard | Cookie palsu membuka admin | Critical | P0 | Open |
| BUG-BE-002 | Backend | API authorization | API admin dapat diakses tanpa sesi | Critical | P0 | Open |
| BUG-FE-001 | Frontend | Empty state | Cart kosong terisi lagi | High | P0 | Open |
| BUG-FE-002 | Frontend | Save selected | Selection berubah setelah reject | High | P0 | Open |
| BUG-FE-003 | Frontend | Add state transition | Produk identik menjadi dua row | High | P0 | Open |
| BUG-FE-004 | Frontend | File validation | File non-image mengaktifkan Generate | High | P0 | Open |
| BUG-BE-004 | Backend | Create validation | Product invalid mengekspos exception | High | P0 | Open |

## Test Coverage Summary

| Area | Status | Current evidence |
|---|---|---|
| P0 Critical Flow | Partial | Safe public/admin-negative paths executed; valid login and mutation journey incomplete; P0 defects open |
| Frontend | Partial | Public, cart, auth negative, admin read-only, review, settings, and responsive public paths executed |
| Backend/API | Partial | Catalog, auth negative, authorization, and validation boundaries executed; mutation lifecycle incomplete |
| Authentication | Partial | Invalid/empty/malformed and direct guard tested; valid credential lifecycle blocked |
| Authorization | Partial | Forged/missing session tested and failed; broader mutation enforcement not safely executed |
| Validation | Partial | Multiple FE/BE negative boundaries executed; known gaps remain |
| Positive | Partial | Public browse/cart/settings and safe API reads executed; valid admin lifecycle incomplete |
| Negative | Partial | Auth, API payload, empty state, duplicate state, and file-input paths executed |
| Edge | Partial | Boundary, repeated add, unknown slug, loading, and status cases partially covered |
| Automation | Not Tested | No permanent runnable regression suite in the current worktree; exploratory scripts are evidence harnesses only |

## Blocked Testing

| Feature | Test Case | Reason | Required Action |
|---|---|---|---|
| Valid admin login | AUTH-001 | QA admin credential tidak tersedia | Sediakan credential test melalui environment |
| Valid logout lifecycle | AUTH-005 | Membutuhkan sesi valid, bukan forged cookie | Sediakan credential test dan sesi QA |
| Ingest → review → save → publish → catalog | E2E-ADMIN-001 | QA DB, credential, cleanup policy, dan Gemini stub/live policy belum dikonfirmasi | Sediakan environment/data terisolasi dan setujui AI stub/live policy |
| Product create/publish persistence | API-PROD-001, API-PROD-003 | Identitas database aman untuk mutation belum diketahui | Tetapkan QA database dan cleanup scope |
| Ingest success | API-ING-001 | AI stub/live call dan budget belum disetujui | Tetapkan deterministic stub atau budget live call |
| Admin mobile drawer | FE-MOBILE-002 | Isolated rerun mengalami admin hydration/data-loading instability | Ulangi pada authenticated QA environment yang stabil |

## Current QA Risks

- Dua defect Critical/P0 masih membuka route dan API admin tanpa valid authorization.
- P0 admin business journey belum selesai karena credential, QA database, dan AI policy belum tersedia.
- Product API dapat menghasilkan 500 dan mengekspos internal exception untuk payload invalid.
- Empat defect frontend P0 memengaruhi cart state, review selection, dan upload validation.
- Fallback UI dapat menyamarkan catalog API failure; expected behavior masih Needs Confirmation.
- Belum ada permanent automated regression suite pada current worktree.

## QA Release Recommendation

**NOT READY**

Dua defect authorization Critical/P0 masih Open, beberapa P0 frontend flow gagal, dan valid admin mutation journey masih blocked. Rekomendasi ini mengikuti evidence QA saat ini tanpa mengasumsikan release criteria tambahan.

## Developer Action Required

| Priority | Bug ID | Layer | Feature | Action | Status |
|---:|---|---|---|---|---|
| 1 | BUG-BE-001 | Backend | Admin guard | Validasi session token pada middleware sebelum memberi akses admin | Open |
| 2 | BUG-BE-002 | Backend | API authorization | Terapkan authentication/authorization pada seluruh endpoint admin | Open |
| 3 | BUG-FE-001 | Frontend | Cart empty state | Pertahankan empty cart setelah remove dan refresh | Open |
| 4 | BUG-FE-002 | Frontend | Review selection | Pertahankan mapping selected row setelah rejected row difilter | Open |
| 5 | BUG-FE-003 | Frontend | Cart add | Gabungkan produk identik atau gunakan key/identity unik yang konsisten | Open |
| 6 | BUG-FE-004 | Frontend | Upload validation | Tolak file non-image sebelum preview dan Generate | Open |
| 7 | BUG-BE-004 | Backend | Product validation | Return 4xx terstruktur sebelum slugify/insert | Open |
| 8 | BUG-BE-003 | Backend | Login validation | Tangani malformed JSON sebagai 4xx JSON terstruktur | Open |

## Retest Workflow

`Open → In Progress → Ready to Retest → QA Retest`

- Jika QA retest Pass: `Ready to Retest → Closed`.
- Jika QA retest Fail: `Ready to Retest → Open`.
- Perubahan code saja tidak menutup bug; hanya evidence QA retest yang dapat memindahkan `Ready to Retest` menjadi `Closed`.

## Traceability

Gunakan rantai: Bug ID → Related Test Case → FE/BE Test Execution → Evidence. Detail tersedia di [Frontend Bug Report](bug-report-fe.md), [Backend Bug Report](bug-report-be.md), [FE execution](test-execution-fe.tsv), dan [BE execution](test-execution-be.tsv).
