# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blackbox\business-flow.spec.ts >> [BB-004] Cart should remain empty after final removal and refresh @P0
- Location: qa\automation\blackbox\business-flow.spec.ts:49:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Remove TOPI 4', exact: true })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]: YOUR CART
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - link "SmartCap Studio" [ref=e6] [cursor=pointer]:
          - /url: /
        - navigation [ref=e12]:
          - link "Home" [ref=e13] [cursor=pointer]:
            - /url: /
          - link "Catalog" [ref=e14] [cursor=pointer]:
            - /url: /katalog
          - link "About" [ref=e15] [cursor=pointer]:
            - /url: /about
          - link "Cart" [ref=e16] [cursor=pointer]:
            - /url: /cart
        - link "Admin" [ref=e19] [cursor=pointer]:
          - /url: /login
    - main [ref=e21]:
      - generic [ref=e22]:
        - link "Back to Catalog" [ref=e23] [cursor=pointer]:
          - /url: /katalog
        - heading "YOUR CART" [level=1] [ref=e26]
      - generic [ref=e27]:
        - generic [ref=e28]:
          - button "(1)" [ref=e29] [cursor=pointer]
          - generic [ref=e34]: "Total: Rp 65.000"
        - generic [ref=e36]:
          - button "Select topi 4" [ref=e37] [cursor=pointer]
          - img "topi 4" [ref=e42]
          - generic [ref=e43]:
            - paragraph [ref=e44]: topi 4
            - paragraph [ref=e45]: Rp 65.000
            - generic [ref=e46]:
              - button [ref=e47] [cursor=pointer]
              - generic [ref=e49]: "1"
              - button [ref=e50] [cursor=pointer]
          - button "Remove topi 4" [ref=e52] [cursor=pointer]
        - button "ORDER (1)" [ref=e57] [cursor=pointer]
    - contentinfo [ref=e59]:
      - generic [ref=e60]:
        - generic [ref=e61]:
          - generic [ref=e62]:
            - generic [ref=e67]:
              - heading "SmartCap Studio" [level=2] [ref=e68]
              - paragraph [ref=e69]: Crown Your Individuality
            - paragraph [ref=e70]: SmartCap Studio is a premier interactive digital catalog platform curated for premium cap collections.
            - generic [ref=e71]:
              - link "WhatsApp" [ref=e72] [cursor=pointer]:
                - /url: https://wa.me/6281234567890?text=Hello%20SmartCap%20Studio%2C%20I%20would%20like%20to%20inquire%20about..
              - link "Instagram" [ref=e76] [cursor=pointer]:
                - /url: https://instagram.com
          - generic [ref=e79]:
            - heading "Navigation" [level=3] [ref=e80]
            - list [ref=e81]:
              - listitem [ref=e82]:
                - link "Home" [ref=e83] [cursor=pointer]:
                  - /url: /
              - listitem [ref=e84]:
                - link "Catalog" [ref=e85] [cursor=pointer]:
                  - /url: /katalog
              - listitem [ref=e86]:
                - link "About" [ref=e87] [cursor=pointer]:
                  - /url: /#about
              - listitem [ref=e88]:
                - link "Cart" [ref=e89] [cursor=pointer]:
                  - /url: /cart
              - listitem [ref=e90]:
                - link "Admin Login" [ref=e91] [cursor=pointer]:
                  - /url: /login
          - generic [ref=e92]:
            - heading "Contact & Location" [level=3] [ref=e93]
            - generic [ref=e94]:
              - generic [ref=e95]: Jl. Haji Nawir Husadah II, Jakarta, Indonesia
              - generic [ref=e101]: +62 812-3456-7890
        - generic [ref=e106]: © 2026 SmartCap Studio. All rights reserved. Crown Your Individuality.
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { addFromCatalog, cards, cardData, catalog, checkpoint, detail, main, openCart, orderText, quantity, rupiah, total } from './helpers';
  3   | 
  4   | test.use({ channel: 'msedge', video: 'off', viewport: { width: 1440, height: 900 } });
  5   | 
  6   | test('[BB-001] Catalog should persist added item after refresh and navigation @P0', async ({ page }) => {
  7   |   await catalog(page);
  8   |   const item = await addFromCatalog(page);
  9   |   await openCart(page);
  10  |   await expect(page.getByRole('button', { name: `Remove ${item.name}`, exact: true })).toHaveCount(1);
  11  |   await total(page, item.price);
  12  |   await page.reload();
  13  |   await total(page, item.price);
  14  |   await main(page).getByRole('link', { name: 'Back to Catalog' }).click();
  15  |   await expect(page).toHaveURL(/\/katalog$/);
  16  |   await page.goBack();
  17  |   await expect(page.getByRole('button', { name: `Remove ${item.name}`, exact: true })).toHaveCount(1);
  18  |   await total(page, item.price);
  19  | });
  20  | 
  21  | test('[BB-002] Cart should aggregate a rapid double add without duplicate rows @P0', async ({ page }) => {
  22  |   await catalog(page);
  23  |   const item = await cardData(cards(page).first());
  24  |   await cards(page).first().getByRole('button', { name: /Tambah .* ke Keranjang/ }).dblclick();
  25  |   await openCart(page);
  26  |   await expect(page.getByRole('button', { name: `Remove ${item.name}`, exact: true })).toHaveCount(1);
  27  |   await expect(page.getByRole('button', { name: 'ORDER (2)', exact: true })).toBeVisible();
  28  |   await total(page, item.price * 2);
  29  |   await page.reload();
  30  |   await total(page, item.price * 2);
  31  |   await expect(page.getByRole('button', { name: /^Remove / })).toHaveCount(1);
  32  | });
  33  | 
  34  | test('[BB-003] Cart should preserve quantity and total and stop at one @P0', async ({ page }) => {
  35  |   await catalog(page);
  36  |   const item = await addFromCatalog(page);
  37  |   await openCart(page);
  38  |   await quantity(page, 'minus').click();
  39  |   await total(page, item.price);
  40  |   await quantity(page, 'plus').click();
  41  |   await total(page, item.price * 2);
  42  |   await page.reload();
  43  |   await expect(page.getByRole('button', { name: 'ORDER (2)', exact: true })).toBeVisible();
  44  |   await total(page, item.price * 2);
  45  |   await quantity(page, 'minus').click();
  46  |   await total(page, item.price);
  47  | });
  48  | 
  49  | test('[BB-004] Cart should remain empty after final removal and refresh @P0', async ({ page }) => {
  50  |   await catalog(page);
  51  |   const item = await addFromCatalog(page);
  52  |   await openCart(page);
> 53  |   await page.getByRole('button', { name: `Remove ${item.name}`, exact: true }).click();
      |                                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  54  |   await expect(page.getByText('Your Cart is Empty', { exact: true })).toBeVisible();
  55  |   await page.reload();
  56  |   await expect(page.getByText('Your Cart is Empty', { exact: true })).toBeVisible();
  57  |   await expect(page.getByRole('button', { name: /^ORDER/ })).toHaveCount(0);
  58  |   await page.getByRole('link', { name: 'Browse Catalog' }).click();
  59  |   await expect(page).toHaveURL(/\/katalog$/);
  60  |   await page.goBack();
  61  |   await expect(page.getByText('Your Cart is Empty', { exact: true })).toBeVisible();
  62  | });
  63  | 
  64  | test('[BB-005] Cart should order only selected items with correct totals @P0', async ({ page }, info) => {
  65  |   await catalog(page);
  66  |   expect(await cards(page).count(), 'Needs two distinct published products').toBeGreaterThanOrEqual(2);
  67  |   const first = await addFromCatalog(page);
  68  |   const second = await addFromCatalog(page, 1);
  69  |   await openCart(page);
  70  |   await total(page, first.price + second.price);
  71  |   await page.getByRole('button', { name: `Select ${first.name}`, exact: true }).click();
  72  |   await total(page, second.price);
  73  |   const text = await orderText(page, info);
  74  |   expect(text).toContain(second.name);
  75  |   expect(text).not.toContain(first.name);
  76  |   expect(text).toContain(rupiah(second.price));
  77  |   await page.getByRole('button', { name: `Select ${second.name}`, exact: true }).click();
  78  |   await total(page, 0);
  79  |   await expect(page.getByRole('button', { name: /^ORDER/ })).toHaveCount(0);
  80  |   await expect(page.getByRole('button', { name: /^Remove / })).toHaveCount(2);
  81  | });
  82  | 
  83  | test('[BB-006] Detail should carry color quantity and price into cart checkout @P0', async ({ page }, info) => {
  84  |   const item = await detail(page);
  85  |   await expect(main(page).getByText(rupiah(item.price), { exact: true })).toBeVisible();
  86  |   await page.getByRole('button', { name: 'Navy', exact: true }).click();
  87  |   await quantity(page, 'plus').click();
  88  |   const direct = new URL((await page.getByRole('link', { name: 'Order on WhatsApp' }).getAttribute('href'))!);
  89  |   const directText = direct.searchParams.get('text')!.replace(/\u00a0/g, ' ');
  90  |   expect(directText).toContain(item.name);
  91  |   expect(directText).toContain('Navy');
  92  |   expect(directText).toContain('2 pcs');
  93  |   expect(directText).toContain(rupiah(item.price * 2));
  94  |   await page.getByRole('button', { name: 'Add to Cart', exact: true }).first().click();
  95  |   await openCart(page);
  96  |   await total(page, item.price * 2);
  97  |   await page.reload();
  98  |   await total(page, item.price * 2);
  99  |   const text = await orderText(page, info);
  100 |   expect(text).toContain(`${item.name} (Navy) x2`);
  101 |   expect(text).toContain(rupiah(item.price * 2));
  102 | });
  103 | 
  104 | test('[BB-007] Cart should preserve two distinct colors of the same product @P0', async ({ page }, info) => {
  105 |   const item = await detail(page);
  106 |   await page.getByRole('button', { name: 'Navy', exact: true }).click();
  107 |   await page.getByRole('button', { name: 'Add to Cart', exact: true }).first().click();
  108 |   await expect(page.getByRole('link', { name: 'View Cart', exact: true })).toContainText('1');
  109 |   await page.getByRole('button', { name: 'Cream', exact: true }).click();
  110 |   await expect(page.getByRole('button', { name: 'Add to Cart', exact: true }).first()).toBeEnabled();
  111 |   await page.getByRole('button', { name: 'Add to Cart', exact: true }).first().click();
  112 |   await openCart(page);
  113 |   await total(page, item.price * 2);
  114 |   await checkpoint(page, info, 'two-colors-before-refresh');
  115 |   await page.reload();
  116 |   const text = await orderText(page, info);
  117 |   expect.soft(text).toContain(`${item.name} (Navy) x1`);
  118 |   expect.soft(text).toContain(`${item.name} (Cream) x1`);
  119 |   expect.soft(await page.getByRole('button', { name: /^Remove / }).count()).toBe(2);
  120 | });
  121 | 
  122 | test('[BB-008] Cart should show the selected color before opening checkout @P1', async ({ page }, info) => {
  123 |   await detail(page);
  124 |   await page.getByRole('button', { name: 'Navy', exact: true }).click();
  125 |   await page.getByRole('button', { name: 'Add to Cart', exact: true }).first().click();
  126 |   await openCart(page);
  127 |   await checkpoint(page, info, 'cart-selected-color');
  128 |   await expect(main(page)).toContainText('Navy');
  129 | });
  130 | 
  131 | test('[BB-009] Related product add should retain the related product identity @P0', async ({ page }, info) => {
  132 |   const original = await detail(page);
  133 |   const related = cards(page).first();
  134 |   const name = (await related.getByRole('heading', { level: 3 }).innerText()).trim();
  135 |   expect(name).not.toBe(original.name);
  136 |   await related.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  137 |   await openCart(page);
  138 |   await expect(page.getByRole('button', { name: `Remove ${name}`, exact: true })).toHaveCount(1);
  139 |   const text = await orderText(page, info);
  140 |   expect(text).toContain(name);
  141 |   expect(text).not.toContain(original.name);
  142 | });
  143 | 
  144 | test('[BB-010] Catalog detail and deep link should show consistent product data @P1', async ({ page }) => {
  145 |   await catalog(page);
  146 |   const items = [];
  147 |   for (const card of await cards(page).all()) items.push(await cardData(card));
  148 |   for (const item of items) {
  149 |     await page.goto(item.href);
  150 |     await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.name);
  151 |     await expect(main(page).getByText(rupiah(item.price), { exact: true })).toBeVisible();
  152 |     await page.reload();
  153 |     await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.name);
```