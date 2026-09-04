import { chromium } from "playwright";
import fs from "node:fs";

const baseURL = "http://localhost:3000";
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const evidenceDir = "docs/qa/evidence/ui-2026-09-04";
fs.mkdirSync(evidenceDir, { recursive: true });
const results = [];

// Verify catalog card-to-detail mapping over time.
const detailContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const detailPage = await detailContext.newPage();
await detailPage.goto(`${baseURL}/katalog`, { waitUntil: "networkidle" });
const firstCard = detailPage.locator('main a[href^="/produk/"]').first();
const cardName = (await firstCard.locator("h3").innerText()).trim();
const href = await firstCard.getAttribute("href");
await firstCard.click();
await detailPage.waitForURL("**/produk/**");
const headings = [];
for (let index = 0; index < 6; index += 1) {
  headings.push((await detailPage.getByRole("heading", { level: 1 }).innerText()).trim());
  await detailPage.waitForTimeout(500);
}
const detailShot = `${evidenceDir}/bug-card-detail-mismatch.png`;
await detailPage.screenshot({ path: detailShot, fullPage: true });
results.push({ id: "TARGET-DETAIL", cardName, href, headings, evidence: detailShot });
await detailContext.close();

// Verify review controls with state-specific locators.
const reviewContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await reviewContext.addCookies([{ name: "sc_session", value: "qa-invalid-token", url: baseURL }]);
const reviewPage = await reviewContext.newPage();
await reviewPage.goto(`${baseURL}/admin/review`, { waitUntil: "networkidle" });
await reviewPage.getByPlaceholder("Search...").fill("Snapback");
await reviewPage.waitForTimeout(200);
const matchingNameInputs = await reviewPage.locator('input[type="text"]').evaluateAll((nodes) => nodes.map((node) => node.value).filter((value) => value.includes("Snapback")));
const visibleSelectButtonsAfterSearch = await reviewPage.getByTitle("Select item").count();
await reviewPage.getByPlaceholder("Search...").fill("");
await reviewPage.getByRole("combobox").selectOption("Pending");
const pendingCards = await reviewPage.getByTitle("Select item").count();
await reviewPage.getByRole("button", { name: "Table", exact: true }).click();
await reviewPage.waitForTimeout(100);
const tableModeClass = await reviewPage.getByRole("button", { name: "Table", exact: true }).getAttribute("class");
const gridModeClass = await reviewPage.getByRole("button", { name: "Grid", exact: true }).getAttribute("class");
results.push({ id: "TARGET-REVIEW", matchingNameInputs, visibleSelectButtonsAfterSearch, pendingCards, tableModeActive: tableModeClass.includes("bg-[#D8D4CD]"), gridModeActive: gridModeClass.includes("bg-[#D8D4CD]") });
await reviewContext.close();

// Settings persistence and propagation with normalized body text.
const settingsContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await settingsContext.addCookies([{ name: "sc_session", value: "qa-invalid-token", url: baseURL }]);
const settingsPage = await settingsContext.newPage();
await settingsPage.goto(`${baseURL}/admin/settings`, { waitUntil: "networkidle" });
const inputs = settingsPage.locator("input");
await inputs.nth(0).fill("081234500099");
await settingsPage.getByRole("button", { name: "Save Order Setting" }).click();
await inputs.nth(1).fill("QA SmartCap Runtime");
await settingsPage.getByRole("button", { name: "Save", exact: true }).click();
await settingsPage.goto(`${baseURL}/`, { waitUntil: "networkidle" });
const bodyNormalized = (await settingsPage.locator("body").innerText()).replace(/\s+/g, " ");
const beforeReload = bodyNormalized.includes("QA SmartCap Runtime");
await settingsPage.reload({ waitUntil: "networkidle" });
const afterReload = (await settingsPage.locator("body").innerText()).replace(/\s+/g, " ").includes("QA SmartCap Runtime");
const waHref = await settingsPage.getByRole("link", { name: "Inquire on WhatsApp" }).getAttribute("href");
results.push({ id: "TARGET-SETTINGS", beforeReload, afterReload, waUsesNormalizedNumber: waHref.includes("6281234500099") });
await settingsPage.evaluate(() => localStorage.removeItem("smartcap_store_settings"));
await settingsContext.close();

