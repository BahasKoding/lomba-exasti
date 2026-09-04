import { chromium } from "playwright";

const baseURL = "http://localhost:3000";
const executablePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

for (const route of ["/", "/katalog", "/produk/qa-slug-does-not-exist-20260904", "/cart", "/login"]) {
  await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const summary = await page.locator("body").evaluate((body) => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.visibility !== "hidden" && style.display !== "none" && box.width > 0 && box.height > 0;
    };
    const describe = (element) => ({
      tag: element.tagName.toLowerCase(),
      text: (element.innerText || "").trim().replace(/\s+/g, " ").slice(0, 100),
      aria: element.getAttribute("aria-label"),
      title: element.getAttribute("title"),
      placeholder: element.getAttribute("placeholder"),
      href: element.getAttribute("href"),
      type: element.getAttribute("type"),
    });
    return {
      h1: [...body.querySelectorAll("h1")].filter(visible).map((e) => e.innerText.trim()),
      controls: [...body.querySelectorAll("a,button,input,select")].filter(visible).map(describe),
      tables: body.querySelectorAll("table").length,
    };
  });
  console.log(JSON.stringify({ route, finalURL: page.url(), title: await page.title(), ...summary }));
}

await context.addCookies([{ name: "sc_session", value: "qa-invalid-token", url: baseURL }]);
for (const route of ["/admin", "/admin/review", "/admin/settings"]) {
  await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const summary = await page.locator("body").evaluate((body) => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.visibility !== "hidden" && style.display !== "none" && box.width > 0 && box.height > 0;
    };
    return {
      h1: [...body.querySelectorAll("h1")].filter(visible).map((e) => e.innerText.trim()),
      controls: [...body.querySelectorAll("a,button,input,select,textarea")].filter(visible).map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: (element.innerText || "").trim().replace(/\s+/g, " ").slice(0, 100),
        aria: element.getAttribute("aria-label"),
        title: element.getAttribute("title"),
        placeholder: element.getAttribute("placeholder"),
        href: element.getAttribute("href"),
        type: element.getAttribute("type"),
        value: element.tagName === "SELECT" ? element.value : undefined,
      })),
      tables: body.querySelectorAll("table").length,
    };
  });
  console.log(JSON.stringify({ route, finalURL: page.url(), ...summary }));
}

await browser.close();
