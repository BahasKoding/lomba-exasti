import { chromium } from "playwright";

const baseURL = "http://127.0.0.1:3000";
const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const evidence = "docs/qa/evidence/ui-2026-09-04";
const browser = await chromium.launch({ headless: true, executablePath: edge });
const results = [];

try {
  const publicContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const publicPage = await publicContext.newPage();
  await publicPage.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await publicPage.getByRole("button", { name: "Toggle menu", exact: true }).click();
  const catalog = publicPage.getByRole("link", { name: "Catalog", exact: true }).filter({ visible: true });
  const login = publicPage.getByRole("link", { name: "Login Admin", exact: true });
  results.push({
    id: "TARGET-MOBILE-PUBLIC",
    catalogVisibleAfterOpen: await catalog.isVisible(),
    loginVisibleAfterOpen: await login.isVisible(),
  });
  await publicPage.screenshot({ path: `${evidence}/mobile-public-menu.png`, fullPage: true });
  await catalog.click();
  await publicPage.waitForURL("**/katalog");
  results.at(-1).navigatedTo = new URL(publicPage.url()).pathname;
  await publicContext.close();

  const adminContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await adminContext.addCookies([{ name: "sc_session", value: "qa-invalid-token", domain: "127.0.0.1", path: "/" }]);
  const adminPage = await adminContext.newPage();
  await adminPage.route("**/api/products", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true,"products":[]}' }));
  await adminPage.goto(`${baseURL}/admin`, { waitUntil: "networkidle" });
  await adminPage.getByText("Loading product directory...").waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
  await adminPage.getByRole("button", { name: "Toggle Menu", exact: true }).click();
  await adminPage.waitForTimeout(400);
  const review = adminPage.getByRole("link", { name: "AI Review", exact: true });
  const settings = adminPage.getByRole("link", { name: "Setting", exact: true });
  const logout = adminPage.getByRole("button", { name: "Logout", exact: true });
  results.push({
    id: "TARGET-MOBILE-ADMIN",
    reviewVisibleAfterOpen: await review.isVisible(),
    settingsVisibleAfterOpen: await settings.isVisible(),
    logoutVisibleAfterOpen: await logout.isVisible(),
  });
  await adminPage.screenshot({ path: `${evidence}/mobile-admin-menu.png`, fullPage: true });
  await adminContext.close();

  const authContext = await browser.newContext();
  await authContext.addCookies([{ name: "sc_session", value: "qa-invalid-token", domain: "127.0.0.1", path: "/" }]);
  const authPage = await authContext.newPage();
  await authPage.route("**/api/products", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true,"products":[]}' }));
  await authPage.route("**/api/auth/logout", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' }));
  await authPage.goto(`${baseURL}/admin`, { waitUntil: "networkidle" });
  await authPage.getByText("Loading product directory...").waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
  await authPage.locator("aside").getByRole("button", { name: "Logout", exact: true }).click();
  await authPage.waitForTimeout(2000);
  const pathAfterLogout = new URL(authPage.url()).pathname;
  let backPath = pathAfterLogout;
  let adminContentVisible = false;
  let pathAfterReload = pathAfterLogout;
  if (pathAfterLogout === "/login") {
    await authPage.goBack({ waitUntil: "domcontentloaded" });
    backPath = new URL(authPage.url()).pathname;
    adminContentVisible = await authPage.getByRole("heading", { name: "Bulk Massal", exact: true }).isVisible().catch(() => false);
    await authPage.screenshot({ path: `${evidence}/candidate-logout-back-cache.png`, fullPage: true });
    await authPage.reload({ waitUntil: "domcontentloaded" });
    pathAfterReload = new URL(authPage.url()).pathname;
  }
  results.push({
    id: "TARGET-LOGOUT-BACK",
    pathAfterLogout,
    pathAfterBack: backPath,
    adminContentVisibleAfterBack: adminContentVisible,
    pathAfterReload,
  });
  await authContext.close();
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
