import { test, expect } from "@playwright/test";

test.describe("Character Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/generate");
  });

  test("should create a new character", async ({ page }) => {
    await page.getByRole("button", { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill("Aragorn");
    await page.getByLabel(/race/i).fill("Human");
    await page.getByLabel(/class/i).fill("Ranger");
    await page.getByLabel(/level/i).fill("15");
    await page.getByLabel(/backstory/i).fill("Heir of Isildur");
    await page.getByRole("button", { name: /create character/i }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.getByRole("button", { name: "Aragorn", exact: true })).toBeVisible();
    await expect(page.getByText("Generation Type", { exact: true })).toBeVisible();
  });

  test("should switch between characters", async ({ page }) => {
    await page.getByRole("button", { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill("Frodo");
    await page.getByRole("button", { name: /create character/i }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.getByRole("button", { name: "Frodo", exact: true }).click();
    await page.getByRole("menuitem", { name: /create new character/i }).click();
    await page.getByLabel(/character name/i).fill("Sam");
    await page.getByRole("button", { name: /create character/i }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.getByRole("button", { name: "Sam", exact: true }).click();
    await page.getByRole("menuitem", { name: /frodo/i }).click();
    await expect(page.getByRole("button", { name: "Frodo", exact: true })).toBeVisible();
  });
});
