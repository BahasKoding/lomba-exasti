# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blackbox\business-flow.spec.ts >> [BB-008] Cart should show the selected color before opening checkout @P1
- Location: qa\automation\blackbox\business-flow.spec.ts:122:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('main')
Expected substring: "Navy"
Received string:    "YOUR CART(1)Total: Rp 65.000topi 4Rp 65.0001ORDER (1)"
Timeout: 5000ms

Call log:
  - Expect "toContainText" getByRole('main') with timeout 5000ms
  - waiting for getByRole('main')
    14 × locator resolved to <main class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 min-h-[80vh] pb-32">…</main>
       - unexpected value "YOUR CART(1)Total: Rp 65.000topi 4Rp 65.0001ORDER (1)"

```

```yaml
- main:
  - link "Back to Catalog":
    - /url: /katalog
  - heading "YOUR CART" [level=1]
  - button "(1)"
  - text: "Total: Rp 65.000"
  - button "Select topi 4"
  - img "topi 4"
  - paragraph: topi 4
  - paragraph: Rp 65.000
  - button
  - text: "1"
  - button
  - button "Remove topi 4"
  - button "ORDER (1)"
```

# Test source

```ts
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
> 128 |   await expect(main(page)).toContainText('Navy');
      |                            ^ Error: expect(locator).toContainText(expected) failed
  129 | });
  130 | 
  131 | test('[BB-009] Related product add should retain the related product identity @P0', async ({ page }, info) => {
  132 |   const original = await detail(page);
  133 |   const related = cards(page).first();
  134 |   const name = (await related.getByRole('heading', { level: 3 }).textContent())!.trim();
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
  154 |     await expect(main(page).getByText(rupiah(item.price), { exact: true })).toBeVisible();
  155 |   }
  156 | });
  157 | 
```