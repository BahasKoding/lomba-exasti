# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blackbox\navigation-validation.spec.ts >> [BB-020] Protected admin should send an anonymous visitor to login @P0
- Location: qa\automation\blackbox\navigation-validation.spec.ts:144:5

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
    3 × locator resolved to <h1 class="text-3xl font-black uppercase tracking-wider text-[#1B1C1E] sm:text-4xl">Welcome!</h1>
      - unexpected value "Welcome!"
    11 × locator resolved to <h1 class="hidden lg:block font-sans text-5xl lg:text-[4.5rem] font-black uppercase leading-[1.25] lg:leading-[1.28] tracking-[0.12em] text-[#1B1C1E] space-y-3">…</h1>
       - unexpected value "CROWN YOURINDIVIDUALITY."

```

```yaml
- heading "CROWN YOUR INDIVIDUALITY." [level=1]
```

# Test source

```ts
  52  |   await page.getByRole('button', { name: 'Urutkan Produk' }).click();
  53  |   await page.getByRole('button', { name: 'Price: Low to High', exact: true }).click();
  54  |   await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText([original[0]]);
  55  | });
  56  | 
  57  | test('[BB-014] Public navigation should support home about catalog and history @P1', async ({ page }) => {
  58  |   await page.goto('/');
  59  |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('CROWN YOUR INDIVIDUALITY.');
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
> 152 |   await expect(page.getByRole('heading', { level: 1 })).toHaveText('CROWN YOUR INDIVIDUALITY.');
      |                                                         ^ Error: expect(locator).toHaveText(expected) failed
  153 | });
  154 | 
  155 | test('[BB-021] Detail quantity should stop at one and thumbnail should remain usable @P1', async ({ page }) => {
  156 |   await detail(page);
  157 |   await quantity(page, 'minus').click();
  158 |   let href = new URL((await page.getByRole('link', { name: 'Order on WhatsApp' }).getAttribute('href'))!);
  159 |   expect(href.searchParams.get('text')).toContain('Jumlah: 1 pcs');
  160 |   await quantity(page, 'plus').dblclick();
  161 |   href = new URL((await page.getByRole('link', { name: 'Order on WhatsApp' }).getAttribute('href'))!);
  162 |   expect(href.searchParams.get('text')).toContain('Jumlah: 3 pcs');
  163 |   await page.getByRole('button', { name: 'Thumbnail 1', exact: true }).click();
  164 |   const name = await page.getByRole('heading', { level: 1 }).textContent();
  165 |   await expect(main(page).getByRole('img', { name: name!, exact: true })).toBeVisible();
  166 | });
  167 | 
  168 | test('[BB-022] Quantity controls should expose their action to assistive technology @P3', async ({ page }, info) => {
  169 |   await detail(page);
  170 |   await checkpoint(page, info, 'unnamed-quantity-controls');
  171 |   await expect.soft(quantity(page, 'plus')).toHaveAccessibleName(/.+/);
  172 |   await expect.soft(quantity(page, 'minus')).toHaveAccessibleName(/.+/);
  173 | });
  174 | 
```