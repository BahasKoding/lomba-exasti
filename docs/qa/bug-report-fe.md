# Frontend Bug Report

Seluruh defect pada register ini berasal dari layer frontend. Status awal `Open` diberikan karena defect sudah confirmed dan belum ada evidence fix/retest.

## Bug Index

| Bug ID | Feature | Title | Severity | Priority | Status | Related Test Case |
|---|---|---|---|---|---|---|
| BUG-FE-001 | Empty state | Cart kosong terisi lagi | High | P0 | Closed | FE-CART-002 |
| BUG-FE-002 | Save selected | Selection berubah setelah reject | High | P0 | Open | ADMIN-REV-001 |
| BUG-FE-003 | Add state transition | Produk identik menjadi dua row | High | P0 | Closed | FE-CART-003 |
| BUG-FE-004 | File validation | File non-image mengaktifkan Generate | High | P0 | Open | ADMIN-UPLOAD-001 |
| BUG-FE-005 | Variant visibility | Warna pilihan tidak terlihat pada ringkasan cart | MINOR | P1/P3 | Open | BB-008 |
| BUG-FE-006 | Footer navigation | About footer mengarah ke anchor Home yang tidak menampilkan About | MINOR | P1/P3 | Open | BB-015 |
| BUG-FE-007 | Accessible quantity | Tombol tambah dan kurang jumlah tidak memiliki nama aksesibel | MINOR | P1/P3 | Open | BB-022 |
| BUG-FE-008 | Related product add | Related product masuk cart dengan harga berbeda dari katalog | MAJOR | P0 | Open | BB-009 |
| BUG-FE-009 | Home product add | Produk dari beranda masuk cart dengan harga berbeda dari kartu | MAJOR | P0 | Open | BB-026 |

## Detailed Bugs

| Bug ID | Module | Feature | Title | Environment | Version | Preconditions | Steps to Reproduce | Test Data | Expected Result | Actual Result | Severity | Priority | Evidence | Related Test Case | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BUG-FE-001 | Cart | Empty state | Cart kosong terisi lagi | Headless Microsoft Edge, local dev | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Satu produk sudah berada di cart | 1. Tambah satu produk.<br>2. Buka cart.<br>3. Hapus item terakhir.<br>4. Refresh. | `localStorage.cart=[]` setelah remove | Cart tetap kosong | Empty state sempat tampil, lalu refresh mengisi empat sample item dengan total Rp60.000. | High | P0 | `docs/qa/evidence/ui-2026-09-04/bug-empty-cart-repopulated.png` dan public trace | FE-CART-002 | Closed | Migrasi dari BUG-005. `app/cart/page.tsx` memperlakukan array kosong sama dengan storage yang hilang/corrupt. |
| BUG-FE-002 | AI Review | Save selected | Selection berubah setelah reject | Headless Microsoft Edge; sessionStorage draft terisolasi; POST products diintercept | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Tiga draft tersedia; row pertama dapat di-reject; row ketiga valid | 1. Seed tiga draft.<br>2. Reject row pertama.<br>3. Pilih row ketiga yang valid.<br>4. Klik Save. | Tiga draft terisolasi: row 0 Rejected, row 2 selected | Row ketiga dikirim | UI menampilkan `No valid products to save`; tidak ada POST terkirim. | High | P0 | `docs/qa/evidence/ui-2026-09-04/bug-review-selected-index.png`; selected index berasal dari `rows`, lalu diterapkan ke index `validRows` | ADMIN-REV-001 | Open | Migrasi dari BUG-006. Confirmed runtime tanpa mutasi database. |
| BUG-FE-003 | Cart | Add state transition | Produk identik menjadi dua row | Headless Microsoft Edge, local dev | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | localStorage cart kosong | 1. Buka katalog.<br>2. Klik Add pada produk yang sama dua kali.<br>3. Buka cart. | Produk katalog yang sama ditambahkan dua kali | Satu row dengan quantity 2 | localStorage berisi dua item dengan ID sama, cart menampilkan dua row, dan console mencatat duplicate key error. | High | P0 | `docs/qa/evidence/ui-2026-09-04/public-flow-trace.zip` | FE-CART-003 | Closed | Migrasi dari BUG-007. Update/remove row dapat ambigu dan render reconciliation tidak stabil. |
| BUG-FE-004 | Ingest | File validation | File non-image mengaktifkan Generate | Headless Microsoft Edge, local dev | `ba2bdf88f3dbe650bb98158628cec708534eaacb` | Route admin dapat dibuka; AI action tidak dijalankan | 1. Set file input ke `README.md` melalui browser automation.<br>2. Periksa count, preview, dan disabled state. | `README.md` | File ditolak; Generate disabled | UI menunjukkan `1 FILE`, preview rusak, dan tombol Generate tidak memiliki disabled state. | High | P0 | `docs/qa/evidence/ui-2026-09-04/candidate-non-image-upload.png` | ADMIN-UPLOAD-001 | Open | Migrasi dari BUG-008. `accept=image/*` hanya file-picker hint; handler tidak memvalidasi MIME/extension. Generate sengaja tidak diklik. |

