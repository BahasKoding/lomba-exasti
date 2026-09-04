import { chromium } from "playwright";
import fs from "node:fs";

const baseURL = "http://localhost:3000";
const executablePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const evidenceDir = "docs/qa/evidence/ui-2026-09-04";
fs.mkdirSync(evidenceDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath });
const results = [];
const runtime = { consoleErrors: [], pageErrors: [], failedRequests: [], apiResponses: [] };

function watch(page) {
  page.on("console", (message) => {
    if (message.type() === "error") runtime.consoleErrors.push({ url: page.url(), text: message.text() });
  });
  page.on("pageerror", (error) => runtime.pageErrors.push({ url: page.url(), text: error.message }));
  page.on("requestfailed", (request) => runtime.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  page.on("response", (response) => {
    if (response.url().includes("/api/")) runtime.apiResponses.push({ url: response.url(), method: response.request().method(), status: response.status() });
  });
}

function record(id, data) {
  results.push({ id, ...data });
}

async function shot(page, name) {
  const path = `${evidenceDir}/${name}.png`;
  await page.screenshot({ path, fullPage: true });
  return path;
}

// Public critical journey: home -> catalog -> filter/sort -> detail -> cart -> persistence.
const publicContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await publicContext.tracing.start({ screenshots: true, snapshots: true, sources: true });
const publicPage = await publicContext.newPage();
watch(publicPage);

await publicPage.goto(`${baseURL}/`, { waitUntil: "networkidle" });
record("UI-P0-001", {
  route: "/", module: "Storefront", feature: "Home", role: "Public", action: "Open rendered home",
  actual: { url: publicPage.url(), h1: await publicPage.getByRole("heading", { level: 1 }).innerText(), catalogLinks: await publicPage.getByRole("link", { name: "Catalog", exact: true }).count() },
});

const catalogResponsePromise = publicPage.waitForResponse((r) => r.url().endsWith("/api/catalog"));
await publicPage.getByRole("link", { name: "Catalog", exact: true }).first().click();
await publicPage.waitForURL("**/katalog");
const catalogResponse = await catalogResponsePromise;
await publicPage.waitForLoadState("networkidle");
const search = publicPage.getByPlaceholder("Search");
const catalogLinks = publicPage.locator('main a[href^="/produk/"]');
const allCount = await catalogLinks.count();
await search.fill("topi baseball corduroy");
await publicPage.waitForTimeout(200);
const searchCount = await catalogLinks.count();
await publicPage.getByRole("combobox").selectOption("harga-asc");
const searchedPrices = await publicPage.locator("main p").filter({ hasText: /^Rp/ }).allInnerTexts();
await search.fill("zzzz-no-product-qa");
const noResultVisible = await publicPage.getByText("No caps found", { exact: true }).isVisible();
await search.fill("");
await publicPage.getByRole("combobox").selectOption("harga-desc");
record("UI-CAT-001", {
  route: "/katalog", module: "Catalog", feature: "Search and sorting", role: "Public", action: "Search, no-result, sort",
  api: { method: "GET", endpoint: "/api/catalog", status: catalogResponse.status() },
  actual: { allCount, searchCount, searchedPrices, noResultVisible, selectedSort: await publicPage.getByRole("combobox").inputValue() },
});

await publicPage.getByRole("button", { name: /Tambah .* ke Keranjang/ }).first().click();
const cartAfterCatalogAdd = await publicPage.evaluate(() => JSON.parse(localStorage.getItem("cart") || "[]"));
await publicPage.getByRole("link", { name: "Cart", exact: true }).first().click();
await publicPage.waitForURL("**/cart");
await publicPage.waitForTimeout(300);
let rows = publicPage.locator("tbody tr");
const rowsAfterAdd = await rows.count();
const firstRow = rows.first();
const qtyBefore = await firstRow.locator("td").nth(3).innerText();
await firstRow.locator("button").last().click();
const qtyAfter = await firstRow.locator("td").nth(3).innerText();
const totalAfter = await firstRow.locator("td").nth(4).innerText();
await publicPage.reload({ waitUntil: "networkidle" });
rows = publicPage.locator("tbody tr");
const qtyAfterReload = await rows.first().locator("td").nth(3).innerText();
record("UI-CART-001", {
  route: "/cart", module: "Cart", feature: "Add, quantity, persistence", role: "Public", action: "Add from catalog, increment, refresh",
  actual: { storedItems: cartAfterCatalogAdd.length, rowsAfterAdd, qtyBefore, qtyAfter, totalAfter, qtyAfterReload },
});

await rows.first().getByTitle("Remove item").click();
const emptyVisibleBeforeReload = await publicPage.getByText("Your Cart is Empty", { exact: true }).isVisible();
await publicPage.reload({ waitUntil: "networkidle" });
const rowsAfterEmptyReload = await publicPage.locator("tbody tr").count();
const emptyVisibleAfterReload = await publicPage.getByText("Your Cart is Empty", { exact: true }).isVisible().catch(() => false);
const emptyCartShot = await shot(publicPage, "bug-empty-cart-repopulated");
record("UI-CART-002", {
  route: "/cart", module: "Cart", feature: "Empty-state persistence", role: "Public", action: "Remove last item and refresh",
  actual: { emptyVisibleBeforeReload, rowsAfterEmptyReload, emptyVisibleAfterReload }, evidence: emptyCartShot,
});

await publicPage.goto(`${baseURL}/katalog`, { waitUntil: "networkidle" });
const firstProductLink = publicPage.locator('main a[href^="/produk/"]').first();
const productHref = await firstProductLink.getAttribute("href");
const productNameFromCard = (await firstProductLink.locator("h3").innerText()).trim();
await firstProductLink.click();
await publicPage.waitForURL("**/produk/**");
const detailName = (await publicPage.getByRole("heading", { level: 1 }).innerText()).trim();
await publicPage.getByTitle("Charcoal").click();
const unlabeledButtons = await publicPage.locator("button:not([aria-label]):not([title])").count();
const quantityButtons = publicPage.locator("main button").filter({ has: publicPage.locator("svg.lucide-plus") });
await quantityButtons.first().click();
const orderHref = await publicPage.getByRole("link", { name: "Order", exact: true }).getAttribute("href");
await publicPage.getByRole("button", { name: "Cart", exact: true }).click();
const addedMessage = await publicPage.getByText("Added to Cart", { exact: true }).isVisible();
const detailCart = await publicPage.evaluate(() => JSON.parse(localStorage.getItem("cart") || "[]"));
await publicPage.goBack({ waitUntil: "networkidle" });
const backURL = publicPage.url();
await publicPage.goForward({ waitUntil: "networkidle" });
const forwardURL = publicPage.url();
record("UI-DETAIL-001", {
  route: productHref, module: "Product", feature: "Detail/cart/navigation", role: "Public", action: "Open, select color, increment, add, back/forward",
  actual: { productNameFromCard, detailName, addedMessage, storedColor: detailCart.at(-1)?.color, storedQuantity: detailCart.at(-1)?.quantity, orderHasCharcoal: orderHref?.includes("Charcoal"), orderHasQty2: orderHref?.includes("Jumlah%3A%202"), backURL, forwardURL, unlabeledButtons },
});

await publicPage.goto(`${baseURL}/produk/qa-slug-does-not-exist-20260904`, { waitUntil: "networkidle" });
const invalidSlugHeading = await publicPage.getByRole("heading", { level: 1 }).innerText();
const invalidSlugShot = await shot(publicPage, "candidate-invalid-slug-fallback");
record("UI-DETAIL-002", {
  route: "/produk/qa-slug-does-not-exist-20260904", module: "Product", feature: "Invalid slug", role: "Public", action: "Open direct unknown URL",
  actual: { statusLikeBehavior: "Rendered product detail", heading: invalidSlugHeading }, evidence: invalidSlugShot,
});

await publicContext.tracing.stop({ path: `${evidenceDir}/public-flow-trace.zip` });
await publicContext.close();

// Authentication UI negative and native validation.
const authContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await authContext.tracing.start({ screenshots: true, snapshots: true, sources: true });
const authPage = await authContext.newPage();
watch(authPage);
await authPage.goto(`${baseURL}/admin`, { waitUntil: "networkidle" });
record("UI-AUTH-001", { route: "/admin", module: "Auth", feature: "Protected route", role: "Public", action: "Direct URL without session", actual: { finalURL: authPage.url(), heading: await authPage.getByRole("heading", { level: 1 }).innerText() } });

const email = authPage.getByLabel("Email");
const password = authPage.getByLabel("Password");
const submit = authPage.getByRole("button", { name: "Masuk Dashboard" });
let loginRequests = 0;
authPage.on("request", (request) => { if (request.url().endsWith("/api/auth/login")) loginRequests += 1; });
await submit.click();
const emptyValidation = await email.evaluate((e) => e.validationMessage);
const requestsAfterEmpty = loginRequests;
await email.fill("invalid-email");
await password.fill("x");
await submit.click();
const formatValidation = await email.evaluate((e) => e.validationMessage);
const requestsAfterFormat = loginRequests;
await authPage.getByTitle("Show password").click();
const revealedType = await password.getAttribute("type");
await authPage.getByTitle("Hide password").click();
const hiddenType = await password.getAttribute("type");
await email.fill("qa-nonexistent-20260904@example.invalid");
await password.fill("WrongPass!123");
const invalidLoginResponsePromise = authPage.waitForResponse((r) => r.url().endsWith("/api/auth/login"));
await submit.click();
const invalidLoginResponse = await invalidLoginResponsePromise;
const loginError = await authPage.getByText("Email atau password salah.", { exact: true }).innerText();
record("UI-AUTH-002", {
  route: "/login", module: "Auth", feature: "Login validation", role: "Public", action: "Empty, malformed email, password toggle, invalid credential",
  api: { method: "POST", endpoint: "/api/auth/login", status: invalidLoginResponse.status() },
  actual: { emptyValidation, requestsAfterEmpty, formatValidation, requestsAfterFormat, revealedType, hiddenType, invalidCredentialError: loginError, finalURL: authPage.url() },
});
await authContext.tracing.stop({ path: `${evidenceDir}/auth-negative-trace.zip` });
await authContext.close();

// Forged-cookie authorization plus safe admin interactions.
const adminContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await adminContext.addCookies([{ name: "sc_session", value: "qa-invalid-token", url: baseURL }]);
await adminContext.tracing.start({ screenshots: true, snapshots: true, sources: true });
const adminPage = await adminContext.newPage();
watch(adminPage);
const productsResponsePromise = adminPage.waitForResponse((r) => r.url().endsWith("/api/products") && r.request().method() === "GET");
await adminPage.goto(`${baseURL}/admin`, { waitUntil: "networkidle" });
const productsResponse = await productsResponsePromise;
const forgedShot = await shot(adminPage, "bug-forged-cookie-admin");
record("UI-AUTHZ-001", {
  route: "/admin", module: "Authorization", feature: "Forged session", role: "Unauthenticated", action: "Open admin with random cookie",
  api: { method: "GET", endpoint: "/api/products", status: productsResponse.status() },
  actual: { finalURL: adminPage.url(), heading: await adminPage.getByRole("heading", { level: 1 }).innerText(), rows: await adminPage.locator("tbody tr").count() }, evidence: forgedShot,
});

await adminPage.getByRole("button").filter({ hasText: "Parked" }).first().click();
const parkedRows = await adminPage.locator("tbody tr").count();
await adminPage.getByRole("button").filter({ hasText: "Published" }).first().click();
const publishedRows = await adminPage.locator("tbody tr").count();
await adminPage.getByRole("button").filter({ hasText: "All" }).first().click();
const allRows = await adminPage.locator("tbody tr").count();
const refreshResponsePromise = adminPage.waitForResponse((r) => r.url().endsWith("/api/products") && r.request().method() === "GET");
await adminPage.getByRole("button", { name: "Refresh List" }).click();
const refreshResponse = await refreshResponsePromise;
const files = Array.from({ length: 6 }, () => "public/Display-Catalog-1.png");
await adminPage.locator('input[type="file"]').setInputFiles(files);
const fileCountText = await adminPage.getByText("6 Files", { exact: true }).innerText();
await adminPage.getByRole("button", { name: /More/ }).click();
const modalVisible = await adminPage.getByRole("heading", { name: "Image Uploaded" }).isVisible();
await adminPage.getByRole("button", { name: "Cancel" }).click();
const modalClosed = !(await adminPage.getByRole("heading", { name: "Image Uploaded" }).isVisible().catch(() => false));
record("UI-ADMIN-001", {
  route: "/admin", module: "Admin", feature: "Directory/filter/upload modal", role: "Forged admin access", action: "Filter, refresh, select 6 files, open/cancel modal",
  api: { method: "GET", endpoint: "/api/products", status: refreshResponse.status() },
  actual: { parkedRows, publishedRows, allRows, fileCountText, modalVisible, modalClosed, generateEnabled: await adminPage.getByRole("button", { name: "Generate" }).isEnabled() },
});

// Review filtering/view switch and selected-index defect with intercepted save.
await adminPage.goto(`${baseURL}/admin/review`, { waitUntil: "networkidle" });
await adminPage.getByPlaceholder("Search...").fill("Snapback");
const snapbackVisible = await adminPage.getByText("Snapback Premium", { exact: true }).count();
await adminPage.getByPlaceholder("Search...").fill("");
await adminPage.getByRole("combobox").selectOption("Pending");
const pendingSelectButtons = await adminPage.getByTitle("Select item").count();
await adminPage.getByRole("button", { name: "Table" }).click();
const tableVisible = await adminPage.locator("table").isVisible();
record("UI-REVIEW-001", {
  route: "/admin/review", module: "Review", feature: "Search/filter/view", role: "Forged admin access", action: "Search, filter Pending, switch Table",
  actual: { snapbackVisible, pendingSelectButtons, tableVisible },
});

const draftPayload = {
  items: [
    { name: "QA First", imageBase64: "AA==", mimeType: "image/png" },
    { name: "QA Second", imageBase64: "AA==", mimeType: "image/png" },
    { name: "QA Third", imageBase64: "AA==", mimeType: "image/png" },
  ],
  results: [0, 1, 2].map((index) => ({ ok: true, draft: { category: "Baseball Cap", material: "QA", description: `QA ${index}`, priceEstimate: 10000 + index } })),
};
await adminPage.evaluate((payload) => sessionStorage.setItem("drafts", JSON.stringify(payload)), draftPayload);
let capturedSaveBody = null;
await adminPage.route("**/api/products", async (route) => {
  if (route.request().method() === "POST") {
    capturedSaveBody = route.request().postDataJSON();
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }) });
  } else {
    await route.continue();
  }
});
await adminPage.reload({ waitUntil: "networkidle" });
const statusButtons = adminPage.getByRole("button", { name: /^(Pending|Approved|Rejected)$/ });
await statusButtons.nth(0).click();
await statusButtons.nth(0).click();
await adminPage.getByTitle("Select item").nth(2).click();
await adminPage.getByRole("button", { name: "Save", exact: true }).click();
const noValidMessage = await adminPage.getByText(/No valid products to save/).isVisible();
const selectionShot = await shot(adminPage, "bug-review-selected-index");
record("UI-REVIEW-002", {
  route: "/admin/review", module: "Review", feature: "Selected row mapping", role: "Forged admin access", action: "Reject first, select third, save with API intercepted",
  actual: { noValidMessage, apiRequestSent: capturedSaveBody !== null, selectedThirdWasValid: true }, evidence: selectionShot,
});

