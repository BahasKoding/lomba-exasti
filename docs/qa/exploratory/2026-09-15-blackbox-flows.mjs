import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const evidence = 'docs/qa/evidence/blackbox-2026-09-15';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const records = [];
async function capture(label) {
  const row = { label, url: page.url(), snapshot: await page.locator('body').ariaSnapshot() };
  records.push(row);
  console.log(JSON.stringify(row));
  await page.screenshot({ path: `${evidence}/${label}.png`, fullPage: true });
}
page.on('response', response => {
  if (response.url().includes('/api/')) records.push({ responsePath: new URL(response.url()).pathname, status: response.status() });
});
await page.goto(origin + '/katalog');
await page.getByText('Loading catalog items...').waitFor({ state: 'hidden', timeout: 60000 });
await capture('catalog-loaded');
await page.getByRole('button', { name: 'Urutkan Produk' }).click();
await capture('catalog-sort-menu');
await page.keyboard.press('Escape');
const product = page.getByRole('link').filter({ has: page.getByRole('heading', { level: 3 }) }).first();
if (await product.count()) {
  await product.click();
  await page.waitForURL('**/produk/**');
  await page.getByText('Loading').waitFor({ state: 'hidden' }).catch(() => {});
  await page.getByRole('heading', { level: 1 }).waitFor();
  await capture('product-detail');
}
await page.goto(origin + '/about');
await capture('about');
await page.goto(origin + '/login');
await page.getByRole('button', { name: 'Masuk Dashboard' }).click();
await capture('login-empty');
console.log(JSON.stringify({ inputs: await page.getByRole('textbox').evaluateAll(nodes => nodes.map(n => ({ type: n.type, name: n.name, required: n.required, validity: n.validationMessage }))) }));
await page.getByRole('textbox', { name: 'Email', exact: true }).fill('qa.blackbox.20260915@example.invalid');
await page.getByRole('textbox', { name: 'Password', exact: true }).fill('QA-invalid-20260915');
await page.getByRole('button', { name: 'Masuk Dashboard' }).click();
await page.getByText('Email atau password salah').waitFor({ timeout: 30000 }).catch(() => {});
await capture('login-invalid');
await writeFile(`${evidence}/flows.json`, JSON.stringify(records, null, 2));
await browser.close();