## BUG-FE-005 — Warna pilihan tidak terlihat pada ringkasan cart

Finding ID: BUG-FE-005

Category: BUSINESS FLOW / FUNCTIONAL

Severity: MINOR

Module: Cart

Feature: Variant visibility

Status: Open

Environment: localhost:3000; Microsoft Edge; Playwright 1.63.0; 95d549bebf29b3cafc11174b8a741d0d87a1a60c; 2026-09-15.

Precondition: Detail mempunyai pilihan Navy

Steps to Reproduce:

1. Buka produk dari Catalog.
2. Pilih Navy.
3. Klik Add to Cart.
4. Buka Cart.

Expected Result: Cart menampilkan warna yang dipilih agar pesanan bisa ditinjau.

Actual Result: Nama, harga, dan quantity terlihat; warna Navy tidak tampil. Composer WhatsApp tetap memuat Navy.

Impact: Pengguna perlu membuka composer untuk memeriksa warna; data warna tidak hilang.

Evidence: CONFIRMED FROM RUNTIME; DOM, screenshot, browser navigation, trace. Frontend interaction/output is the failing boundary; exact implementation was not inspected.

- [screenshot](evidence/blackbox-2026-09-15/cycle2-run/blackbox-business-flow--BB-2d887--before-opening-checkout-P1-chromium/test-failed-1.png)
- [error-context](evidence/blackbox-2026-09-15/cycle2-run/blackbox-business-flow--BB-2d887--before-opening-checkout-P1-chromium/error-context.md)
- [trace](evidence/blackbox-2026-09-15/cycle2-run/blackbox-business-flow--BB-2d887--before-opening-checkout-P1-chromium/trace.zip)

Automation Test: BB-008, blackbox/business-flow.spec.ts:122.

## BUG-FE-006 — About footer mengarah ke anchor Home yang tidak menampilkan About

Finding ID: BUG-FE-006

Category: BUSINESS FLOW / FUNCTIONAL

Severity: MINOR

Module: Storefront

Feature: Footer navigation

Status: Open

Environment: localhost:3000; Microsoft Edge; Playwright 1.63.0; 95d549bebf29b3cafc11174b8a741d0d87a1a60c; 2026-09-15.

Precondition: Halaman About dapat diakses melalui header

Steps to Reproduce:

1. Buka Catalog.
2. Klik About pada footer.
3. Bandingkan dengan About pada header.

Expected Result: Link About menampilkan konten About yang tersedia.

Actual Result: Footer membuka /#about dengan hero Home; header membuka /about dengan konten About.

Impact: Navigasi sekunder salah; pengguna dapat memakai header sebagai workaround.

Evidence: CONFIRMED FROM RUNTIME; DOM, screenshot, browser navigation, trace. Frontend interaction/output is the failing boundary; exact implementation was not inspected.

- [screenshot](evidence/blackbox-2026-09-15/cycle2-run/blackbox-navigation-valida-ef3ac--content-like-the-header-P2-chromium/test-failed-1.png)
- [error-context](evidence/blackbox-2026-09-15/cycle2-run/blackbox-navigation-valida-ef3ac--content-like-the-header-P2-chromium/error-context.md)
- [trace](evidence/blackbox-2026-09-15/cycle2-run/blackbox-navigation-valida-ef3ac--content-like-the-header-P2-chromium/trace.zip)

Automation Test: BB-015, blackbox/navigation-validation.spec.ts:76.

## BUG-FE-007 — Tombol tambah dan kurang jumlah tidak memiliki nama aksesibel

Finding ID: BUG-FE-007

Category: LAYOUT / UI

Severity: MINOR

Module: Product

Feature: Accessible quantity

Status: Open

Environment: localhost:3000; Microsoft Edge; Playwright 1.63.0; 95d549bebf29b3cafc11174b8a741d0d87a1a60c; 2026-09-15.

Precondition: Detail produk tampil