// Client upload constraint mismatch: non-image accepted by state, without Generate.
const uploadContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await uploadContext.addCookies([{ name: "sc_session", value: "qa-invalid-token", url: baseURL }]);
const uploadPage = await uploadContext.newPage();
await uploadPage.goto(`${baseURL}/admin`, { waitUntil: "networkidle" });
await uploadPage.locator('input[type="file"]').setInputFiles("README.md");
const fileText = await uploadPage.getByText("1 File", { exact: true }).innerText();
const generateEnabled = await uploadPage.getByRole("button", { name: "Generate" }).isEnabled();
const uploadShot = `${evidenceDir}/candidate-non-image-upload.png`;
await uploadPage.screenshot({ path: uploadShot, fullPage: false });
results.push({ id: "TARGET-UPLOAD", fileText, generateEnabled, evidence: uploadShot });
await uploadContext.close();

// Cart duplicate action and resulting React console error.
const duplicateContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const duplicatePage = await duplicateContext.newPage();
const duplicateConsole = [];
duplicatePage.on("console", (message) => { if (message.type() === "error") duplicateConsole.push(message.text()); });
await duplicatePage.goto(`${baseURL}/katalog`, { waitUntil: "networkidle" });
await duplicatePage.evaluate(() => localStorage.removeItem("cart"));
const addButton = duplicatePage.getByRole("button", { name: /Tambah .* ke Keranjang/ }).first();
await addButton.click();
await addButton.click();
const duplicateCart = await duplicatePage.evaluate(() => JSON.parse(localStorage.getItem("cart") || "[]"));
await duplicatePage.goto(`${baseURL}/cart`, { waitUntil: "networkidle" });
const duplicateRows = await duplicatePage.locator("tbody tr").count();
const duplicateKeyError = duplicateConsole.some((text) => text.includes("same key"));
results.push({ id: "TARGET-DUPLICATE-CART", storedItems: duplicateCart.length, uniqueIds: new Set(duplicateCart.map((item) => item.id)).size, duplicateRows, duplicateKeyError });
await duplicateContext.close();

// UI/API correlation when catalog endpoint fails.
const errorContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const errorPage = await errorContext.newPage();
await errorPage.route("**/api/catalog", (route) => route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false, error: "QA forced failure" }) }));
const forcedResponsePromise = errorPage.waitForResponse((response) => response.url().endsWith("/api/catalog"));
await errorPage.goto(`${baseURL}/katalog`, { waitUntil: "networkidle" });
const forcedResponse = await forcedResponsePromise;
const renderedFallbackProducts = await errorPage.locator('main a[href^="/produk/"]').count();
const visibleErrorText = await errorPage.getByText(/QA forced failure|Gagal memuat katalog/).count();
const fallbackShot = `${evidenceDir}/candidate-catalog-api-fallback.png`;
await errorPage.screenshot({ path: fallbackShot, fullPage: true });
results.push({ id: "TARGET-CATALOG-ERROR", apiStatus: forcedResponse.status(), renderedFallbackProducts, visibleErrorText, evidence: fallbackShot });
await errorContext.close();

// Responsive navigation on public and admin surfaces.
const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mobilePage = await mobileContext.newPage();
await mobilePage.goto(`${baseURL}/`, { waitUntil: "networkidle" });
await mobilePage.getByRole("button", { name: "Toggle Menu" }).click();
const publicMobileCatalogLinks = await mobilePage.getByRole("link", { name: "Catalog", exact: true }).count();
await mobileContext.addCookies([{ name: "sc_session", value: "qa-invalid-token", url: baseURL }]);
await mobilePage.goto(`${baseURL}/admin`, { waitUntil: "networkidle" });
await mobilePage.getByRole("button", { name: "Toggle Menu" }).click();
const adminMobileReviewVisible = await mobilePage.getByRole("link", { name: "AI Review", exact: true }).isVisible();
const adminMobileLogoutVisible = await mobilePage.getByRole("button", { name: "Logout", exact: true }).isVisible();
results.push({ id: "TARGET-MOBILE", publicMobileCatalogLinks, adminMobileReviewVisible, adminMobileLogoutVisible });
await mobileContext.close();

console.log(JSON.stringify(results, null, 2));
await browser.close();
