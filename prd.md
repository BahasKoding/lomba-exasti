# 🧢 Product Requirements Document (PRD): SmartCap Catalog

## 1. Latar Belakang Masalah
Pemilik usaha aksesoris topi seringkali kesulitan mendigitalisasi ratusan SKU produknya karena keterbatasan waktu untuk merangkai deskripsi komersial satu per satu, sehingga menghambat operasional penjualan.

## 2. Solusi
Membangun **SmartCap Catalog**, katalog digital cerdas dengan fitur *AI Product Ingestion*. Sistem akan otomatis menghasilkan deskripsi, mendeteksi material, dan menentukan kategori topi hanya dari unggahan foto dan nama produk.

## 3. Arsitektur & Teknologi (Tech Stack)
*   **Frontend & Framework:** Next.js (Tailwind CSS, shadcn/ui)
*   **Backend & DB:** Turso (Edge SQLite), Drizzle ORM
*   **AI Engine (Pilihan Fleksibel):** 
    *   *Primary Options:* `gpt-5.6-sol` atau `claude-opus-5` (Untuk akurasi tinggi dalam menyusun *copywriting* persuasif dan struktur JSON yang ketat).
    *   *Speed/Bulk Option:* `deepseek-v4-flash` (Alternatif jika membutuhkan proses *generate* massal dengan latensi sangat rendah).
    *   *Backup:* `claude-opus-4-8` atau `glm-5.3`.
*   **Deployment:** Tencent EdgeOne

## 4. Tim Pengembang (The Squad)
*   **Rai:** Project Manager & Frontend Developer
*   **Owen:** Backend, Database & AI Engineer
*   **Josi:** Quality Assurance (QA) / Tester
*   **Dhany:** Presentation & Media Specialist

## 5. Fitur Inti (Minimum Viable Product)
*   **Dashboard Admin:** Antarmuka unggah massal gambar dan nama produk.
*   **Table Review:** Pratinjau deskripsi, material, dan kategori hasil *generate* AI sebelum disimpan ke *database*.
*   **Etalase Publik:** Halaman katalog dinamis untuk pelanggan dengan *routing* berdasarkan kategori produk.
*   **Direct Checkout:** Tombol *call-to-action* pemesanan yang terintegrasi langsung ke WhatsApp admin.