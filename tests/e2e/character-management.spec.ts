import { test, expect } from "@playwright/test";
import { seed, localCharacters } from "./helpers";

test("creates a character with only a name and restores it after reload", async ({ page }) => {
  await page.goto("/characters/new");
  await page.getByLabel("Name Required").fill("Merrin");
  await page.getByRole("button", { name: "Create character", exact: true }).click();
  await expect(page).toHaveURL("/generate");
  await expect(page.getByRole("button", { name: "Choose character" })).toContainText("Merrin");
  await page.reload();
  await expect(page.getByRole("button", { name: "Choose character" })).toContainText("Merrin");
});
test("edits a full profile and protects unsaved changes", async ({ page }) => {
  await seed(page);
  await page.goto("/characters/merrin/edit");
  await page.getByLabel("Backstory & personality").fill("A new chapter");
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).last().click();
  await expect(page.getByLabel("Backstory & personality")).toHaveValue("A new chapter");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL("/generate");
  expect((await localCharacters(page))[0].backstory).toBe("A new chapter");
});
test("discards changes only after confirmation", async ({ page }) => {
  await seed(page);
  await page.goto("/characters/merrin/edit");
  await page.getByLabel("Name Required").fill("Changed name");
  await page.getByRole("button", { name: "Back to workspace" }).click();
  await page.getByRole("button", { name: "Discard changes" }).click();
  await expect(page).toHaveURL("/generate");
  expect((await localCharacters(page))[0].name).toBe("Merrin Ashvale");
});
test("attaches and removes a portrait and PDF", async ({ page }) => {
  await seed(page);
  await page.goto("/characters/merrin/edit");
  const png = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    canvas.getContext("2d")!.fillRect(0, 0, 16, 16);
    return canvas.toDataURL().split(",")[1];
  });
  await page.getByLabel("Portrait image").setInputFiles({
    name: "portrait.png",
    mimeType: "image/png",
    buffer: Buffer.from(png, "base64"),
  });
  await expect(page.getByRole("img", { name: /Portrait of/ })).toBeVisible();
  await page.locator("#character-sheet").setInputFiles({
    name: "sheet.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4\nfixture"),
  });
  await expect(page.getByText("sheet.pdf", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL("/generate");
  expect((await localCharacters(page))[0].portrait).toMatch(/^data:image\//);
  await page.getByRole("link", { name: "Edit Merrin Ashvale" }).click();
  await page.getByRole("button", { name: "Remove portrait", exact: true }).click();
  await page.getByRole("button", { name: "Remove PDF" }).click();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL("/generate");
  expect((await localCharacters(page))[0].portrait).toBeUndefined();
  expect((await localCharacters(page))[0].characterSheet).toBeUndefined();
});
test("rejects invalid portrait files without losing the draft", async ({ page }) => {
  await seed(page);
  await page.goto("/characters/merrin/edit");
  await page.getByLabel("Name Required").fill("Keep this name");
  await page
    .getByLabel("Portrait image")
    .setInputFiles({ name: "image.svg", mimeType: "image/svg+xml", buffer: Buffer.from("<svg/>") });
  await expect(page.locator(".inline-error")).toContainText("JPG, PNG, or WebP");
  await expect(page.getByLabel("Name Required")).toHaveValue("Keep this name");
});
test("deletes a character with the direct icon and confirmation", async ({ page }) => {
  await seed(page);
  await page.goto("/characters/merrin/edit");
  await page.getByRole("button", { name: "Delete character", exact: true }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete character", exact: true })
    .click();
  await expect(page).toHaveURL("/generate");
  await expect(page.getByRole("heading", { name: "Every character has a voice." })).toBeVisible();
});
test("handles missing characters and a narrow editor", async ({ page }) => {
  await seed(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/characters/merrin/edit");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Attach PDF" }).click({ trial: true });
  await page.getByRole("button", { name: "Save changes" }).click({ trial: true });
  await page.goto("/characters/missing/edit");
  await expect(page.getByRole("heading", { name: "Character not found" })).toBeVisible();
});
