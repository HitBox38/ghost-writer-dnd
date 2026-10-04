import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { seed, mockGeneration, generate, localCharacters } from "@/tests/e2e/helpers";

test("browser comment corrections at the reported viewport and mobile", async ({ page }) => {
  test.setTimeout(90000);
  page.setDefaultTimeout(15000);
  await mkdir(".impeccable/review/comments", { recursive: true });
  await seed(page);
  await mockGeneration(page);
  await page.setViewportSize({ width: 1085, height: 1244 });
  await page.goto("/settings/appearance");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page.getByRole("link", { name: "Back to workspace" }).click();
  await expect(page.getByRole("link", { name: "Ghost Writer", exact: true })).toBeVisible();
  await expect(page).toHaveTitle("Ghost Writer");
  await generate(page);
  const shot = async (name: string) => {
    await page.evaluate(async () => {
      await document.fonts.ready;
      window.scrollTo(0, 0);
    });
    await expect(page.locator("[data-sonner-toast]")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: `.impeccable/review/comments/${name}.png`,
      fullPage: true,
      animations: "disabled",
    });
  };
  const sort = page.getByRole("combobox", { name: "Sort lines" });
  expect(
    Math.abs(
      (await sort.boundingBox())!.height -
        (await page.locator(".layout-selector").boundingBox())!.height,
    ),
  ).toBeLessThan(1);
  expect((await page.getByRole("button", { name: "Hide scene" }).boundingBox())!.width).toBe(32);
  expect(
    Math.abs(
      (await page.locator(".scene-panel").boundingBox())!.height -
        (await page.locator(".writing-workspace").boundingBox())!.height,
    ),
  ).toBeLessThan(1);
  await page.locator("summary").filter({ hasText: "AI settings" }).click();
  await page.getByRole("combobox", { name: "Provider", exact: true }).click();
  await page.getByRole("option", { name: "Anthropic", exact: true }).click();
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(page.getByRole("combobox", { name: "Model", exact: true })).toContainText("Claude");
  await sort.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(sort).toBeFocused();
  await shot("writing-1085");
  await sort.click();
  await shot("sort-open-1085");
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Edit Merrin Ashvale" }).click();
  const backstory = (await page.getByLabel("Backstory & personality").boundingBox())!;
  const setting = (await page.getByLabel("Campaign setting").boundingBox())!;
  expect(Math.abs(backstory.y + backstory.height - setting.y - setting.height)).toBeLessThan(1);
  const name = (await page.getByLabel("Name Required").boundingBox())!;
  const portrait = (await page.getByRole("button", { name: "Upload portrait" }).boundingBox())!;
  expect(Math.abs(name.y - portrait.y)).toBeLessThan(1);
  expect(Math.abs(name.height - portrait.height)).toBeLessThan(1);
  await page.locator("#character-sheet").setInputFiles({
    name: "Merrin level seven.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4\nfixture"),
  });
  await expect(page.getByText("Merrin level seven.pdf", { exact: true })).toBeVisible();
  await expect(page.locator(".attachment-status time")).toHaveAttribute("datetime", /T/);
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL("/generate");
  expect((await localCharacters(page))[0].characterSheetMetadata).toMatchObject({
    name: "Merrin level seven.pdf",
    size: 16,
  });
  await page.getByRole("link", { name: "Edit Merrin Ashvale" }).click();
  await shot("editor-1085");
  await page.setViewportSize({ width: 390, height: 844 });
  await shot("editor-mobile");
  await page.getByRole("button", { name: "Remove PDF" }).click({ trial: true });
  await page.getByRole("button", { name: "Back to workspace" }).click();
  await expect(page.getByRole("button", { name: "Show scene" })).toBeVisible();
  await shot("writing-mobile");
});
