import { test, expect } from '@playwright/test';
import { cards, catalog, checkpoint, detail, main, money, quantity } from './helpers';

test.use({ channel: 'msedge', video: 'off', viewport: { width: 1440, height: 900 } });

test('[BB-011] Search should match exact partial and case-insensitive names and clear @P1', async ({ page }) => {
  await catalog(page);
  const names = await cards(page).getByRole('heading', { level: 3 }).allTextContents();
  const search = page.getByRole('textbox', { name: 'Search', exact: true });
  for (const query of [names[0], names[0].slice(0, 3), names[0].toUpperCase()]) {
    await search.fill(query);
    const expected = names.filter(name => name.toLowerCase().includes(query.toLowerCase()));
    await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText(expected);
  }
  await search.fill('');
  await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText(names);
});

test('[BB-012] Search should recover after empty results special characters and long input @P1', async ({ page }) => {
  await catalog(page);
  const count = await cards(page).count();
  const search = page.getByRole('textbox', { name: 'Search', exact: true });
  for (const query of ['QA-no-match-20260915', '<>&"\' % 🧢', 'QA'.repeat(250)]) {
    await search.fill(query);
    await expect(page.getByText('No caps found', { exact: true })).toBeVisible();
    await expect(cards(page)).toHaveCount(0);
    await search.fill('');
    await expect(cards(page)).toHaveCount(count);
  }
  await search.fill('   ');
  // Requirement for trimming is unspecified; assert recoverability only.
  await search.fill('');
  await expect(cards(page)).toHaveCount(count);
});

test('[BB-013] Sort should order visible prices names and restore latest order @P1', async ({ page }) => {
  await catalog(page);
  const original = await cards(page).getByRole('heading', { level: 3 }).allTextContents();
  const originalPrices = (await cards(page).locator('p').allTextContents()).map(money);
  for (const option of ['Price: Low to High', 'Price: High to Low', 'Name: A-Z', 'Latest']) {
    await page.getByRole('button', { name: 'Urutkan Produk' }).click();
    await page.getByRole('button', { name: option, exact: true }).click();
    if (option.startsWith('Price')) {
      const expected = [...originalPrices].sort((a,b) => option.includes('Low to High') ? a-b : b-a);
      await expect.poll(async () => (await cards(page).locator('p').allTextContents()).map(money)).toEqual(expected);
    } else {
      const expected = option === 'Latest' ? original : [...original].sort((a,b) => a.localeCompare(b));
      await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText(expected);
    }
  }
  await page.getByRole('textbox', { name: 'Search' }).fill(original[0]);
  await page.getByRole('button', { name: 'Urutkan Produk' }).click();
  await page.getByRole('button', { name: 'Price: Low to High', exact: true }).click();
  await expect(cards(page).getByRole('heading', { level: 3 })).toHaveText([original[0]]);
});

test('[BB-014] Public navigation should support home about catalog and history @P1', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('CROWN YOUR INDIVIDUALITY.');
  await page.getByRole('link', { name: 'Discover More', exact: true }).click();
  await expect(page).toHaveURL(/\/katalog$/);
  await expect(page.getByRole('heading', { name: 'OUR CATALOG' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('CROWN YOUR INDIVIDUALITY.');
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'OUR CATALOG' })).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CRAFTING THE FUTURE OF HEADWEAR.');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CRAFTING THE FUTURE OF HEADWEAR.');
  await page.getByRole('link', { name: 'EXPLORE COLLECTION', exact: true }).click();
  await expect(page).toHaveURL(/\/katalog$/);
});

