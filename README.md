# 🧢 SmartCap Catalog (Katalog Topi Pintar)

## 1. Latar Belakang Masalah (Problem Statement)
Pemilik usaha fashion (khususnya aksesoris topi) memiliki ratusan SKU produk yang belum terdigitalisasi. Memasukkan data dan merangkai deskripsi penjualan satu per satu untuk berbagai jenis topi memakan waktu terlalu lama dan menghambat proses penjualan online.

## 2. Solusi (Proposed Solution)
Membangun platform etalase mandiri (Katalog Digital) berbasis web yang dilengkapi fitur **AI Product Ingestion**. Pengguna cukup mengunggah foto dan nama dasar produk, lalu AI akan menyusun deskripsi komersial, detail material, dan kategori secara otomatis (bulk-generate).

## 3. Arsitektur & Teknologi (Tech Stack)
* **Kerangka Kerja:** Next.js (App Router, Fullstack)
* **Database:** Turso (Edge SQLite) via Drizzle ORM
* **AI Engine:** Google AI Studio (Gemini API) untuk *auto-copywriting*
* **Deployment:** Tencent EdgeOne

## 4. Fitur Inti (Minimum Viable Product)
- [ ] **Form Upload Massal** (gambar & nama topi).
- [ ] **Review & Edit Table** (pratinjau hasil generate AI sebelum masuk database).
- [ ] **Etalase Publik** dengan *dynamic routing* untuk menampilkan koleksi graphic baseball cap atau model topi lainnya.
- [ ] **Direct Checkout** (Tombol checkout direct ke WhatsApp).

---

## 📋 To-Do List & Progres (Hari Pertama - 31 Agustus)

Agar pengerjaan efisien, keempat orang dalam tim memegang peran spesifik di Fase Inisialisasi ini:

### 1. Rai (Logic & Deployment / AI & DevOps)
- [x] Inisialisasi proyek Next.js dan repositori GitHub.
- [x] Push kerangka awal ke GitHub dan hubungkan langsung ke Tencent EdgeOne untuk memastikan pipeline deployment berjalan mulus.
- [ ] Buat dan uji coba prompt utama di Google AI Studio untuk meracik deskripsi otomatis.

### 2. Owen (Database & Backend)
- [ ] Buat akun dan database baru di Turso.
- [ ] Pasang Drizzle ORM di Next.js.
- [ ] Rancang skema tabel `products` (ID, nama, deskripsi AI, harga, gambar, stok). **(Telah di-push ke cloud Turso)**

### 3. Josi (Frontend / UI Admin - Quality Assurance)
- [x] Setup Tailwind CSS dan komponen UI dasar (menggunakan shadcn/ui).
- [ ] Bangun halaman dashboard admin, khususnya antarmuka tabel untuk mereviu hasil generate AI.

### 4. Dhany (Frontend / UI Publik - Presentation & Media)
- [x] Bangun kerangka halaman etalase publik (Katalog) di `app/page.tsx`.
- [ ] Siapkan kumpulan foto aset (dummy data) berbagai model topi untuk bahan testing upload.
- [ ] Mulai pelajari format Lembar Orisinalitas dan Lembar Penggunaan AI untuk dicicil pengisiannya.

---

> *Membagi alur seperti di atas memastikan tidak ada anggota tim yang menganggur atau coding di berkas yang sama sehingga meminimalisir conflict di GitHub.*
