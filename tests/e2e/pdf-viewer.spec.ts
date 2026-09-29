import { test, expect, type Page } from "@playwright/test";
import { seed, localCharacters } from "./helpers";
import { characterSheetPdf } from "../fixtures/pdf";

const pdf = characterSheetPdf();
async function seedPdf(page: Page) {
  await seed(page);
  await page.addInitScript(
    ({ sheet, size }) => {
      const characters = JSON.parse(localStorage.getItem("dnd-flavor-characters") || "[]");
      characters[0].characterSheet = sheet;
      characters[0].characterSheetMetadata = {
        name: "Merrin sheet.pdf",
        size,
        uploadedAt: 1700000000000,
      };
      localStorage.setItem("dnd-flavor-characters", JSON.stringify(characters));
    },
    { sheet: `data:application/pdf;base64,${pdf.toString("base64")}`, size: pdf.length },
  );
  await page.route("**/generate", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    await route.fulfill({
      status: 200,
      contentType: "text/x-component",
      body: '0:{"a":"$@1","f":"","b":"test"}\n1:[{"value":"gpt-5","label":"GPT-5"}]\n',
    });
  });
}

test("workspace PDF chip previews pages, zooms, and closes without navigation", async ({
  page,
}) => {
  await seedPdf(page);
  await page.goto("/generate");
  await page.getByLabel("What's happening?").fill("Keep this scene");
  const trigger = page.getByRole("button", { name: /Merrin sheet.pdf/ });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Merrin sheet.pdf" });
  await expect(dialog.getByText("Page 1 of 2", { exact: true })).toBeVisible();
  await expect(dialog.locator(".react-pdf__Page__textContent")).toContainText(
    "Character sheet - page 1",
  );
  await expect(dialog.locator("canvas")).toBeVisible();
  await dialog.getByRole("button", { name: "Next page" }).click();
  await expect(dialog.locator(".react-pdf__Page__textContent")).toContainText(
    "Character sheet - page 2",
  );
  await expect(dialog.getByRole("button", { name: "Next page" })).toBeDisabled();
  await dialog.getByRole("button", { name: "Zoom in" }).click();
  await expect(dialog.getByRole("button", { name: "Fit page to width" })).toHaveText("125%");
  await dialog.getByRole("button", { name: "Fit page to width" }).click();
  await dialog.getByRole("button", { name: "Previous page" }).click();
  await expect(dialog.locator(".react-pdf__Page__textContent")).toContainText(
    "Character sheet - page 1",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page).toHaveURL(/\/generate$/);
  await expect(page.getByLabel("What's happening?")).toHaveValue("Keep this scene");
});

test("mobile PDF preview closes back to the scene drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedPdf(page);
  await page.goto("/generate");
  await page.getByRole("button", { name: "Show scene" }).click();
  const trigger = page.getByRole("button", { name: /Merrin sheet.pdf/ });
  await trigger.click();
  const preview = page.getByRole("dialog", { name: "Merrin sheet.pdf" });
  await expect(preview.locator(".react-pdf__Page__textContent")).toContainText(
    "Character sheet - page 1",
  );
  const bounds = await preview.boundingBox();
  expect(bounds!.width).toBeLessThanOrEqual(390);
  expect(bounds!.height).toBeLessThanOrEqual(844);
  await preview.getByRole("button", { name: "Next page" }).click();
  await expect(preview.locator(".react-pdf__Page__textContent")).toContainText(
    "Character sheet - page 2",
  );
  await preview.getByRole("button", { name: "Close", exact: true }).click();
  await expect(preview).toBeHidden();
  await expect(page.getByRole("dialog", { name: "Set the scene" })).toBeVisible();
  await expect(trigger).toBeFocused();
});

for (const path of ["/characters/new", "/characters/merrin/edit"]) {
  test(`previews the current upload without saving on ${path}`, async ({ page }) => {
    await seedPdf(page);
    await page.goto(path);
    await page.getByLabel("Name", { exact: false }).fill("Unsaved bard");
    const replacement = characterSheetPdf("Unsaved bard");
    await page
      .locator("#character-sheet")
      .setInputFiles({ name: "New sheet.pdf", mimeType: "application/pdf", buffer: replacement });
    const trigger = page.getByRole("button", { name: "View PDF", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "New sheet.pdf" });
    await expect(dialog.locator(".react-pdf__Page__textContent")).toContainText("Unsaved bard");
    const downloaded = page.waitForEvent("download");
    await dialog.getByRole("link", { name: "Download PDF" }).click();
    expect((await downloaded).suggestedFilename()).toBe("New sheet.pdf");
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByLabel("Name", { exact: false })).toHaveValue("Unsaved bard");
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();
    expect((await localCharacters(page))[0].name).toBe("Merrin Ashvale");
  });
}

test("unreadable PDFs keep a download option and a working close button", async ({ page }) => {
  await seed(page);
  await page.goto("/characters/new");
  await page
    .locator("#character-sheet")
    .setInputFiles({
      name: "Broken.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("not a PDF"),
    });
  await page.getByRole("button", { name: "View PDF", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Broken.pdf" });
  await expect(dialog.getByRole("alert")).toContainText("This PDF couldn't be previewed");
  await expect(dialog.getByRole("link", { name: "Download PDF" })).toBeVisible();
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await expect(dialog).toBeHidden();
});
