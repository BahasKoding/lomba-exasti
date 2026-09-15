import { test, expect } from '@playwright/test';
import { addFromCatalog, cards, cardData, catalog, checkpoint, detail, detailAdd, main, openCart, orderText, quantity, rupiah, total } from './helpers';

test.use({ channel: 'msedge', video: 'off', viewport: { width: 1440, height: 900 } });

test('[BB-001] Catalog should persist added item after refresh and navigation @P0', async ({ page }) => {
  await catalog(page);
  const item = await addFromCatalog(page);
  await openCart(page);
  await expect(page.getByRole('button', { name: `Remove ${item.name}`, exact: true })).toHaveCount(1);
  await total(page, item.price);
  await page.reload();
  await total(page, item.price);
  await main(page).getByRole('link', { name: 'Back to Catalog' }).click();
  await expect(page).toHaveURL(/\/katalog$/);
  await page.goBack();
  await expect(page.getByRole('button', { name: `Remove ${item.name}`, exact: true })).toHaveCount(1);
  await total(page, item.price);
});

test('[BB-002] Cart should aggregate a rapid double add without duplicate rows @P0', async ({ page }) => {
  await catalog(page);
  const item = await cardData(cards(page).first());
  await cards(page).first().getByRole('button', { name: /Tambah .* ke Keranjang/ }).dblclick();
  await openCart(page);
  await expect(page.getByRole('button', { name: `Remove ${item.name}`, exact: true })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'ORDER (2)', exact: true })).toBeVisible();
  await total(page, item.price * 2);
  await page.reload();
  await total(page, item.price * 2);
  await expect(page.getByRole('button', { name: /^Remove / })).toHaveCount(1);
});

test('[BB-003] Cart should preserve quantity and total and stop at one @P0', async ({ page }) => {
  await catalog(page);
  const item = await addFromCatalog(page);
  await openCart(page);
  await quantity(page, 'minus').click();
  await total(page, item.price);
  await quantity(page, 'plus').click();
  await total(page, item.price * 2);
  await page.reload();
  await expect(page.getByRole('button', { name: 'ORDER (2)', exact: true })).toBeVisible();
  await total(page, item.price * 2);
  await quantity(page, 'minus').click();
  await total(page, item.price);
});

