import { test, expect } from "@playwright/test";
import { seed } from "./helpers";

test("sidebar animates, reverses and preserves the toggle position", async ({ page }) => {
  await page.setViewportSize({ width: 1085, height: 800 });
  await seed(page);
  await page.goto("/generate");
  const toggle = page.locator(".scene-toggle");
  const shell = page.locator('.writing-workspace > [data-slot="sidebar"]');
  const initial = await toggle.boundingBox();
  await toggle.click();
  await expect(toggle).toHaveAccessibleName("Show scene");
  expect(await toggle.boundingBox()).toEqual(initial);
  await expect(page.locator(".scene-sidebar")).toHaveAttribute("inert", "");
  expect(await shell.evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0.22s");
  await expect.poll(() => shell.evaluate((el) => el.getBoundingClientRect().width)).toBe(0);
  expect(await toggle.boundingBox()).toEqual(initial);
  await toggle.click();
  await expect.poll(() => shell.evaluate((el) => el.getBoundingClientRect().width)).toBe(348);
  expect(await toggle.boundingBox()).toEqual(initial);
  await toggle.click();
  await toggle.click();
  await expect.poll(() => shell.evaluate((el) => el.getBoundingClientRect().width)).toBe(348);
  await expect(page.locator(".scene-sidebar")).not.toHaveAttribute("inert", "");
  await expect(toggle).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await toggle.click();
  expect(
    await shell.evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration)),
  ).toBeLessThan(0.001);
  expect(await toggle.boundingBox()).toEqual(initial);
});

test("mobile scene toggle uses the same position inside and outside the drawer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page);
  await page.goto("/generate");
  const show = page.getByRole("button", { name: "Show scene" });
  await expect(show).toBeVisible();
  const before = await show.boundingBox();
  await show.click();
  const hide = page.getByRole("button", { name: "Hide scene" });
  await expect(hide).toBeFocused();
  await expect
    .poll(async () => JSON.stringify(await hide.boundingBox()))
    .toBe(JSON.stringify(before));
  await hide.click();
  await expect(show).toBeFocused();
  expect(await show.boundingBox()).toEqual(before);
});
