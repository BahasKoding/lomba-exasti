# Matriks Authentication dan Authorization

| Aktor | Route/fitur | Action/API | Expected access | Enforcement aktual | Status |
|---|---|---|---|---|---|
| Public | `/`, `/katalog`, `/produk/*`, `/cart` | GET `/api/catalog` | Allow | Public | Analyzed |
| Public | `/login` | POST login | Allow | Public + bcrypt | Analyzed |
| Public | `/admin/*` | UI admin | Deny/redirect | Hanya cek keberadaan `sc_session` | Analyzed, risk |
| Public | Product directory | GET/POST/PATCH/DELETE `/api/products` | NEEDS CONFIRMATION; inferred admin-only | Tidak ada authn/authz | Analyzed, risk |
| Public | AI ingestion | POST `/api/ingest` | NEEDS CONFIRMATION; inferred admin-only | Tidak ada authn/authz | Analyzed, risk |
| Public | Admin adapter | `/api/admin/upload`, `/api/admin/review` | NEEDS CONFIRMATION; inferred admin-only | Tidak ada authn/authz | Analyzed, risk |
| Admin valid | `/admin/*` | UI admin | Allow | Cookie presence only | Analyzed |
| Admin valid | Product/AI API | CRUD/ingest | Allow | Semua caller diizinkan | Analyzed |

Tidak ada role selain user/admin persona, permission table, ownership, atau resource-to-user relationship. Karena middleware tidak memvalidasi token ke `users.session_token`, forged, expired-at-DB, atau superseded token tidak dapat dibedakan dari sesi valid pada route UI.
