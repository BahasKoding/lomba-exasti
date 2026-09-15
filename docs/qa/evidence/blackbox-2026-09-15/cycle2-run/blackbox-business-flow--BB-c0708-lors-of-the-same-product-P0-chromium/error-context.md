# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blackbox\business-flow.spec.ts >> [BB-007] Cart should preserve two distinct colors of the same product @P0
- Location: qa\automation\blackbox\business-flow.spec.ts:104:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('main').getByText('Total: Rp 130.000', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('main').getByText('Total: Rp 130.000', { exact: true }) with timeout 5000ms
  - waiting for getByRole('main').getByText('Total: Rp 130.000', { exact: true })

```

```yaml
- alert: YOUR CART
- banner:
  - link "SmartCap Studio":
    - /url: /
    - img
    - text: SmartCap Studio
  - navigation:
    - link "Home":
      - /url: /
    - link "Catalog":
      - /url: /katalog
    - link "About":
      - /url: /about
    - link "Cart":
      - /url: /cart
  - link "Admin":
    - /url: /login
- main:
  - link "Back to Catalog":
    - /url: /katalog
  - heading "YOUR CART" [level=1]
  - button "(2)"
  - text: "Total: Rp 214.000"
  - button "Select topi 4"
  - img "topi 4"
  - paragraph: topi 4
  - paragraph: Rp 65.000
  - button
  - text: "1"
  - button
  - button "Remove topi 4"
  - button "Select topi 3"
  - img "topi 3"
  - paragraph: topi 3
  - paragraph: Rp 149.000
  - button
  - text: "1"
  - button
  - button "Remove topi 3"
  - button "ORDER (2)"
- contentinfo:
  - img
  - heading "SmartCap Studio" [level=2]
  - paragraph: Crown Your Individuality
  - paragraph: SmartCap Studio is a premier interactive digital catalog platform curated for premium cap collections.
  - link "WhatsApp":
    - /url: https://wa.me/6281234567890?text=Hello%20SmartCap%20Studio%2C%20I%20would%20like%20to%20inquire%20about..
    - img
  - link "Instagram":
    - /url: https://instagram.com
    - img
  - heading "Navigation" [level=3]
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Catalog":
        - /url: /katalog
    - listitem:
      - link "About":
        - /url: /#about
    - listitem:
      - link "Cart":
        - /url: /cart
    - listitem:
      - link "Admin Login":
        - /url: /login
  - heading "Contact & Location" [level=3]
  - img
  - text: Jl. Haji Nawir Husadah II, Jakarta, Indonesia
  - img
  - text: +62 812-3456-7890 © 2026 SmartCap Studio. All rights reserved. Crown Your Individuality.
```

# Test source

```ts
  1  | import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';
  2  | 
  3  | export const money = (text: string) => Number(text.replace(/[^0-9]/g, ''));
  4  | export const rupiah = (value: number) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
  5  | export const main = (page: Page) => page.getByRole('main');
  6  | export const cards = (page: Page) => main(page).getByRole('link').filter({ has: page.getByRole('heading', { level: 3 }) });
  7  | 
  8  | export async function catalog(page: Page) {
  9  |   await page.goto('/katalog');
  10 |   await expect(page.getByRole('heading', { name: 'OUR CATALOG' })).toBeVisible();
  11 |   await expect(page.getByText('Loading catalog items...')).toBeHidden({ timeout: 30000 });
  12 |   await expect(cards(page).first(), 'Catalog needs at least one published product').toBeVisible();
  13 | }
  14 | 
  15 | export async function cardData(card: Locator) {
  16 |   return {
  17 |     name: (await card.getByRole('heading', { level: 3 }).textContent())!.trim(),
  18 |     price: money(await card.locator('p').innerText()),
  19 |     href: (await card.getAttribute('href'))!,
  20 |   };
  21 | }
  22 | 
  23 | export async function detail(page: Page) {
  24 |   await catalog(page);
  25 |   const item = await cardData(cards(page).first());
  26 |   await cards(page).first().click();
  27 |   await expect(page).toHaveURL(new RegExp(`${item.href}$`));
  28 |   await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.name);
  29 |   return item;
  30 | }
  31 | 
  32 | export async function addFromCatalog(page: Page, index = 0) {
  33 |   const card = cards(page).nth(index);
  34 |   const item = await cardData(card);
  35 |   await card.getByRole('button', { name: /Tambah .* ke Keranjang/ }).click();
  36 |   await expect(page.getByRole('link', { name: 'View Cart', exact: true })).toBeVisible();
  37 |   return item;
  38 | }
  39 | 
  40 | export async function openCart(page: Page) {
  41 |   const desktop = page.getByRole('banner').getByRole('link', { name: 'Cart', exact: true });
  42 |   if (await desktop.isVisible()) await desktop.click();
  43 |   else {
  44 |     await page.getByRole('button', { name: 'Toggle menu' }).click();
  45 |     await page.getByRole('banner').getByRole('link', { name: 'Cart', exact: true }).click();
  46 |   }
  47 |   await expect(page).toHaveURL(/\/cart$/);
  48 |   await expect(page.getByRole('heading', { name: 'YOUR CART' })).toBeVisible();
  49 | }
  50 | 
  51 | // Quantity buttons have no accessible name. These icon classes were observed
  52 | // in the live DOM; restrict to unnamed buttons so related-card Add is excluded.
  53 | export function quantity(page: Page, direction: 'plus' | 'minus') {
  54 |   return main(page).getByRole('button', { name: '', exact: true })
  55 |     .filter({ has: page.locator(`svg.lucide-${direction}`) });
  56 | }
  57 | 
  58 | export async function total(page: Page, amount: number) {
> 59 |   await expect(main(page).getByText(`Total: ${rupiah(amount)}`, { exact: true })).toBeVisible();
     |                                                                                   ^ Error: expect(locator).toBeVisible() failed
  60 | }
  61 | 
  62 | export async function orderText(page: Page, info: TestInfo) {
  63 |   const outgoing = page.context().waitForEvent('request', {
  64 |     predicate: request => request.isNavigationRequest() && /^(wa\.me|(?:api|web)\.whatsapp\.com)$/.test(new URL(request.url()).hostname),
  65 |   });
  66 |   await page.getByRole('button', { name: /^ORDER \(/ }).click();
  67 |   const request = await outgoing;
  68 |   const url = new URL(request.url());
  69 |   const text = (url.searchParams.get('text') || '').replace(/\u00a0/g, ' ');
  70 |   await info.attach('whatsapp-composer', { body: JSON.stringify({ hostname: url.hostname, text }, null, 2), contentType: 'application/json' });
  71 |   for (const popup of page.context().pages()) if (popup !== page) await popup.close();
  72 |   return text;
  73 | }
  74 | 
  75 | export async function checkpoint(page: Page, info: TestInfo, name: string) {
  76 |   await info.attach(name, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  77 | }
  78 | 
```