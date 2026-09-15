# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blackbox\business-flow.spec.ts >> [BB-009] Related product add should retain catalog identity and price @P0
- Location: qa\automation\blackbox\business-flow.spec.ts:131:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Rp 45.000"
Received string:    "Hello SmartCap Studio, I would like to order from Cart:·
1. topi 3 (Black) x1 - Rp 149.000·
Total (1 Items): Rp 149.000"
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('main').getByText('Total: Rp 45.000', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "soft toBeVisible" getByRole('main').getByText('Total: Rp 45.000', { exact: true }) with timeout 5000ms
  - waiting for getByRole('main').getByText('Total: Rp 45.000', { exact: true })

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
  - button "(1)"
  - text: "Total: Rp 149.000"
  - button "Select topi 3"
  - img "topi 3"
  - paragraph: topi 3
  - paragraph: Rp 149.000
  - button
  - text: "1"
  - button
  - button "Remove topi 3"
  - button "ORDER (1)"
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

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('main').getByText('Total: Rp 45.000', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "soft toBeVisible" getByRole('main').getByText('Total: Rp 45.000', { exact: true }) with timeout 5000ms
  - waiting for getByRole('main').getByText('Total: Rp 45.000', { exact: true })

```

```yaml
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
  - button "(1)"
  - text: "Total: Rp 149.000"
  - button "Select topi 3"
  - img "topi 3"
  - paragraph: topi 3
  - paragraph: Rp 149.000
  - button
  - text: "1"
  - button
  - button "Remove topi 3"
  - button "ORDER (1)"
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
- alert
```

# Test source

```ts
  52  |   await openCart(page);
  53  |   await page.getByRole('button', { name: `Remove ${item.name}`, exact: true }).click();
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
  94  |   await detailAdd(page).click();
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
  107 |   await detailAdd(page).click();
  108 |   await expect(page.getByRole('link', { name: 'View Cart', exact: true })).toContainText('1');
  109 |   await page.getByRole('button', { name: 'Cream', exact: true }).click();
  110 |   await expect(detailAdd(page)).toBeEnabled();
  111 |   await detailAdd(page).click();
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
  125 |   await detailAdd(page).click();
  126 |   await openCart(page);
  127 |   await checkpoint(page, info, 'cart-selected-color');
  128 |   await expect(main(page)).toContainText('Navy');
  129 | });
  130 | 
  131 | test('[BB-009] Related product add should retain catalog identity and price @P0', async ({ page }, info) => {
  132 |   await catalog(page);
  133 |   const catalogItems = [];
  134 |   for (const card of await cards(page).all()) catalogItems.push(await cardData(card));
  135 |   const original = await detail(page);
  136 |   const related = cards(page).first();
  137 |   const name = (await related.getByRole('heading', { level: 3 }).textContent())!.trim();
  138 |   const expectedItem = catalogItems.find(item => item.name === name)!;
  139 |   expect(expectedItem, 'Related item has a matching catalog card').toBeTruthy();
  140 |   expect(name).not.toBe(original.name);
  141 |   await related.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  142 |   await openCart(page);
  143 |   await expect(page.getByRole('button', { name: `Remove ${name}`, exact: true })).toHaveCount(1);
  144 |   await checkpoint(page, info, 'related-cart-price');
  145 |   await info.attach('catalog-price', { body: JSON.stringify(expectedItem), contentType: 'application/json' });
  146 |   const text = await orderText(page, info);
  147 |   expect(text).toContain(name);
  148 |   expect(text).not.toContain(original.name);
  149 |   expect.soft(text).toContain(rupiah(expectedItem.price));
  150 |   await expect.soft(main(page).getByText(`Total: ${rupiah(expectedItem.price)}`, { exact: true })).toBeVisible();
  151 |   await page.reload();
> 152 |   await expect.soft(main(page).getByText(`Total: ${rupiah(expectedItem.price)}`, { exact: true })).toBeVisible();
      |                                                                                                    ^ Error: expect(locator).toBeVisible() failed
  153 | });
  154 | 
  155 | test('[BB-010] Catalog detail and deep link should show consistent product data @P1', async ({ page }) => {
  156 |   await catalog(page);
  157 |   const items = [];
  158 |   for (const card of await cards(page).all()) items.push(await cardData(card));
  159 |   for (const item of items) {
  160 |     await page.goto(item.href);
  161 |     await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.name);
  162 |     await expect(main(page).getByText(rupiah(item.price), { exact: true })).toBeVisible();
  163 |     await page.reload();
  164 |     await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.name);
  165 |     await expect(main(page).getByText(rupiah(item.price), { exact: true })).toBeVisible();
  166 |   }
  167 | });
  168 | 
```