// Settings local persistence and storefront propagation; clean up after verification.
await adminPage.goto(`${baseURL}/admin/settings`, { waitUntil: "networkidle" });
const settingInputs = adminPage.locator("input");
await settingInputs.nth(0).fill("081234500099");
await adminPage.getByRole("button", { name: "Save Order Setting" }).click();
const orderSaved = await adminPage.getByText("Saved successfully!", { exact: true }).isVisible();
await settingInputs.nth(1).fill("QA SmartCap Runtime");
await adminPage.getByRole("button", { name: "Save", exact: true }).click();
await adminPage.goto(`${baseURL}/`, { waitUntil: "networkidle" });
const storedSettings = await adminPage.evaluate(() => JSON.parse(localStorage.getItem("smartcap_store_settings") || "{}"));
const qaBrandVisible = await adminPage.getByText("QA SmartCap Runtime", { exact: true }).count();
const waHref = await adminPage.getByRole("link", { name: "Inquire on WhatsApp" }).getAttribute("href");
await adminPage.reload({ waitUntil: "networkidle" });
const qaBrandAfterReload = await adminPage.getByText("QA SmartCap Runtime", { exact: true }).count();
record("UI-SETTINGS-001", {
  route: "/admin/settings -> /", module: "Settings", feature: "Local persistence", role: "Forged admin access", action: "Save number/brand, navigate storefront, refresh",
  actual: { orderSaved, storedNumber: storedSettings.whatsappNumber, storedName: storedSettings.storeName, qaBrandVisible, qaBrandAfterReload, waUsesNormalizedNumber: waHref?.includes("6281234500099") },
});
await adminPage.evaluate(() => localStorage.removeItem("smartcap_store_settings"));

// Logout and history behavior from the forged-access session.
await adminPage.goto(`${baseURL}/admin`, { waitUntil: "networkidle" });
const logoutResponsePromise = adminPage.waitForResponse((r) => r.url().endsWith("/api/auth/logout"));
await adminPage.getByRole("button", { name: "Logout" }).click();
const logoutResponse = await logoutResponsePromise;
await adminPage.waitForURL("**/login");
await adminPage.goBack({ waitUntil: "networkidle" });
const afterBackURL = adminPage.url();
await adminPage.reload({ waitUntil: "networkidle" });
const afterReloadURL = adminPage.url();
record("UI-AUTH-003", {
  route: "/admin -> /login", module: "Auth", feature: "Logout/history", role: "Forged admin access", action: "Logout, back, refresh",
  api: { method: "POST", endpoint: "/api/auth/logout", status: logoutResponse.status() },
  actual: { afterLogoutURL: `${baseURL}/login`, afterBackURL, afterReloadURL },
});

await adminContext.tracing.stop({ path: `${evidenceDir}/admin-flow-trace.zip` });
await adminContext.close();

console.log(JSON.stringify({ results, runtime }, null, 2));
await browser.close();
