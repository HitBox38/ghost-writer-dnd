import { test, expect } from "@playwright/test";
import { seed, localCharacters } from "@/tests/e2e/helpers";
test.beforeEach(async ({ page }) => {
  await seed(page, true);
  await page.goto("/favorites");
});
test("shows all saved lines with visible copy and unsave actions", async ({ page }) => {
  await expect(page.getByRole("article")).toHaveCount(12);
  await expect(page.getByRole("button", { name: "Copy", exact: true })).toHaveCount(12);
  await page.getByRole("article").first().getByRole("button", { name: "Unsave line" }).click();
  await expect(page.getByRole("article")).toHaveCount(11);
  expect((await localCharacters(page))[0].favorites).toHaveLength(11);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByRole("article")).toHaveCount(12);
});
test("picks an available line and leaves focus on it", async ({ page }) => {
  await page.getByRole("button", { name: "Pick & copy" }).click();
  await expect(page.locator(".highlighted-line")).toBeFocused();
});
test("keeps phone content clear of the bottom navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("article").last().scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const action = await page
    .getByRole("article")
    .last()
    .getByRole("button", { name: "Copy" })
    .boundingBox();
  const nav = await page.getByRole("navigation", { name: "Main navigation" }).boundingBox();
  expect(action!.y + action!.height).toBeLessThanOrEqual(nav!.y);
});
