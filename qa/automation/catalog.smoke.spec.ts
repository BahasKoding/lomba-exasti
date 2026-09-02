import { expect, test } from "@playwright/test";

test("public catalog route renders its main heading", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Temukan Topi Favoritmu" }),
  ).toBeVisible();
});