Steps to Reproduce:

1. Buka detail.
2. Periksa tombol plus dan minus pada accessibility tree.

Expected Result: Masing-masing tombol memiliki nama yang menjelaskan aksi.

Actual Result: Kedua tombol memiliki accessible name kosong; ikon aria-hidden.

Impact: Pengguna assistive technology tidak mendapat identitas aksi; kontrol visual tetap berfungsi.

Evidence: CONFIRMED FROM RUNTIME; DOM, screenshot, browser navigation, trace. Frontend interaction/output is the failing boundary; exact implementation was not inspected.

- [screenshot](evidence/blackbox-2026-09-15/cycle2-run/blackbox-navigation-valida-af246--to-assistive-technology-P3-chromium/test-failed-1.png)
- [error-context](evidence/blackbox-2026-09-15/cycle2-run/blackbox-navigation-valida-af246--to-assistive-technology-P3-chromium/error-context.md)
- [trace](evidence/blackbox-2026-09-15/cycle2-run/blackbox-navigation-valida-af246--to-assistive-technology-P3-chromium/trace.zip)

Automation Test: BB-022, blackbox/navigation-validation.spec.ts:168.

### Retest cycle2 — 2026-09-15

- BUG-FE-001: BB-004 Pass; final removal, refresh, away/back retain empty state. Closed on current build.
- BUG-FE-003: BB-002 Pass; rapid double add yields one row, quantity 2, correct total after refresh. Closed on current build.
- BUG-FE-002/004: Not retested; no valid admin session. Historical Open retained.
- Current product failures: BUG-FE-005, BUG-FE-006, BUG-FE-007. Raw runner failures may also include automation issues; see current summary.

## BUG-FE-008 — Related product masuk cart dengan harga berbeda dari katalog

Finding ID: BUG-FE-008

Category: BUSINESS FLOW / FUNCTIONAL

Severity: MAJOR

Module: Product / Cart

Feature: Related product add

Status: Open

Environment: localhost:3000; Microsoft Edge; Playwright 1.63.0; 95d549bebf29b3cafc11174b8a741d0d87a1a60c; 2026-09-15.

Precondition: Catalog topi 3 Rp45.000; related topi 3 tersedia di detail topi 4

Steps to Reproduce:

1. Catat harga topi 3 di Catalog: Rp45.000.
2. Buka topi 4.
3. Klik Add to Cart pada related topi 3.
4. Buka Cart dan composer WhatsApp.
5. Refresh Cart.

Expected Result: Topi 3 tetap Rp45.000 di cart, total, dan composer.

Actual Result: Topi 3 berharga Rp149.000 di cart dan composer, bertahan setelah refresh.

Impact: Harga pesanan salah Rp104.000 lebih tinggi untuk satu item; jalur pembelian inti tidak konsisten.

Evidence: CONFIRMED FROM RUNTIME; DOM, screenshot, browser navigation, trace. Frontend interaction/output is the failing boundary; exact implementation was not inspected.

- [screenshot](evidence/blackbox-2026-09-15/verification-run/blackbox-business-flow--BB-f678e-talog-identity-and-price-P0-chromium/test-failed-1.png)
- [screenshot](evidence/blackbox-2026-09-15/verification-run/blackbox-business-flow--BB-f678e-talog-identity-and-price-P0-chromium/test-failed-2.png)
- [error-context](evidence/blackbox-2026-09-15/verification-run/blackbox-business-flow--BB-f678e-talog-identity-and-price-P0-chromium/error-context.md)
- [trace](evidence/blackbox-2026-09-15/verification-run/blackbox-business-flow--BB-f678e-talog-identity-and-price-P0-chromium/trace.zip)

Automation Test: BB-009, blackbox/business-flow.spec.ts:131.

### Retest verification — 2026-09-15

- BUG-FE-001: BB-004 Pass; final removal, refresh, away/back retain empty state. Closed on current build.
- BUG-FE-003: BB-002 Pass; rapid double add yields one row, quantity 2, correct total after refresh. Closed on current build.
- BUG-FE-002/004: Not retested; no valid admin session. Historical Open retained.
- Current product failures: BUG-FE-005, BUG-FE-008, BUG-FE-006, BUG-FE-007. Raw runner failures may also include automation issues; see current summary.

### Retest regression — 2026-09-15

