# Blackbox discovery dan test design — 2026-09-15

## Scope dan baseline

- Pure blackbox; ekspektasi berasal dari DOM/UI yang diamati, README, PRD, dan konsistensi antarhalaman. Tidak membaca implementasi aplikasi, memanggil API langsung, memodifikasi storage, memalsukan sesi, atau mengakses database.
- Branch `qa/setup-testing`, commit `95d549bebf29b3cafc11174b8a741d0d87a1a60c`.
- Pre-existing: `package-lock.json` modified (SHA256 `ADACDD8562A29155703520591B8EC6D72021F68316186926AB445347A105BC62`) dan tiga untracked trace `docs/qa/evidence/ui-2026-09-04/{admin-flow,auth-negative,public-flow}-trace.zip`.
- npm; Playwright 1.63.0; existing `playwright.config.ts` menunjuk `qa/automation`; belum ada file test di sana.
- Existing `npm run dev` server port 3000 digunakan kembali. Tidak mengubah konfigurasi/package/script. Browser terintegrasi kosong; bundled Chromium belum terpasang; suite menggunakan installed Edge melalui `test.use({ channel: 'msedge' })` hanya dalam scope QA.
- Data cart berasal dari tindakan UI dalam browser context baru. Tidak mengubah produk database. Checkout dibatasi ke URL composer; pesan tidak dikirim.

## Application mapping — CONFIRMED FROM RUNTIME

| Module | Feature | Observed flow | Priority | Planned automation |
|---|---|---|---|---|
| Storefront | Home, About, CTA, header/footer, Collection/Best Selling quick add | Home → Catalog/About/Login/Cart | P0/P1/P2 | Navigasi, history, footer, empty cart, harga quick add dan carousel mobile |
| Catalog | 3 kartu produk, search, sort, quick add | Search/sort → kartu → detail atau cart | P0/P1 | Matching aktual, clear/empty/edge search, urutan data, duplicate click |
| Product | Nama, harga, deskripsi, warna, jumlah, thumbnail, related cards | Detail → pilihan → cart / WhatsApp | P0 | Konsistensi kartu-detail, varian, jumlah minimum, total dan composer |
| Cart | Select, quantity, remove, total, order | Add → edit/select/remove → refresh → order | P0 | Persistence, empty state, agregasi item, isolasi warna, subtotal, selected order |
| Login | Required email/password, reveal, submit, error | Invalid input → validation/error → retry | P0/P1 | Empty/malformed/whitespace, password toggle, negative login, protected navigation |
| Admin | Dashboard/upload/review documented in PRD | Login → upload → AI review → save → catalog | P0 | Blocked sampai akun valid tersedia; UI internal belum diamati |
| Layout | Responsive header/menu, sort dropdown, CTAs | Desktop/laptop/mobile → core controls | P3 | 1440×900, 1280×720, 390×844; overflow dan actionability |

## Business flow map

```text
P0: Home → Catalog → Product → Color + Quantity → Add to Cart
    → Cart data + Total → Refresh → Away/Back → WhatsApp composer
P0: Catalog → Quick Add twice → Aggregated Cart → Edit Quantity
    → Select/Deselect → Remove final item → Refresh → Empty state
P1: Catalog → Search → Sort visible results → Clear → Detail
    → Browser Back/Forward → Refresh/deep link
P1: Login → Required/format validation → Invalid credentials
    → Readable error → Retry available; protected URL → Login
P0 BLOCKED: Valid login → Admin → Upload → Generate → Review/edit
    → Save/publish → Catalog consistency → Logout
P3: Each public flow at desktop/laptop/mobile → Reachable controls
```

## Design criteria

- Each automated scenario has meaningful state/result assertions and isolated UI setup.
- Product names/prices/links are read from rendered catalog, not hardcoded fixtures.
- Color options, sort options and validation wording are grounded in discovery snapshots.
- No pagination/filter widgets observed in current 3-item catalog: no invented automation.
- Auth expiration, role comparisons and admin persistence remain blocked/unobserved.
- Search-state persistence and available product colors beyond UI wording require product confirmation; no undocumented numeric boundaries assumed.
- Findings separated by FE/BE root-cause evidence, then Business Flow / Layout and MAJOR / MINOR. Historical findings do not count as current failures without retest.
- Evidence: `evidence/blackbox-2026-09-15/{discovery,flows,cart-discovery,state-discovery}.json` and screenshots. The initial `product-detail` capture in flows.json preceded navigation and is not a completed detail observation; `detail-ready` in cart-discovery.json is the authoritative discovery.

## Additional public coverage after continuation

- BB-026: Home Collection dan Best Selling → Add → Cart → refresh → WhatsApp composer; bandingkan harga dengan kartu yang diklik.
- BB-027: mobile Home Feature 1 → Feature 2 → Feature 1; validasi heading slide aktual, bukan hanya klik indikator.
- Discovery: `evidence/blackbox-2026-09-15/home-discovery.json` dan `home-mobile-discovery.json`.
- Suite kini 27 skenario. Run continuation dihentikan atas permintaan pengguna; partial run bukan hasil lengkap. Run resumed dan confirmation-regression menyediakan pengulangan lengkap. Run final-regression di antaranya tetap disimpan karena memuat gangguan loading BB-010/026; penyebab belum terkonfirmasi.
- Priority mapping: P0/P1 = High, P2 = Medium, P3 = Low.
