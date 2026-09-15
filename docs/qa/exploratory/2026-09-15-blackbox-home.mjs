import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000');
await page.getByRole('main').getByRole('link').filter({ has: page.getByRole('heading', { level: 3 }) }).first().waitFor();
const snapshot = await page.getByRole('main').ariaSnapshot();
const buttons = await page.getByRole('main').getByRole('button').evaluateAll(nodes => nodes.map(n => ({text:n.textContent, label:n.getAttribute('aria-label'), title:n.getAttribute('title'), icon:n.querySelector('svg')?.getAttribute('class')})));
const record = { snapshot, buttons };
console.log(JSON.stringify(record,null,2));
await writeFile('docs/qa/evidence/blackbox-2026-09-15/home-discovery.json',JSON.stringify(record,null,2));
await page.setViewportSize({ width:390, height:844 });
const dots = page.getByRole('main').getByRole('button', { name:/^Feature [12]$/ });
console.log(JSON.stringify({mobileButtons: await page.getByRole('main').getByRole('button').evaluateAll(nodes=>nodes.map(n=>({text:n.textContent,label:n.getAttribute('aria-label'),title:n.getAttribute('title'),parentText:n.parentElement?.textContent?.slice(0,250)})))}));
const slides=[];
if(await dots.count()===2) {
  for(const i of [0,1,0]) {
    await dots.nth(i).click();
    const slide = {dot:i, headings:await page.getByRole('heading',{level:4}).allTextContents()};
    slides.push(slide);console.log(JSON.stringify(slide));
  }
}
await writeFile('docs/qa/evidence/blackbox-2026-09-15/home-mobile-discovery.json',JSON.stringify(slides,null,2));
await browser.close();
