import { test, expect } from "@playwright/test";

test.describe("Character Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/generate");
    await page.evaluate(() => localStorage.clear());
  });

  test("should create a new character", async ({ page }) => {
    await page.getByRole("button", { name: /create first character/i }).click();

    // Fill form
    await page.getByLabel(/character name/i).fill("Aragorn");
    await page.getByLabel(/race/i).fill("Human");
    await page.getByLabel(/class/i).fill("Ranger");
    await page.getByLabel(/level/i).fill("15");
    await page.getByLabel(/backstory/i).fill("Heir of Isildur");

    // Submit and wait for dialog to close
    await page.getByRole("button", { name: /create character/i }).click();
    await page.waitForSelector("role=dialog", { state: "detached" });

    await page.getByRole("button", { name: /select character/i }).click();

    // Verify character appears in selector
    await expect(page.getByText(/Aragorn/i)).toBeVisible();
  });

  test("should switch between characters", async ({ page }) => {
    // Create first character
    await page.getByRole("button", { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill("Frodo");
    await page.getByRole("button", { name: /create character/i }).click();
    await page.waitForSelector("role=dialog", { state: "detached" });
    await page.getByRole("button", { name: /select character/i }).click();
    await expect(page.getByText(/frodo/i)).toBeVisible();

    // Create second character
    await page.getByText(/frodo/i).click();
    await page.getByRole("button", { name: /select character/i }).click();
    await page.getByRole("menuitem", { name: /create new character/i }).click();
    await page.getByLabel(/character name/i).fill("Sam");
    await page.getByRole("button", { name: /create character/i }).click();
    await page.waitForSelector("role=dialog", { state: "detached" });

    await page.getByRole("button", { name: /select character/i }).click();
    await expect(page.getByText(/sam/i)).toBeVisible();

    // Switch to Frodo
    await page.getByText(/frodo/i).click();

    // Verify active character
    await expect(page.getByText(/frodo/i)).toBeVisible();
  });
});
