# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blackbox\navigation-validation.spec.ts >> [BB-014] Public navigation should support home about catalog and history @P1
- Location: qa\automation\blackbox\navigation-validation.spec.ts:57:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByRole('heading', { level: 1 })
Expected: "CROWN YOUR INDIVIDUALITY."
Received: "CROWN YOURINDIVIDUALITY."
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByRole('heading', { level: 1 }) with timeout 5000ms
  - waiting for getByRole('heading', { level: 1 })
    14 × locator resolved to <h1 class="hidden lg:block font-sans text-5xl lg:text-[4.5rem] font-black uppercase leading-[1.25] lg:leading-[1.28] tracking-[0.12em] text-[#1B1C1E] space-y-3">…</h1>
       - unexpected value "CROWN YOURINDIVIDUALITY."

```

```yaml
- heading "CROWN YOUR INDIVIDUALITY." [level=1]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { cards, catalog, checkpoint, detail, main, money, quantity } from './helpers';
  3   | 
  4   | test.use({ channel: 'msedge', video: 'off', viewport: { width: 1440, height: 900 } });
  5   | 
  6   | test('[BB-011] Search should match exact partial and case-insensitive names and clear @P1', async ({ page }) => {
  7   |   await catalog(page);
  8   |   const names = await cards(page).getByRole('heading', { level: 3 }).allTextContents();
  9   |   const search = page.getByRole('textbox', { name: 'Search', exact: true });
  10  |   for (const query of [names[0], names[0].slice(0, 3), names[0].toUpperCase()]) {
  11  |     await search.fill(query);
  12  |     const expected = names.filter(name => name.toLowerCase().includes(query.toLowerCase()));
  13  |     await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText(expected);
  14  |   }
  15  |   await search.fill('');
  16  |   await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText(names);
  17  | });
  18  | 
  19  | test('[BB-012] Search should recover after empty results special characters and long input @P1', async ({ page }) => {
  20  |   await catalog(page);
  21  |   const count = await cards(page).count();
  22  |   const search = page.getByRole('textbox', { name: 'Search', exact: true });
  23  |   for (const query of ['QA-no-match-20260915', '<>&"\' % 🧢', 'QA'.repeat(250)]) {
  24  |     await search.fill(query);
  25  |     await expect(page.getByText('No caps found', { exact: true })).toBeVisible();
  26  |     await expect(cards(page)).toHaveCount(0);
  27  |     await search.fill('');
  28  |     await expect(cards(page)).toHaveCount(count);
  29  |   }
  30  |   await search.fill('   ');
  31  |   // Requirement for trimming is unspecified; assert recoverability only.
  32  |   await search.fill('');
  33  |   await expect(cards(page)).toHaveCount(count);
  34  | });
  35  | 
  36  | test('[BB-013] Sort should order visible prices names and restore latest order @P1', async ({ page }) => {
  37  |   await catalog(page);
  38  |   const original = await cards(page).getByRole('heading', { level: 3 }).allTextContents();
  39  |   const originalPrices = (await cards(page).locator('p').allTextContents()).map(money);
  40  |   for (const option of ['Price: Low to High', 'Price: High to Low', 'Name: A-Z', 'Latest']) {
  41  |     await page.getByRole('button', { name: 'Urutkan Produk' }).click();
  42  |     await page.getByRole('button', { name: option, exact: true }).click();
  43  |     if (option.startsWith('Price')) {
  44  |       const expected = [...originalPrices].sort((a,b) => option.includes('Low to High') ? a-b : b-a);
  45  |       await expect.poll(async () => (await cards(page).locator('p').allTextContents()).map(money)).toEqual(expected);
  46  |     } else {
  47  |       const expected = option === 'Latest' ? original : [...original].sort((a,b) => a.localeCompare(b));
  48  |       await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText(expected);
  49  |     }
  50  |   }
  51  |   await page.getByRole('textbox', { name: 'Search' }).fill(original[0]);
  52  |   await page.getByRole('button', { name: 'Urutkan Produk' }).click();
  53  |   await page.getByRole('button', { name: 'Price: Low to High', exact: true }).click();
  54  |   await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText([original[0]]);
  55  | });
  56  | 
  57  | test('[BB-014] Public navigation should support home about catalog and history @P1', async ({ page }) => {
  58  |   await page.goto('/');
> 59  |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('CROWN YOUR INDIVIDUALITY.');
      |                                                         ^ Error: expect(locator).toHaveText(expected) failed
  60  |   await page.getByRole('link', { name: 'Discover More', exact: true }).click();
  61  |   await expect(page).toHaveURL(/\/katalog$/);
  62  |   await expect(page.getByRole('heading', { name: 'OUR CATALOG' })).toBeVisible();
  63  |   await page.goBack();
  64  |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('CROWN YOUR INDIVIDUALITY.');
  65  |   await page.goForward();
  66  |   await expect(page.getByRole('heading', { name: 'OUR CATALOG' })).toBeVisible();
  67  |   await page.getByRole('banner').getByRole('link', { name: 'About', exact: true }).click();
  68  |   await expect(page).toHaveURL(/\/about$/);
  69  |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('CRAFTING THE FUTURE OF HEADWEAR.');
  70  |   await page.reload();
  71  |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('CRAFTING THE FUTURE OF HEADWEAR.');
  72  |   await page.getByRole('link', { name: 'EXPLORE COLLECTION', exact: true }).click();
  73  |   await expect(page).toHaveURL(/\/katalog$/);
  74  | });
  75  | 
  76  | test('[BB-015] Footer About should reach the About content like the header @P2', async ({ page }, info) => {
  77  |   await page.goto('/katalog');
  78  |   await page.getByRole('contentinfo').getByRole('link', { name: 'About', exact: true }).click();
  79  |   await expect(page).toHaveURL(/(?:\/about|\/#about)$/);
  80  |   await checkpoint(page, info, 'footer-about-destination');
  81  |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('CRAFTING THE FUTURE OF HEADWEAR.');
  82  | });
  83  | 
  84  | test('[BB-016] Invalid product URL should show not found and recover to catalog @P1', async ({ page }) => {
  85  |   await page.goto('/produk/qa-no-such-product-20260915');
  86  |   await expect(page.getByRole('heading', { name: 'Product Not Found' })).toBeVisible();
  87  |   await expect(page.getByRole('button', { name: 'Add to Cart', exact: true })).toHaveCount(0);
  88  |   await main(page).getByRole('link', { name: 'Back to Catalog', exact: true }).click();
  89  |   await expect(page.getByRole('heading', { name: 'OUR CATALOG' })).toBeVisible();
  90  | });
  91  | 
  92  | test('[BB-017] Login should reject required malformed and whitespace email @P1', async ({ page }) => {
  93  |   await page.goto('/login');
  94  |   const email = page.getByRole('textbox', { name: 'Email', exact: true });
  95  |   const password = page.getByRole('textbox', { name: 'Password', exact: true });
  96  |   const submit = page.getByRole('button', { name: 'Masuk Dashboard' });
  97  |   const requests: string[] = [];
  98  |   page.on('request', r => { if (r.method() === 'POST') requests.push(new URL(r.url()).pathname); });
  99  |   await submit.click();
  100 |   expect(await email.evaluate((n: HTMLInputElement) => n.validity.valueMissing)).toBe(true);
  101 |   for (const value of ['not-an-email', '   ']) {
  102 |     await email.fill(value);
  103 |     await password.fill('QA-invalid-only');
  104 |     await submit.click();
  105 |     expect(await email.evaluate((n: HTMLInputElement) => n.checkValidity())).toBe(false);
  106 |     await expect(page).toHaveURL(/\/login$/);
  107 |   }
  108 |   await email.fill('qa.blackbox@example.invalid');
  109 |   await password.fill('');
  110 |   await submit.click();
  111 |   expect(await password.evaluate((n: HTMLInputElement) => n.validity.valueMissing)).toBe(true);
  112 |   expect(requests).toEqual([]);
  113 | });
  114 | 
  115 | test('[BB-018] Login should allow password reveal and conceal without changing value @P1', async ({ page }) => {
  116 |   await page.goto('/login');
  117 |   const password = page.getByRole('textbox', { name: 'Password', exact: true });
  118 |   await password.fill('QA-display-only');
  119 |   await expect(password).toHaveAttribute('type', 'password');
  120 |   await page.getByRole('button', { name: 'Show password' }).click();
  121 |   await expect(password).toHaveAttribute('type', 'text');
  122 |   await expect(password).toHaveValue('QA-display-only');
  123 |   await page.getByRole('button', { name: 'Hide password' }).click();
  124 |   await expect(password).toHaveAttribute('type', 'password');
  125 |   await expect(password).toHaveValue('QA-display-only');
  126 | });
  127 | 
  128 | test('[BB-019] Login should reject invalid credentials and permit retry @P0', async ({ page }, info) => {
  129 |   await page.goto('/login');
  130 |   await page.getByRole('textbox', { name: 'Email', exact: true }).fill('qa.blackbox.20260915@example.invalid');
  131 |   await page.getByRole('textbox', { name: 'Password', exact: true }).fill('QA-invalid-only');
  132 |   for (let attempt=0; attempt<2; attempt++) {
  133 |     const responsePromise = page.waitForResponse(r => r.request().method() === 'POST' && new URL(r.url()).pathname === '/api/auth/login');
  134 |     await page.getByRole('button', { name: 'Masuk Dashboard' }).click();
  135 |     const response = await responsePromise;
  136 |     await info.attach(`login-attempt-${attempt+1}`, { body: JSON.stringify({ path: '/api/auth/login', status: response.status() }), contentType: 'application/json' });
  137 |     expect(response.status()).toBe(401);
  138 |     await expect(page.getByText('Email atau password salah.', { exact: true })).toBeVisible();
  139 |     await expect(page.getByRole('button', { name: 'Masuk Dashboard' })).toBeEnabled();
  140 |     await expect(page).toHaveURL(/\/login$/);
  141 |   }
  142 | });
  143 | 
  144 | test('[BB-020] Protected admin should send an anonymous visitor to login @P0', async ({ page }) => {
  145 |   await page.goto('/admin');
  146 |   await expect(page).toHaveURL(/\/login\?from=/);
  147 |   await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
  148 |   await expect(page.getByRole('button', { name: 'Masuk Dashboard' })).toBeVisible();
  149 |   await page.reload();
  150 |   await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
  151 |   await page.getByRole('link', { name: 'Back to Storefront' }).click();
  152 |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('CROWN YOUR INDIVIDUALITY.');
  153 | });
  154 | 
  155 | test('[BB-021] Detail quantity should stop at one and thumbnail should remain usable @P1', async ({ page }) => {
  156 |   await detail(page);
  157 |   await quantity(page, 'minus').click();
  158 |   let href = new URL((await page.getByRole('link', { name: 'Order on WhatsApp' }).getAttribute('href'))!);
  159 |   expect(href.searchParams.get('text')).toContain('Jumlah: 1 pcs');
```