# Coverage Matrix

| Module | Feature/flow | Role | FE | BE | Authn | Authz | Validation | Positive | Negative | Edge | Manual | Automation | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Storefront | Home collections/CTA | Public | Ya | Catalog | N/A | N/A | Rendah | UI tested | N/A | Mobile tested | Browser | Candidate P0 | Manual Tested; Pass |
| Catalog | Search/filter/sort | Public | Ya | Catalog | N/A | N/A | Client | UI+API tested | API 500 tested | No-result tested | Browser | Candidate P1 | Manual Tested; Pass / error UX needs confirmation |
| Detail | Slug, option, quantity, WA | Public | Ya | Catalog | N/A | N/A | Client | UI tested | Unknown slug tested | Loading sampled | Browser | Candidate P0 | Manual Tested; partial |
| Cart | Add/update/remove/order | Public | Ya | N/A | N/A | N/A | Client/localStorage | UI tested | Empty/duplicate tested | Refresh tested | Browser | Candidate P0 | Manual Tested; Fail BUG-FE-001/003 |
| Login | Session creation | Admin | Ya | Ya | Ya | N/A | FE+BE partial | Valid blocked | Invalid tested | Empty/malformed tested | Browser+API | Candidate P0 | Manual Tested; partial |
| Logout | Session revoke | Admin | Ya | Ya | Ya | N/A | Cookie | Valid blocked | Forged flow partial | Back/reload partial | Browser+API | Candidate P0 | Partial; valid credential blocked |
| Admin guard | Direct route | Public/Admin | Ya | N/A | Ya | Ya | Cookie presence | N/A | UI+HTTP tested | Forged cookie tested | Browser+HTTP | Candidate P0 | Manual Tested; Fail BUG-BE-001 |
| Ingest | Batch Gemini | Admin | Ya | Ya | Missing | Missing | Partial | Blocked | Tested | Tested | API validation | Candidate P0/P1 | Manual Tested (partial) |
| Review | Edit/approve/reject/save | Admin | Ya | Ya | Missing | Missing | Partial | Search/view tested | Rejected selection tested | Index transition tested | Browser | Candidate P0/P1 | Manual Tested; Fail BUG-FE-002 |
| Products | List/create/status/delete | Admin | Ya | Ya | Missing | Missing | Partial | GET/filter tested | Validation tested | Not-found tested | Browser+API | Candidate P0/P1 | Manual Tested; Fail auth/validation |
| Settings | Persist/browser render | Admin/Public | Ya | N/A | Route only | Route only | Minimal | Save/render tested | Planned | Reload tested | Browser | Candidate P1 | Manual Tested; Pass |
| Database | Constraints/persistence | Admin | Indirect | Ya | Missing API | Missing API | DB constraints | Planned | Planned | Planned | Belum | Candidate P1 | Analyzed |
| External AI | Retry/partial failure | Admin | Ya | Ya | Missing | Missing | Partial | Planned | Planned | Planned | Belum | Candidate P2 with stub | Analyzed |

Execution sekarang mencakup browser headless nyata dan API. Belum ada suite regression yang dinyatakan `Automated`: script di `docs/qa/exploratory/` adalah harness eksplorasi/evidence, sementara lokasi test permanen pada konfigurasi masih menunjuk tracked `qa/automation` yang sedang deleted pada worktree awal.
