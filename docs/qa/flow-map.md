# Peta Flow Kritis

Semua alur di bawah `CONFIRMED FROM CODE`; hasil runtime belum dieksekusi.

## F1 — Publik melihat dan memesan produk

Public visitor → `/` atau `/katalog` → `GET /api/catalog` → hanya produk `published` → search/filter/sort → `/produk/[slug]` → pilih gambar/warna/jumlah → add ke `localStorage.cart` atau buka URL WhatsApp → `/cart` → ubah/hapus item → order WhatsApp.

Alternatif penting: API gagal/kosong memicu katalog fallback; slug tidak ditemukan memicu detail default; cart kosong/corrupt memicu sample cart; kuantitas minimum 1; refresh membaca localStorage; back/forward dan direct URL perlu runtime.

## F2 — Admin login dan logout

Admin → `/login` → validasi browser → `POST /api/auth/login` → lookup email → bcrypt compare → UUID ke `users.session_token` → cookie `sc_session` 7 hari → `/admin` → admin layout menulis flag UI `admin_logged_in` → logout POST mengosongkan token yang cocok dan menghapus `sc_session` → `/login`.

Alternatif penting: field kosong, format email browser, credential salah, malformed JSON, database error, refresh, direct `/admin`, cookie hilang/acak/expired, login ulang, browser back setelah logout.

## F3 — Bulk AI ingestion sampai published catalog

Admin → `/admin` → pilih satu/banyak image → FileReader menghasilkan base64 → `POST /api/ingest` → validasi batch → maksimal empat call Gemini paralel → hasil sukses/gagal per indeks → draft dan input disimpan di `sessionStorage` → `/admin/review` → edit/approve/reject/select → `POST /api/products` untuk non-rejected/selected → insert status default `parked` → redirect `/katalog` → admin membuka product directory → `PATCH /api/products` menjadi `published` → `GET /api/catalog` menampilkan produk.

Precondition: credential admin, database test, `GOOGLE_AI_KEY`, image valid, network Gemini. Dampak: biaya AI dan insert database.

Alternatif penting: 0/31 item, payload >10 MB, MIME palsu, base64 invalid, sebagian AI gagal, refresh review kehilangan/menjaga sessionStorage, semua rejected, double save, duplicate name/slug, database gagal, publish id tidak ada.

## F4 — Admin mengelola product directory

`/admin` → `GET /api/products` → filter all/parked/published → toggle status melalui PATCH → UI update lokal bila response OK → delete dengan browser confirmation → DELETE → baris hilang.

Alternatif penting: API tanpa sesi, forged cookie, response gagal, klik berulang, resource sudah dihapus, filter setelah state berubah, direct API call.

## F5 — Konfigurasi storefront per browser

`/admin/settings` → edit konfigurasi → save per section → seluruh object ke `localStorage.smartcap_store_settings` → storefront/cart/detail membaca nilai pada mount → link WhatsApp/branding/sosial berubah pada browser tersebut.

Alternatif penting: JSON corrupt, nomor berformat `0`, `62`, `+62`, huruf/whitespace, URL sosial tanpa scheme, tab/browser/device berbeda, logout, clear storage.

## Traceability awal

| Business flow | Scenario | Test case | UI automation | API automation | Execution | Bug |
|---|---|---|---|---|---|---|
| F1 | Browse–detail–cart–order | FE-CAT-001, FE-CART-001/002/003 | Candidate | API-CAT-001 | API dan UI partial executed | BUG-FE-001/003; CANDIDATE-004/006/007 |
| F2 | Login–protected area–logout | AUTH-001..008 | Candidate P0 | AUTH-API-001..004 | Partial | BUG-BE-001/002/003 |
| F3 | Ingest–review–save–publish | E2E-ADMIN-001, ADMIN-REV-001, ADMIN-UPLOAD-001 | Candidate P0 | API-ING-001, API-PROD-001/002 | Read-only/negative partial | BUG-FE-002/004; BUG-BE-002 |
| F4 | Toggle/delete product | ADMIN-PROD-001/002 | Candidate P1 | API-PROD-003..010 | Validation partial | BUG-BE-002/004 |
| F5 | Save storefront settings | FE-SET-001 | Candidate P1 | N/A | Belum | - |
