import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';

export const money = (text: string) => Number(text.replace(/[^0-9]/g, ''));
export const rupiah = (value: number) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
export const main = (page: Page) => page.getByRole('main');
export const cards = (page: Page) => main(page).getByRole('link').filter({ has: page.getByRole('heading', { level: 3 }) });

export async function catalog(page: Page) {
  await page.goto('/katalog');
  await expect(page.getByRole('heading', { name: 'OUR CATALOG' })).toBeVisible();
  await expect(page.getByText('Loading catalog items...')).toBeHidden({ timeout: 30000 });
  await expect(cards(page).first(), 'Catalog needs at least one published product').toBeVisible();
}

export async function cardData(card: Locator) {
  return {
    name: (await card.getByRole('heading', { level: 3 }).textContent())!.trim(),
    price: money(await card.locator('p').innerText()),
    href: (await card.getAttribute('href'))!,
  };
}

export async function detail(page: Page) {
  await catalog(page);
  const item = await cardData(cards(page).first());
  await cards(page).first().click();
  await expect(page).toHaveURL(new RegExp(`${item.href}$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.name);
  return item;
}

export async function addFromCatalog(page: Page, index = 0) {
  const card = cards(page).nth(index);
  const item = await cardData(card);
  await card.getByRole('button', { name: /Tambah .* ke Keranjang/ }).click();
  await expect(page.getByRole('link', { name: 'View Cart', exact: true })).toBeVisible();
  return item;
}

export async function openCart(page: Page) {
  const desktop = page.getByRole('banner').getByRole('link', { name: 'Cart', exact: true });
  if (await desktop.isVisible()) await desktop.click();
  else {
    await page.getByRole('button', { name: 'Toggle menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Cart', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole('heading', { name: 'YOUR CART' })).toBeVisible();
}

// Quantity buttons have no accessible name. These icon classes were observed
// in the live DOM; exclude related-card Add without requiring missing labels.
// The locator will still work when accessible quantity names are repaired.
export function quantity(page: Page, direction: 'plus' | 'minus') {
  return main(page).locator('button:not([aria-label="Add to Cart"])')
    .filter({ has: page.locator(`svg.lucide-${direction}`) });
}

export function detailAdd(page: Page) {
  // Related-card buttons have an aria-label but no visible button text.
  // This scope keeps the primary CTA stable while its feedback label changes.
  return main(page).getByRole('button', { name: 'Add to Cart', exact: true }).filter({ hasText: /^Add to Cart$/ });
}

export async function total(page: Page, amount: number) {
  await expect(main(page).getByText(`Total: ${rupiah(amount)}`, { exact: true })).toBeVisible();
}

export async function orderText(page: Page, info: TestInfo) {
  const outgoing = page.context().waitForEvent('request', {
    predicate: request => request.isNavigationRequest() && /^(wa\.me|(?:api|web)\.whatsapp\.com)$/.test(new URL(request.url()).hostname),
  });
  await page.getByRole('button', { name: /^ORDER \(/ }).click();
  const request = await outgoing;
  const url = new URL(request.url());
  const text = (url.searchParams.get('text') || '').replace(/\u00a0/g, ' ');
  await info.attach('whatsapp-composer', { body: JSON.stringify({ hostname: url.hostname, text }, null, 2), contentType: 'application/json' });
  for (const popup of page.context().pages()) if (popup !== page) await popup.close();
  return text;
}

export async function checkpoint(page: Page, info: TestInfo, name: string) {
  const screenshotPath = info.outputPath(`${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await info.attach(name, { path: screenshotPath, contentType: 'image/png' });
}
