import { test, expect } from "@playwright/test";

test.describe("Favorites Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/generate");
    await page.evaluate(() => localStorage.clear());

    // Create a character
    await page.getByRole("button", { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill("Gandalf");
    await page.getByLabel(/race/i).fill("Maia");
    await page.getByLabel(/class/i).fill("Wizard");
    await page.getByLabel(/level/i).fill("20");
    await page.getByLabel(/backstory/i).fill("A wise wizard from Middle Earth");
    await page.getByRole("button", { name: /create character/i }).click();
    await page.waitForSelector("role=dialog", { state: "detached" });

    // Add some favorites via localStorage
    await page.evaluate(() => {
      const stored = localStorage.getItem("dnd-flavor-characters");
      if (stored) {
        const characters = JSON.parse(stored);
        const character = characters[0];
        character.favorites = [
          {
            id: "fav-1",
            text: "You shall not pass!",
            type: "mockery",
            context: "facing a Balrog",
            createdAt: Date.now(),
          },
          {
            id: "fav-2",
            text: "A wizard is never late",
            type: "catchphrase",
            context: "arriving precisely",
            createdAt: Date.now(),
          },
          {
            id: "fav-3",
            text: "Fly, you fools!",
            type: "mockery",
            context: "dramatic escape",
            createdAt: Date.now(),
          },
          {
            id: "fav-4",
            text: "All we have to decide is what to do with the time that is given us",
            type: "catchphrase",
            createdAt: Date.now(),
          },
          {
            id: "fav-5",
            text: "I am a servant of the Secret Fire",
            type: "mockery",
            context: "wielder of flame",
            createdAt: Date.now(),
          },
        ];
        localStorage.setItem("dnd-flavor-characters", JSON.stringify(characters));
      }
    });

    // Reload the page to trigger Providers to reload the store
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Select the character if needed (activeCharacterId is not persisted, so we need to reselect)
    const selectCharacterButton = page.getByRole("button", { name: /select character/i });
    try {
      if (await selectCharacterButton.isVisible({ timeout: 1000 })) {
        await selectCharacterButton.click();
        await page.getByText("Gandalf").click();
      }
    } catch {
      // Character already selected or not needed
    }

    // Navigate to favorites
    await page.getByRole("link", { name: /favorites/i }).click();
    await expect(page).toHaveURL("/favorites");

    // Wait for favorites to be loaded
    await expect(page.getByText("5 total")).toBeVisible();
  });

  test("should display search input", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");
    await expect(searchInput).toBeVisible();
  });

  test("should filter favorites by text content", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Type search query
    await searchInput.fill("shall not pass");

    // Should show matching favorite
    await expect(page.getByText("You shall not pass!")).toBeVisible();

    // Should not show non-matching favorites
    await expect(page.getByText("A wizard is never late")).not.toBeVisible();
    await expect(page.getByText("Fly, you fools!")).not.toBeVisible();
  });

  test("should filter favorites by context", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Wait for favorites to be loaded before searching
    await expect(page.getByText("You shall not pass!")).toBeVisible();

    // Search by context
    await searchInput.fill("Balrog");

    // Should show favorite with matching context
    await expect(page.getByText("You shall not pass!")).toBeVisible();
    await expect(page.getByText(/Context: facing a Balrog/)).toBeVisible();

    // Should not show non-matching
    await expect(page.getByText("A wizard is never late")).not.toBeVisible();
  });

  test("should be case insensitive", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Wait for favorites to be loaded before searching
    await expect(page.getByText("You shall not pass!")).toBeVisible();

    // Type uppercase
    await searchInput.fill("WIZARD");

    // Should still match lowercase content
    await expect(page.getByText("A wizard is never late")).toBeVisible();
  });

  test("should show clear button when text is entered", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");
    const inputContainer = searchInput.locator("..");

    // No clear button initially (button is conditionally rendered)
    const clearButtonInitially = inputContainer.locator("button:has(svg)").last();
    await expect(clearButtonInitially).not.toBeVisible();

    // Type something and wait for input value to be set
    await searchInput.fill("wizard");
    await expect(searchInput).toHaveValue("wizard");

    // Clear button should appear (the last button with SVG in the container, which is the X button)
    // Wait for React to update and render the button
    const clearButton = inputContainer.locator("button:has(svg)").last();
    await expect(clearButton).toBeVisible({ timeout: 5000 });
  });

  test("should clear search when clear button is clicked", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");
    const inputContainer = searchInput.locator("..");

    // Enter search
    await searchInput.fill("wizard");
    await expect(searchInput).toHaveValue("wizard");

    // Wait for and click clear button (the last button with SVG, which is the X button)
    const clearButton = inputContainer.locator("button:has(svg)").last();
    await expect(clearButton).toBeVisible({ timeout: 5000 });
    await clearButton.click();

    // Should be cleared
    await expect(searchInput).toHaveValue("");

    // All favorites should be visible again
    await expect(page.getByText("You shall not pass!")).toBeVisible();
    await expect(page.getByText("A wizard is never late")).toBeVisible();
  });

  test("should update results count badge", async ({ page }) => {
    // Initially shows all 5 favorites
    await expect(page.getByText("5 total")).toBeVisible();

    const searchInput = page.getByPlaceholder("Search favorites...");
    await searchInput.fill("wizard");

    // Should update to show filtered count
    await expect(page.getByText("1 total")).toBeVisible();
  });

  test("should show empty state when no results found", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Search for non-existent text
    await searchInput.fill("xyznonexistent");

    // Should show empty state
    await expect(page.getByText("No results found")).toBeVisible();
    await expect(page.getByText(/No favorites match your search "xyznonexistent"/)).toBeVisible();

    // Should show clear search button
    await expect(page.getByRole("button", { name: /clear search/i })).toBeVisible();
  });

  test("should clear search from empty state", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Search for non-existent text
    await searchInput.fill("nonexistent");

    // Click clear button in empty state
    await page.getByRole("button", { name: /clear search/i }).click();

    // Should clear search
    await expect(searchInput).toHaveValue("");

    // Should show all favorites again
    await expect(page.getByText("You shall not pass!")).toBeVisible();
  });

  test("should filter within selected tab", async ({ page }) => {
    // Switch to Quips tab (mockery type)
    await page.getByRole("tab", { name: /Quips \(3\)/i }).click();

    // Search within quips
    const searchInput = page.getByPlaceholder("Search favorites...");
    await searchInput.fill("pass");

    // Should show matching quip
    await expect(page.getByText("You shall not pass!")).toBeVisible();

    // Should not show non-matching quip
    await expect(page.getByText("Fly, you fools!")).not.toBeVisible();

    // Should not show catchphrases
    await expect(page.getByText("A wizard is never late")).not.toBeVisible();
  });

  test("should persist search when switching tabs", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Enter search on All tab
    await searchInput.fill("wizard");
    await expect(page.getByText("A wizard is never late")).toBeVisible();

    // Switch to Catchphrases tab
    await page.getByRole("tab", { name: /Catchphrases \(2\)/i }).click();

    // Search should persist
    await expect(searchInput).toHaveValue("wizard");
    await expect(page.getByText("A wizard is never late")).toBeVisible();

    // Should not show quips
    await expect(page.getByText("You shall not pass!")).not.toBeVisible();
  });

  test("should handle multiple word search", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Multi-word search
    await searchInput.fill("shall not");

    await expect(page.getByText("You shall not pass!")).toBeVisible();
    await expect(page.getByText("A wizard is never late")).not.toBeVisible();
  });

  test("should handle partial word matching", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Partial word
    await searchInput.fill("serv");

    await expect(page.getByText("I am a servant of the Secret Fire")).toBeVisible();
  });

  test("should work with favorites that have no context", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Search for favorite without context
    await searchInput.fill("what to do with the time");

    await expect(
      page.getByText("All we have to decide is what to do with the time that is given us")
    ).toBeVisible();
  });

  test("should allow copying from search results", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");
    await searchInput.fill("shall not");

    // Hover to show action buttons
    const favoriteItem = page.locator("div", { hasText: "You shall not pass!" }).first();
    await favoriteItem.hover();

    // Click copy button
    const copyButton = favoriteItem.getByRole("button", { name: /copy/i });
    await copyButton.click();

    // Should show success toast
    await expect(page.getByText("Copied to clipboard")).toBeVisible();
  });

  test("should allow removing from search results", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");
    await searchInput.fill("shall not");

    // Hover to show action buttons
    const favoriteItem = page.locator("div", { hasText: "You shall not pass!" }).first();
    await favoriteItem.hover();

    // Setup dialog handler to confirm deletion
    page.on("dialog", (dialog) => dialog.accept());

    // Click delete button
    const deleteButton = favoriteItem.getByRole("button", { name: /delete/i });
    await deleteButton.click();

    // Should show success toast
    await expect(page.getByText("Removed from favorites")).toBeVisible();

    // Item should be removed
    await expect(page.getByText("You shall not pass!")).not.toBeVisible();
  });

  test("should maintain search input focus while typing", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    await searchInput.click();
    await searchInput.type("wizard");

    // Input should still be focused
    await expect(searchInput).toBeFocused();
  });

  test("should trim whitespace in search query", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search favorites...");

    // Search with leading/trailing spaces
    await searchInput.fill("  wizard  ");

    // Should still find matches
    await expect(page.getByText("A wizard is never late")).toBeVisible();
  });
});
