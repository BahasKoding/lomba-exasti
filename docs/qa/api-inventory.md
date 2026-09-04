# Inventaris API

Baseline `CONFIRMED FROM CODE`. Auth yang tercantum sebagai expected berasal dari sifat fitur/admin; enforcement aktual dijelaskan terpisah.

| Method | Endpoint | Fitur | Input/validasi | Response utama | DB/side effect | Auth aktual |
|---|---|---|---|---|---|---|
| POST | `/api/auth/login` | Login | JSON email/password truthy | 200 `{success:true}`; 400 kosong; 401 salah | update `users.session_token`; set cookie | Public |
| POST | `/api/auth/logout` | Logout | Cookie opsional | 200 `{success:true}` | null-kan token cocok; delete cookie | Tidak wajib |
| GET | `/api/catalog` | Katalog publik | - | 200 list published; 500 error | Read products | Public |
| GET | `/api/products` | Direktori produk admin | - | 200 seluruh produk; 500 | Read products | Tidak diperiksa |
| POST | `/api/products` | Simpan review | JSON `products` array ≥1 | 201 inserted; 400 bentuk dasar; 500 | Insert status default parked | Tidak diperiksa |
| PATCH | `/api/products` | Publish/park | id + status enum | 200 updated; 400; 404; 500 | Update status | Tidak diperiksa |
| DELETE | `/api/products` | Hapus produk | id | 200 deleted; 400; 404; 500 | Delete permanen | Tidak diperiksa |
| POST | `/api/ingest` | Generate Gemini | JSON items 1..30; field name/base64/MIME truthy; Content-Length ≤10MB bila header ada | 200 hasil per item; 400; 413 | Call Gemini, biaya eksternal | Tidak diperiksa |
| POST | `/api/admin/upload` | Upload adapter/mock | multipart `files` ≥1 | 200 generated/normalized; 400; 500 | Optional upstream call | Tidak diperiksa |
| GET | `/api/admin/review` | Review mock/upstream | - | 200 data; 500 | Optional upstream GET | Tidak diperiksa |
| PATCH | `/api/admin/review` | Status review mock/upstream | JSON id wajib | 200 payload+updatedAt; 400; 500 | Optional upstream PATCH | Tidak diperiksa |

## Kontrak yang perlu dikunci

- Expected auth untuk seluruh `/api/products`, `/api/ingest`, dan `/api/admin/*` adalah `NEEDS CONFIRMATION`, walau UI dan penamaan menempatkannya sebagai admin.
- Belum ada schema validator terpusat atau OpenAPI.
- Belum ada limit item-body yang efektif bila `Content-Length` hilang/chunked.
- Error database dapat mengekspos `error.message`; kebijakan detail error `NEEDS CONFIRMATION`.
