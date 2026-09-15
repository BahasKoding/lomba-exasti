import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const evidence = 'docs/qa/evidence/blackbox-2026-09-15';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const observations = [];
for (const path of ['/', '/katalog', '/cart', '/login']) {
  await page.goto(origin + path);
  await page.locator('body').waitFor();
  if (path === '/katalog') await page.getByText('Loading catalog items...').waitFor({ state: 'hidden', timeout: 60000 });
  const snapshot = await page.locator('body').ariaSnapshot();
  const links = await page.getByRole('link').evaluateAll(nodes => nodes.map(n => ({ text: n.textContent, href: n.getAttribute('href') })));
  observations.push({ path, url: page.url(), snapshot, links });
  await page.screenshot({ path: `${evidence}/discovery-${path.slice(1) || 'home'}.png`, fullPage: true });
}
await writeFile(`${evidence}/discovery.json`, JSON.stringify(observations, null, 2));
console.log(JSON.stringify(observations, null, 2));
await browser.close();
