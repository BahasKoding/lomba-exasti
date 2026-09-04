# Frontend Bug Report

Seluruh defect pada register ini berasal dari layer frontend. Status awal `Open` diberikan karena defect sudah confirmed dan belum ada evidence fix/retest.

## Bug Index

| Bug ID | Feature | Title | Severity | Priority | Status | Related Test Case |
|---|---|---|---|---|---|---|
| BUG-FE-001 | Empty state | Cart kosong terisi lagi | High | P0 | Open | FE-CART-002 |
| BUG-FE-002 | Save selected | Selection berubah setelah reject | High | P0 | Open | ADMIN-REV-001 |
| BUG-FE-003 | Add state transition | Produk identik menjadi dua row | High | P0 | Open | FE-CART-003 |
| BUG-FE-004 | File validation | File non-image mengaktifkan Generate | High | P0 | Open | ADMIN-UPLOAD-001 |

## Detailed Bugs

| Bug ID | Module | Feature | Title | Environment | Version | Preconditions | Steps to Reproduce | Test Data | Expected Result | Actual Result | Severity | Priority | Evidence | Related Test Case | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BUG-FE-001 | Cart | Empty state | Cart kosong terisi lagi | Headless Microsoft Edge, local dev | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Satu produk sudah berada di cart | 1. Tambah satu produk.<br>2. Buka cart.<br>3. Hapus item terakhir.<br>4. Refresh. | `localStorage.cart=[]` setelah remove | Cart tetap kosong | Empty state sempat tampil, lalu refresh mengisi empat sample item dengan total Rp60.000. | High | P0 | `docs/qa/evidence/ui-2026-09-04/bug-empty-cart-repopulated.png` dan public trace | FE-CART-002 | Open | Migrasi dari BUG-005. `app/cart/page.tsx` memperlakukan array kosong sama dengan storage yang hilang/corrupt. |
| BUG-FE-002 | AI Review | Save selected | Selection berubah setelah reject | Headless Microsoft Edge; sessionStorage draft terisolasi; POST products diintercept | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Tiga draft tersedia; row pertama dapat di-reject; row ketiga valid | 1. Seed tiga draft.<br>2. Reject row pertama.<br>3. Pilih row ketiga yang valid.<br>4. Klik Save. | Tiga draft terisolasi: row 0 Rejected, row 2 selected | Row ketiga dikirim | UI menampilkan `No valid products to save`; tidak ada POST terkirim. | High | P0 | `docs/qa/evidence/ui-2026-09-04/bug-review-selected-index.png`; selected index berasal dari `rows`, lalu diterapkan ke index `validRows` | ADMIN-REV-001 | Open | Migrasi dari BUG-006. Confirmed runtime tanpa mutasi database. |
| BUG-FE-003 | Cart | Add state transition | Produk identik menjadi dua row | Headless Microsoft Edge, local dev | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | localStorage cart kosong | 1. Buka katalog.<br>2. Klik Add pada produk yang sama dua kali.<br>3. Buka cart. | Produk katalog yang sama ditambahkan dua kali | Satu row dengan quantity 2 | localStorage berisi dua item dengan ID sama, cart menampilkan dua row, dan console mencatat duplicate key error. | High | P0 | `docs/qa/evidence/ui-2026-09-04/public-flow-trace.zip` | FE-CART-003 | Open | Migrasi dari BUG-007. Update/remove row dapat ambigu dan render reconciliation tidak stabil. |
| BUG-FE-004 | Ingest | File validation | File non-image mengaktifkan Generate | Headless Microsoft Edge, local dev | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Route admin dapat dibuka; AI action tidak dijalankan | 1. Set file input ke `README.md` melalui browser automation.<br>2. Periksa count, preview, dan disabled state. | `README.md` | File ditolak; Generate disabled | UI menunjukkan `1 FILE`, preview rusak, dan tombol Generate tidak memiliki disabled state. | High | P0 | `docs/qa/evidence/ui-2026-09-04/candidate-non-image-upload.png` | ADMIN-UPLOAD-001 | Open | Migrasi dari BUG-008. `accept=image/*` hanya file-picker hint; handler tidak memvalidasi MIME/extension. Generate sengaja tidak diklik. |
