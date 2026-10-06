import { test, expect } from "@playwright/test";
import { seed, mockGeneration, generate } from "@/tests/e2e/helpers";

test.beforeEach(async ({ page }) => {
  await seed(page);
  await mockGeneration(
    page,
    Array.from({ length: 25 }, (_, i) => ({
      id: `scroll-${i}`,
      text: `Line ${i + 1}. A dramatic retort for the audience at the table.`,
    })),
  );
});

test("desktop sidebar keeps its action fixed while fields and results scroll independently", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1085, height: 700 });
  await page.goto("/generate");
  const fields = page.getByRole("region", { name: "Scene fields" });
  const list = page.getByRole("region", { name: "Lines list" });
  const action = page.getByRole("button", { name: "Generate lines", exact: true });
  await page.getByLabel("What's happening?").fill("Keep this scene");
  await page.locator("summary").filter({ hasText: "AI settings" }).click();
  const actionTop = (await action.boundingBox())!.y;
  await fields.focus();
  await fields.press("End");
  await expect
    .poll(() => fields.evaluate((el) => Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop)))
    .toBeLessThanOrEqual(1);
  await expect(action).toBeInViewport();
  expect((await action.boundingBox())!.y).toBe(actionTop);
  await generate(page);
  const fieldsTop = await fields.evaluate((el) => el.scrollTop);
  await list.focus();
  await list.press("End");
  await expect
    .poll(() => list.evaluate((el) => Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop)))
    .toBeLessThanOrEqual(1);
  expect(await fields.evaluate((el) => el.scrollTop)).toBe(fieldsTop);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("button", { name: "Copy", exact: true }).last()).toBeInViewport();
  await page.getByRole("button", { name: "Hide scene" }).click();
  await expect(page.locator(".scene-sidebar")).toHaveAttribute("inert", "");
  await expect(page.getByRole("button", { name: "Show scene" })).toBeFocused();
  await page.getByRole("button", { name: "Show scene" }).click();
  await expect(page.getByLabel("What's happening?")).toHaveValue("Keep this scene");
  await expect(page.getByRole("button", { name: "Hide scene" })).toBeFocused();
  await page
    .locator(".scene-sidebar")
    .evaluate((el) => Promise.all(el.getAnimations().map((animation) => animation.finished)));
  await page.screenshot({ path: ".impeccable/review/sidebar-desktop.png" });
});

test("mobile sidebar uses a drawer, retains inputs, returns focus and shows successful results", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/generate");
  const show = page.getByRole("button", { name: "Show scene" });
  await show.click();
  const drawer = page.getByRole("dialog", { name: "Set the scene" });
  await expect(drawer).toBeVisible();
  await page.getByLabel("What's happening?").fill("Mobile draft");
  await page.locator("summary").filter({ hasText: "AI settings" }).click();
  const fields = page.getByRole("region", { name: "Scene fields" });
  await fields.focus();
  await fields.press("End");
  await expect
    .poll(() => fields.evaluate((el) => Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop)))
    .toBeLessThanOrEqual(1);
  await expect(page.getByRole("button", { name: "Generate lines", exact: true })).toBeInViewport();
  await page.getByRole("combobox", { name: "Provider", exact: true }).click();
  await page.getByRole("option", { name: "OpenAI", exact: true }).click();
  await expect(page.getByRole("listbox")).toBeHidden();
  await page.screenshot({ path: ".impeccable/review/sidebar-mobile.png" });
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(show).toBeFocused();
  await show.click();
  await expect(page.getByLabel("What's happening?")).toHaveValue("Mobile draft");
  await generate(page);
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("article")).toHaveCount(25);
  await page.getByRole("button", { name: "Copy", exact: true }).last().click({ trial: true });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true);
  await page.screenshot({ path: ".impeccable/review/sidebar-mobile-results.png" });
});