test('[BB-004] Cart should remain empty after final removal and refresh @P0', async ({ page }) => {
  await catalog(page);
  const item = await addFromCatalog(page);
  await openCart(page);
  await page.getByRole('button', { name: `Remove ${item.name}`, exact: true }).click();
  await expect(page.getByText('Your Cart is Empty', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Your Cart is Empty', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /^ORDER/ })).toHaveCount(0);
  await page.getByRole('link', { name: 'Browse Catalog' }).click();
  await expect(page).toHaveURL(/\/katalog$/);
  await page.goBack();
  await expect(page.getByText('Your Cart is Empty', { exact: true })).toBeVisible();
});

test('[BB-005] Cart should order only selected items with correct totals @P0', async ({ page }, info) => {
  await catalog(page);
  expect(await cards(page).count(), 'Needs two distinct published products').toBeGreaterThanOrEqual(2);
  const first = await addFromCatalog(page);
  const second = await addFromCatalog(page, 1);
  await openCart(page);
  await total(page, first.price + second.price);
  await page.getByRole('button', { name: `Select ${first.name}`, exact: true }).click();
  await total(page, second.price);
  const text = await orderText(page, info);
  expect(text).toContain(second.name);
  expect(text).not.toContain(first.name);
  expect(text).toContain(rupiah(second.price));
  await page.getByRole('button', { name: `Select ${second.name}`, exact: true }).click();
  await total(page, 0);
  await expect(page.getByRole('button', { name: /^ORDER/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^Remove / })).toHaveCount(2);
});

test('[BB-006] Detail should carry color quantity and price into cart checkout @P0', async ({ page }, info) => {
  const item = await detail(page);
  await expect(main(page).getByText(rupiah(item.price), { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Navy', exact: true }).click();
  await quantity(page, 'plus').click();
  const direct = new URL((await page.getByRole('link', { name: 'Order on WhatsApp' }).getAttribute('href'))!);
  const directText = direct.searchParams.get('text')!.replace(/\u00a0/g, ' ');
  expect(directText).toContain(item.name);
  expect(directText).toContain('Navy');
  expect(directText).toContain('2 pcs');
  expect(directText).toContain(rupiah(item.price * 2));
  await detailAdd(page).click();
  await openCart(page);
  await total(page, item.price * 2);
  await page.reload();
  await total(page, item.price * 2);
  const text = await orderText(page, info);
  expect(text).toContain(`${item.name} (Navy) x2`);
  expect(text).toContain(rupiah(item.price * 2));
});

test('[BB-007] Cart should preserve two distinct colors of the same product @P0', async ({ page }, info) => {
  const item = await detail(page);
  await page.getByRole('button', { name: 'Navy', exact: true }).click();
  await detailAdd(page).click();
  await expect(page.getByRole('link', { name: 'View Cart', exact: true })).toContainText('1');
  await page.getByRole('button', { name: 'Cream', exact: true }).click();
  await expect(detailAdd(page)).toBeEnabled();
  await detailAdd(page).click();
  await openCart(page);
  await total(page, item.price * 2);
  await checkpoint(page, info, 'two-colors-before-refresh');
  await page.reload();
  const text = await orderText(page, info);
  expect.soft(text).toContain(`${item.name} (Navy) x1`);
  expect.soft(text).toContain(`${item.name} (Cream) x1`);
  expect.soft(await page.getByRole('button', { name: /^Remove / }).count()).toBe(2);
});

test('[BB-008] Cart should show the selected color before opening checkout @P1', async ({ page }, info) => {
  await detail(page);
  await page.getByRole('button', { name: 'Navy', exact: true }).click();
  await detailAdd(page).click();
  await openCart(page);
  await checkpoint(page, info, 'cart-selected-color');
  await expect(main(page)).toContainText('Navy');
});

test('[BB-009] Related product add should retain catalog identity and price @P0', async ({ page }, info) => {
  await catalog(page);
  const catalogItems = [];
  for (const card of await cards(page).all()) catalogItems.push(await cardData(card));
  const original = await detail(page);
  const related = cards(page).first();
  const name = (await related.getByRole('heading', { level: 3 }).textContent())!.trim();
  const expectedItem = catalogItems.find(item => item.name === name)!;
  expect(expectedItem, 'Related item has a matching catalog card').toBeTruthy();
  expect(name).not.toBe(original.name);
  await related.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  await openCart(page);
  await expect(page.getByRole('button', { name: `Remove ${name}`, exact: true })).toHaveCount(1);
  await checkpoint(page, info, 'related-cart-price');
  await info.attach('catalog-price', { body: JSON.stringify(expectedItem), contentType: 'application/json' });
  const text = await orderText(page, info);
  expect(text).toContain(name);
  expect(text).not.toContain(original.name);
  expect.soft(text).toContain(rupiah(expectedItem.price));
  await expect.soft(main(page).getByText(`Total: ${rupiah(expectedItem.price)}`, { exact: true })).toBeVisible();
  await page.reload();
  await expect.soft(main(page).getByText(`Total: ${rupiah(expectedItem.price)}`, { exact: true })).toBeVisible();
});

test('[BB-010] Catalog detail and deep link should show consistent product data @P1', async ({ page }) => {
  await catalog(page);
  const items = [];
  for (const card of await cards(page).all()) items.push(await cardData(card));
  for (const item of items) {
    await page.goto(item.href);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.name);
    await expect(main(page).getByText(rupiah(item.price), { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.name);
    await expect(main(page).getByText(rupiah(item.price), { exact: true })).toBeVisible();
  }
});
