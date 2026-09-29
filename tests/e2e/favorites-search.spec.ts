import { test, expect } from "@playwright/test";
import { seed } from "./helpers";
test.beforeEach(async ({ page }) => {
  await seed(page, true);
  await page.goto("/favorites");
});
test("combines case-insensitive text, context, and type filters", async ({ page }) => {
  await page.getByLabel("Search saved lines").fill("TAVERN");
  await expect(page.getByRole("article")).toHaveCount(6);
  await page.getByRole("button", { name: "Combat quips", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No matching lines" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("article")).toHaveCount(12);
  await page.getByLabel("Search saved lines").fill("butter knife");
  await expect(page.getByRole("article")).toHaveCount(1);
});
test("disables random selection when no lines match", async ({ page }) => {
  await page.getByLabel("Search saved lines").fill("Not in this collection");
  await expect(page.getByRole("button", { name: "Pick & copy" })).toBeDisabled();
});