- BUG-FE-001: BB-004 Pass; final removal, refresh, away/back retain empty state. Closed on current build.
- BUG-FE-003: BB-002 Pass; rapid double add yields one row, quantity 2, correct total after refresh. Closed on current build.
- BUG-FE-002/004: Not retested; no valid admin session. Historical Open retained.
- Current product failures: BUG-FE-005, BUG-FE-008, BUG-FE-006, BUG-FE-007. Raw runner failures may also include automation issues; see current summary.

## BUG-FE-009 — Produk dari beranda masuk cart dengan harga berbeda dari kartu

Finding ID: BUG-FE-009

Category: BUSINESS FLOW / FUNCTIONAL

Severity: MAJOR

Module: Home / Cart

Feature: Home product add

Status: Open

Environment: localhost:3000; Microsoft Edge; Playwright 1.63.0; 95d549bebf29b3cafc11174b8a741d0d87a1a60c; 2026-09-15.

Precondition: Home Collection menampilkan topi 4 Rp65.000

Steps to Reproduce:

1. Buka beranda.
2. Catat harga kartu topi 4: Rp65.000.
3. Klik Add to Cart pada kartu Collection.
4. Buka Cart dan composer WhatsApp.
5. Refresh Cart.

Expected Result: Harga tetap Rp65.000 sesuai kartu pada ringkasan dan composer.

Actual Result: Collection topi 4 Rp65.000 dan Best Selling topi 1 Rp75.000 sama-sama masuk cart Rp150.000; harga salah bertahan setelah refresh dan masuk composer.

Impact: Harga pesanan bertambah Rp85.000 untuk topi 4 dan Rp75.000 untuk topi 1 melalui entry point beranda. Exact implementation/root cause tidak diperiksa.

Evidence: CONFIRMED FROM RUNTIME; DOM, screenshot, browser navigation, trace. Frontend interaction/output is the failing boundary; exact implementation was not inspected.

- [collection-cart-price](evidence/blackbox-2026-09-15/resumed-run/blackbox-home--BB-026-Home-c6c42-preserve-displayed-price-P0-chromium/attachments/collection-cart-price-7a971a1cbee8448efff30a2b0a03a1bfff477433.png)
- [best-selling-cart-price](evidence/blackbox-2026-09-15/resumed-run/blackbox-home--BB-026-Home-c6c42-preserve-displayed-price-P0-chromium/attachments/best-selling-cart-price-8337ad1c2f4f689a27c226b48070ef0fa409ca31.png)
- [screenshot](evidence/blackbox-2026-09-15/resumed-run/blackbox-home--BB-026-Home-c6c42-preserve-displayed-price-P0-chromium/test-failed-1.png)
- [error-context](evidence/blackbox-2026-09-15/resumed-run/blackbox-home--BB-026-Home-c6c42-preserve-displayed-price-P0-chromium/error-context.md)
- [trace](evidence/blackbox-2026-09-15/resumed-run/blackbox-home--BB-026-Home-c6c42-preserve-displayed-price-P0-chromium/trace.zip)

Automation Test: BB-026, blackbox/home.spec.ts:6.

### Retest resumed — 2026-09-15

- BUG-FE-001: BB-004 Pass; final removal, refresh, away/back retain empty state. Closed on current build.
- BUG-FE-003: BB-002 Pass; rapid double add yields one row, quantity 2, correct total after refresh. Closed on current build.
- BUG-FE-002/004: Not retested; no valid admin session. Historical Open retained.
- Current product failures: BUG-FE-005, BUG-FE-008, BUG-FE-006, BUG-FE-007, BUG-FE-009. Raw runner failures may also include automation issues; see current summary.

### Retest final-regression — 2026-09-15

- BUG-FE-001: BB-004 Pass; final removal, refresh, away/back retain empty state. Closed on current build.
- BUG-FE-003: BB-002 Pass; rapid double add yields one row, quantity 2, correct total after refresh. Closed on current build.
- BUG-FE-002/004: Not retested; no valid admin session. Historical Open retained.
- Current product failures: BUG-FE-005, BUG-FE-008, BUG-FE-006, BUG-FE-007. Raw runner failures may also include automation issues; see current summary.

### Retest confirmation-regression — 2026-09-15

- BUG-FE-001: BB-004 Pass; final removal, refresh, away/back retain empty state. Closed on current build.
- BUG-FE-003: BB-002 Pass; rapid double add yields one row, quantity 2, correct total after refresh. Closed on current build.
- BUG-FE-002/004: Not retested; no valid admin session. Historical Open retained.
- Current product failures: BUG-FE-005, BUG-FE-008, BUG-FE-006, BUG-FE-007, BUG-FE-009. Raw runner failures may also include automation issues; see current summary.
