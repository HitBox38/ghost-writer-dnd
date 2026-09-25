import { test, expect } from "@playwright/test";
import { prepareClipboard } from "./helpers/clipboard";

test.describe("Favorites Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/generate");
    await page.evaluate(() => localStorage.clear());
  });

  test("should show empty state when no favorites", async ({ page }) => {
    // Create character
    await page.getByRole("button", { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill("Test Character");
    await page.getByRole("button", { name: /create character/i }).click();

    // Navigate to favorites
    await page.getByRole("link", { name: /favorites/i }).click();
    await expect(page).toHaveURL("/favorites");

    // Should show empty state
    await expect(page.getByText(/no favorites yet/i)).toBeVisible();
  });

  test("should show favorites count in badge", async ({ page }) => {
    // Create character with favorites
    const testData = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      characters: [
        {
          id: "test-char-1",
          name: "Test Character",
          class: "Wizard",
          race: "Human",
          level: 5,
          backstory: "Test backstory",
          appearance: "Test appearance",
          worldSetting: "Test world",
          favorites: [
            {
              id: "fav-1",
              text: "First favorite quote",
              type: "mockery",
              createdAt: Date.now(),
            },
            {
              id: "fav-2",
              text: "Second favorite quote",
              type: "catchphrase",
              createdAt: Date.now(),
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      settings: {
        provider: "openai",
        temperature: 0.7,
      },
      activeCharacterId: "test-char-1",
    };

    const dataStr = JSON.stringify(testData);

    await page.getByRole("button", { name: /settings/i }).click();
    await page.getByRole("tab", { name: "Data" }).click();

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(dataStr),
    });

    // Wait for import toast
    await expect(page.getByText(/data imported successfully/i)).toBeVisible();

    // Navigate to favorites
    await page.goto("/favorites");

    await page.getByText(/select character/i).click();
    await page.getByText(/test character/i).click();

    // Should show count in badge
    await expect(page.getByText("2 total")).toBeVisible();
  });

  test("should filter favorites by type", async ({ page }) => {
    // Create character with favorites
    const testData = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      characters: [
        {
          id: "test-char-1",
          name: "Test Character",
          class: "Wizard",
          race: "Human",
          level: 5,
          backstory: "Test backstory",
          appearance: "Test appearance",
          worldSetting: "Test world",
          favorites: [
            {
              id: "fav-1",
              text: "First mockery quote",
              type: "mockery",
              createdAt: Date.now(),
            },
            {
              id: "fav-2",
              text: "First catchphrase",
              type: "catchphrase",
              createdAt: Date.now(),
            },
            {
              id: "fav-3",
              text: "Second mockery quote",
              type: "mockery",
              createdAt: Date.now(),
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      settings: {
        provider: "openai",
        temperature: 0.7,
      },
      activeCharacterId: "test-char-1",
    };

    const dataStr = JSON.stringify(testData);

    await page.getByRole("button", { name: /settings/i }).click();
    await page.getByRole("tab", { name: "Data" }).click();

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(dataStr),
    });

    // Wait for import toast
    await expect(page.getByText(/data imported successfully/i)).toBeVisible();

    await page.goto("/favorites");
    await page.getByText(/select character/i).click();
    await page.getByText(/test character/i).click();

    // Click Quips tab
    await page.getByRole("tab", { name: /quips/i }).click();
    await expect(page.getByText("First mockery quote")).toBeVisible();
    await expect(page.getByText("First catchphrase")).not.toBeVisible();

    // Click Catchphrases tab
    await page.getByRole("tab", { name: /catchphrases/i }).click();
    await expect(page.getByText("First catchphrase")).toBeVisible();
    await expect(page.getByText("First mockery quote")).not.toBeVisible();

    // Click All tab
    await page.getByRole("tab", { name: /all/i }).click();
    await expect(page.getByText("First mockery quote")).toBeVisible();
    await expect(page.getByText("First catchphrase")).toBeVisible();
  });

  test("should select random favorite and reorder list", async ({ page, browserName }) => {
    // Create character with multiple favorites
    const testData = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      characters: [
        {
          id: "test-char-1",
          name: "Test Character",
          class: "Wizard",
          race: "Human",
          level: 5,
          backstory: "Test backstory",
          appearance: "Test appearance",
          worldSetting: "Test world",
          favorites: [
            {
              id: "fav-1",
              text: "First quote",
              type: "mockery",
              createdAt: Date.now() - 3000,
            },
            {
              id: "fav-2",
              text: "Second quote",
              type: "catchphrase",
              createdAt: Date.now() - 2000,
            },
            {
              id: "fav-3",
              text: "Third quote",
              type: "mockery",
              createdAt: Date.now() - 1000,
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      settings: {
        provider: "openai",
        temperature: 0.7,
      },
      activeCharacterId: "test-char-1",
    };

    const dataStr = JSON.stringify(testData);

    await page.getByRole("button", { name: /settings/i }).click();
    await page.getByRole("tab", { name: "Data" }).click();

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(dataStr),
    });

    // Wait for import toast
    await expect(page.getByText(/data imported successfully/i)).toBeVisible();

    await page.goto("/favorites");
    await page.getByText(/select character/i).click();
    await page.getByText(/test character/i).click();

    // Grant clipboard permissions
    await prepareClipboard(page, browserName);

    // Get all favorite items before clicking random
    const favoriteItems = page.locator(".group.p-4.rounded-lg");
    await expect(favoriteItems).toHaveCount(3);

    // Find and click the random button (Shuffle icon button)
    const randomButton = page.getByRole("button", { name: /random/i });
    await randomButton.click();

    // Wait for success toast
    await expect(page.getByText(/random (mockery|catchphrase) copied!/i)).toBeVisible();

    // Get the first item after random selection
    const firstItemAfter = await favoriteItems.first().locator("p").textContent();

    // Verify the selected item is now at the top
    expect(firstItemAfter).toMatch(/First quote|Second quote|Third quote/);

    // Verify clipboard matches the first item (which should be the randomly selected one)
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(firstItemAfter);
  });

  test("should show error when clicking random button with no favorites", async ({ page }) => {
    // Create character without favorites
    await page.getByRole("button", { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill("Test Character");
    await page.getByRole("button", { name: /create character/i }).click();

    await page.getByRole("link", { name: /favorites/i }).click();
    await expect(page.getByRole("button", { name: "Test Character", exact: true })).toBeVisible();

    // Click random button
    await page.getByLabel(/random/i).click();

    // Should show error toast
    await expect(
      page.locator("[data-title]").filter({ hasText: /no favorites to select from/i }),
    ).toBeVisible();
  });

  test("should copy favorite when clicking copy button", async ({ page, browserName }) => {
    const testData = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      characters: [
        {
          id: "test-char-1",
          name: "Test Character",
          class: "Wizard",
          race: "Human",
          level: 5,
          backstory: "Test backstory",
          appearance: "Test appearance",
          worldSetting: "Test world",
          favorites: [
            {
              id: "fav-1",
              text: "Test quote to copy",
              type: "mockery",
              createdAt: Date.now(),
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      settings: {
        provider: "openai",
        temperature: 0.7,
      },
      activeCharacterId: "test-char-1",
    };

    const dataStr = JSON.stringify(testData);

    await page.getByRole("button", { name: /settings/i }).click();
    await page.getByRole("tab", { name: "Data" }).click();

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(dataStr),
    });

    // Wait for import toast
    await expect(page.getByText(/data imported successfully/i)).toBeVisible();

    await page.goto("/favorites");
    await page.getByText(/select character/i).click();
    await page.getByText(/test character/i).click();

    await prepareClipboard(page, browserName);

    // Hover to reveal copy button and click it
    const favoriteItem = page.getByText(/test quote to copy/i).locator("..");
    await favoriteItem.hover();
    await favoriteItem.getByTitle(/copy to clipboard/i).click();

    // Verify clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("Test quote to copy");
  });

  test("should remove favorite when clicking delete button", async ({ page }) => {
    const testData = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      characters: [
        {
          id: "test-char-1",
          name: "Test Character",
          class: "Wizard",
          race: "Human",
          level: 5,
          backstory: "Test backstory",
          appearance: "Test appearance",
          worldSetting: "Test world",
          favorites: [
            {
              id: "fav-1",
              text: "Quote to delete",
              type: "mockery",
              createdAt: Date.now(),
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      settings: {
        provider: "openai",
        temperature: 0.7,
      },
      activeCharacterId: "test-char-1",
    };

    const dataStr = JSON.stringify(testData);

    await page.getByRole("button", { name: /settings/i }).click();
    await page.getByRole("tab", { name: "Data" }).click();

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "test-backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(dataStr),
    });

    // Wait for import toast
    await expect(page.getByText(/data imported successfully/i)).toBeVisible();

    await page.goto("/favorites");
    await page.getByText(/select character/i).click();
    await page.getByText(/test character/i).click();

    await expect(page.getByText(/no favorites yet/i)).not.toBeVisible();

    // Hover and click delete
    const favoriteItem = page.getByText("Quote to delete").locator("..");

    const deleteButton = favoriteItem.getByRole("button", { name: /delete/i });

    // Handle confirm dialog
    page.once("dialog", (dialog) => dialog.accept());
    await deleteButton.click();

    console.log(await page.getByText("Quote to delete").all());

    // Should show empty state
    await expect(page.getByText(/no favorites yet/i)).toBeVisible();
  });
});
