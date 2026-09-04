# Peta Aplikasi SmartCap Catalog

Baseline: commit `ba2bdf88f3dbe650bb98158628cec708534eaacb`, branch `main`, dianalisis 2026-09-04.

## Tujuan dan stack

`CONFIRMED FROM CODE` SmartCap adalah katalog topi dengan etalase publik, keranjang lokal, checkout WhatsApp, bulk ingestion berbasis Gemini, review draft, publikasi produk, dan konfigurasi toko per browser.

- Next.js 16.3.3 App Router, React 19.2.8, TypeScript (`strict: false`)
- Tailwind CSS 4 dan komponen shadcn/Base UI
- Route Handler Next.js sebagai backend
- Drizzle ORM 0.45.2 dan libSQL/Turso; fallback koneksi `file:local.db`
- Google GenAI `gemini-3.6-flash` untuk draft produk
- bcrypt untuk password; cookie sesi HTTP-only
- Playwright Test 1.62.1 sudah terpasang dan dikonfigurasi

## Entry point dan modul

| Modul | Entry point | Tanggung jawab | Evidence |
|---|---|---|---|
| Storefront | `/` | Hero, koleksi published/fallback, CTA, add cart | CONFIRMED FROM CODE |
| Katalog | `/katalog` | Fetch katalog, search, filter kategori, sort, empty/loading fallback | CONFIRMED FROM CODE |
| Detail produk | `/produk/[slug]` | Detail, gambar, warna, kuantitas, cart, order WhatsApp, related items | CONFIRMED FROM CODE |
| Cart | `/cart` | State `localStorage`, kuantitas, hapus, total, order WhatsApp | CONFIRMED FROM CODE |
| Login | `/login` | Email/password ke `/api/auth/login` | CONFIRMED FROM CODE |
| Admin bulk | `/admin` | Upload gambar, Gemini ingest, product directory, publish/park/delete | CONFIRMED FROM CODE |
| AI review | `/admin/review` | Edit draft, select/approve/reject, save products | CONFIRMED FROM CODE |
| Settings | `/admin/settings` | Branding, WhatsApp, sosial di `localStorage` | CONFIRMED FROM CODE |

## Aktor, auth, dan state

- `Public visitor`: tanpa login; katalog, detail, cart, WhatsApp.
- `Admin`: satu tipe user tersimpan di tabel `users`; tidak ada kolom role/permission.
- Login membandingkan bcrypt hash, membuat UUID, menyimpan satu `sessionToken` pada user, dan mengirim cookie `sc_session` HTTP-only, SameSite Lax, path `/`, umur 7 hari.
- Middleware hanya memeriksa keberadaan cookie untuk prefix `/admin`; token tidak dicocokkan dengan database.
- Semua API route saat ini tidak melakukan pemeriksaan sesi atau role.
- UI juga memakai `admin_logged_in` di localStorage/cookie non-HTTP-only untuk label navigasi; nilai ini bukan kontrol middleware.

## Data dan relasi

| Entity | Kolom penting | Constraint/default | Relasi |
|---|---|---|---|
| `users` | id, name, email, password_hash, session_token, created_at | id auto increment; name/email/password wajib; email unique | Tidak ada FK |
| `products` | id, name, slug, ai_description, price, image_url, stock_count, category, material, status, created_at | id PK; name/slug/price/status wajib; slug unique; stock 0; status `parked` | Tidak ada FK |

Variant dan feature hanya berupa skema terkomentar, sehingga bukan bagian runtime.

## Integrasi dan environment

Nama environment yang ditemukan tanpa membaca nilainya: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `GOOGLE_AI_KEY`. Kode juga membaca `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_USE_MOCK_ADMIN`, endpoint upload/review AI publik/server, dan `PLAYWRIGHT_BASE_URL`.

Integrasi eksternal: Turso/libSQL, Gemini, endpoint AI opsional, WhatsApp, serta gambar remote Unsplash/placehold.co. Deployment Tencent EdgeOne disebut README/PRD tetapi `NEEDS CONFIRMATION` dari konfigurasi repo.

## Validasi dan error state utama

- Login: frontend required + cek truthy; backend cek truthy dan credential bcrypt. Tidak ada trim/normalisasi eksplisit; JSON malformed tidak ditangani.
- Ingest: `Content-Length` maksimum 10 MB bila tersedia, 1-30 item, tiga field wajib truthy; empat request AI paralel; kegagalan per item dikembalikan dalam `results`.
- Products POST: hanya memvalidasi `products` array non-kosong; field item, tipe, panjang, harga, kategori, MIME, dan base64 belum divalidasi.
- Products PATCH: id wajib dan status hanya `parked|published`; 404 bila id tidak ada.
- Products DELETE: id wajib; 404 bila id tidak ada.
- Admin upload: minimal satu `File`; belum ada batas tipe, ukuran, atau jumlah.
- Review PATCH: id wajib; status dan bentuk payload belum dibatasi.
- UI katalog mengganti error atau data kosong dengan data fallback, sehingga error dan empty database tidak tampak sebagai state berbeda.
- Banyak `catch` UI mengabaikan error atau memakai fallback; observability terbatas.

## Operasi sensitif

Login/logout, ingest AI berbiaya, create/publish/park/delete produk, review status, penyimpanan gambar base64, dan perubahan nomor checkout adalah operasi yang perlu pengujian security boundary dan persistence.