test('[BB-015] Footer About should reach the About content like the header @P2', async ({ page }, info) => {
  await page.goto('/katalog');
  await page.getByRole('contentinfo').getByRole('link', { name: 'About', exact: true }).click();
  await expect(page).toHaveURL(/(?:\/about|\/#about)$/);
  await checkpoint(page, info, 'footer-about-destination');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CRAFTING THE FUTURE OF HEADWEAR.');
});

test('[BB-016] Invalid product URL should show not found and recover to catalog @P1', async ({ page }) => {
  await page.goto('/produk/qa-no-such-product-20260915');
  await expect(page.getByRole('heading', { name: 'Product Not Found' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add to Cart', exact: true })).toHaveCount(0);
  await main(page).getByRole('link', { name: 'Back to Catalog', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'OUR CATALOG' })).toBeVisible();
});

test('[BB-017] Login should reject required malformed and whitespace email @P1', async ({ page }) => {
  await page.goto('/login');
  const email = page.getByRole('textbox', { name: 'Email', exact: true });
  const password = page.getByRole('textbox', { name: 'Password', exact: true });
  const submit = page.getByRole('button', { name: 'Masuk Dashboard' });
  const requests: string[] = [];
  page.on('request', r => { if (r.method() === 'POST') requests.push(new URL(r.url()).pathname); });
  await submit.click();
  expect(await email.evaluate((n: HTMLInputElement) => n.validity.valueMissing)).toBe(true);
  for (const value of ['not-an-email', '   ']) {
    await email.fill(value);
    await password.fill('QA-invalid-only');
    await submit.click();
    expect(await email.evaluate((n: HTMLInputElement) => n.checkValidity())).toBe(false);
    await expect(page).toHaveURL(/\/login$/);
  }
  await email.fill('qa.blackbox@example.invalid');
  await password.fill('');
  await submit.click();
  expect(await password.evaluate((n: HTMLInputElement) => n.validity.valueMissing)).toBe(true);
  expect(requests).toEqual([]);
});

test('[BB-018] Login should allow password reveal and conceal without changing value @P1', async ({ page }) => {
  await page.goto('/login');
  const password = page.getByRole('textbox', { name: 'Password', exact: true });
  await password.fill('QA-display-only');
  await expect(password).toHaveAttribute('type', 'password');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await expect(password).toHaveValue('QA-display-only');
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(password).toHaveAttribute('type', 'password');
  await expect(password).toHaveValue('QA-display-only');
});

test('[BB-019] Login should reject invalid credentials and permit retry @P0', async ({ page }, info) => {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('qa.blackbox.20260915@example.invalid');
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('QA-invalid-only');
  for (let attempt=0; attempt<2; attempt++) {
    const responsePromise = page.waitForResponse(r => r.request().method() === 'POST' && new URL(r.url()).pathname === '/api/auth/login');
    await page.getByRole('button', { name: 'Masuk Dashboard' }).click();
    const response = await responsePromise;
    await info.attach(`login-attempt-${attempt+1}`, { body: JSON.stringify({ path: '/api/auth/login', status: response.status() }), contentType: 'application/json' });
    expect(response.status()).toBe(401);
    await expect(page.getByText('Email atau password salah.', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Masuk Dashboard' })).toBeEnabled();
    await expect(page).toHaveURL(/\/login$/);
  }
});

test('[BB-020] Protected admin should send an anonymous visitor to login @P0', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/login\?from=/);
  await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Masuk Dashboard' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to Storefront' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('CROWN YOUR INDIVIDUALITY.');
});

test('[BB-021] Detail quantity should stop at one and thumbnail should remain usable @P1', async ({ page }) => {
  await detail(page);
  await quantity(page, 'minus').click();
  let href = new URL((await page.getByRole('link', { name: 'Order on WhatsApp' }).getAttribute('href'))!);
  expect(href.searchParams.get('text')).toContain('Jumlah: 1 pcs');
  await quantity(page, 'plus').dblclick();
  href = new URL((await page.getByRole('link', { name: 'Order on WhatsApp' }).getAttribute('href'))!);
  expect(href.searchParams.get('text')).toContain('Jumlah: 3 pcs');
  await page.getByRole('button', { name: 'Thumbnail 1', exact: true }).click();
  const name = await page.getByRole('heading', { level: 1 }).textContent();
  await expect(main(page).getByRole('img', { name: name!, exact: true })).toBeVisible();
});

test('[BB-022] Quantity controls should expose their action to assistive technology @P3', async ({ page }, info) => {
  await detail(page);
  await checkpoint(page, info, 'unnamed-quantity-controls');
  await expect.soft(quantity(page, 'plus')).toHaveAccessibleName(/.+/);
  await expect.soft(quantity(page, 'minus')).toHaveAccessibleName(/.+/);
});
