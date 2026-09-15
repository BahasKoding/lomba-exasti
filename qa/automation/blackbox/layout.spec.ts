import { test, expect } from '@playwright/test';
import { addFromCatalog, cards, catalog, checkpoint, detail, main, openCart } from './helpers';

test.use({ channel: 'msedge', video: 'off' });

for (const [index, viewport] of [
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
].entries()) {
  test(`[BB-0${23+index}] Layout should keep core controls usable at ${viewport.width}x${viewport.height} @P3`, async ({ page }, info) => {
    test.setTimeout(90000);
    await page.setViewportSize(viewport);
    async function inspect(label: string) {
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      expect.soft(dimensions.scroll, `${label}: horizontal document overflow`).toBeLessThanOrEqual(dimensions.width + 1);
      await checkpoint(page, info, `${label}-${viewport.width}`);
    }
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await inspect('home');
    if (viewport.width === 390) {
      await page.getByRole('button', { name: 'Toggle menu' }).click();
      await inspect('mobile-menu');
      await page.getByRole('dialog').getByRole('link', { name: 'Catalog', exact: true }).click();
      await expect(page).toHaveURL(/\/katalog$/);
      await expect(page.getByRole('dialog')).toBeHidden();
    }
    await catalog(page);
    await page.getByRole('textbox', { name: 'Search', exact: true }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Urutkan Produk' }).click();
    await expect(page.getByRole('button', { name: 'Price: Low to High', exact: true })).toBeVisible();
    await inspect('catalog-sort');
    await page.getByRole('button', { name: 'Price: Low to High', exact: true }).click();
    await addFromCatalog(page);
    await expect(cards(page).first()).toBeVisible();
    await inspect('catalog-added');
    await openCart(page);
    const order = page.getByRole('button', { name: /^ORDER \(/ });
    await expect(order).toBeInViewport();
    await order.click({ trial: true });
    await page.getByRole('button', { name: /^Remove / }).click({ trial: true });
    await inspect('cart');
    await detail(page);
    await page.getByRole('button', { name: 'Navy', exact: true }).click();
    await page.getByRole('button', { name: 'Add to Cart', exact: true }).first().click({ trial: true });
    await page.getByRole('link', { name: 'Order on WhatsApp' }).click({ trial: true });
    await inspect('detail');
    await page.goto('/about');
    await main(page).getByRole('link', { name: 'EXPLORE COLLECTION' }).click({ trial: true });
    await inspect('about');
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill('qa-layout@example.invalid');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('QA-layout-only');
    await page.getByRole('button', { name: 'Masuk Dashboard' }).click({ trial: true });
    await inspect('login');
  });
}
