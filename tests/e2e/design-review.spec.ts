import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { seed, mockGeneration, generate } from "./helpers";

test("capture approved direction across desktop and mobile surfaces", async ({ page }) => {
  test.setTimeout(90000);
  await mkdir(".impeccable/review", { recursive: true });
  await seed(page);
  await mockGeneration(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/generate");
  await page
    .getByLabel("What's happening?")
    .fill("A pompous knight challenges you to a duel. Your party is watching.");
  await page.getByLabel("Number of lines").fill("12");
  await generate(page);
  await page.getByRole("article").nth(1).getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("article").nth(4).getByRole("button", { name: "Save", exact: true }).click();
  const capture = async (name: string) => {
    await page.evaluate(async () => {
      await document.fonts.ready;
      window.scrollTo(0, 0);
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.locator("[data-sonner-toast]")).toHaveCount(0, { timeout: 15000 });
    await page.screenshot({
      path: `.impeccable/review/${name}.png`,
      fullPage: true,
      animations: "disabled",
    });
  };
  await capture("desktop");
  await page.getByRole("link", { name: "Saved lines", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Saved lines" })).toBeVisible();
  await capture("saved-desktop");
  await page.getByRole("link", { name: "Write", exact: true }).click();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByRole("heading", { name: "AI connections", exact: true })).toBeVisible();
  await capture("settings-desktop");
  await page.getByRole("link", { name: "Appearance", exact: true }).click();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page.getByRole("link", { name: "Back to workspace" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Show scene" })).toBeVisible();
  await capture("mobile");
  await page.screenshot({ path: ".impeccable/review/mobile-viewport.png", animations: "disabled" });
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByRole("heading", { name: "AI connections", exact: true })).toBeVisible();
  await capture("settings-mobile");
  await page.getByRole("link", { name: "Saved lines", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Saved lines" })).toBeVisible();
  await capture("saved-mobile");
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("combobox", { name: "Settings section" }).click();
  await page.getByRole("option", { name: "Appearance", exact: true }).click();
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await page.getByRole("link", { name: "Back to workspace" }).click();
  await page.getByRole("link", { name: "Edit Merrin Ashvale" }).click();
  await expect(page.getByRole("heading", { name: "Edit character" })).toBeVisible();
  await capture("editor-mobile");
  await page.screenshot({
    path: ".impeccable/review/editor-mobile-viewport.png",
    animations: "disabled",
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await capture("editor-desktop");
});
