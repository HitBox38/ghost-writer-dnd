import { test, expect } from "@playwright/test";

test.describe("Settings Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/generate");
    await page.evaluate(() => localStorage.clear());
  });

  test("should open settings dialog", async ({ page }) => {
    await page.getByRole("button", { name: /settings/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Configure your AI provider")).toBeVisible();
  });

  test("should switch between settings tabs", async ({ page }) => {
    await page.getByRole("button", { name: /settings/i }).click();

    // API tab
    await page.getByRole("tab", { name: "API" }).click();
    await expect(page.getByText(/Your API keys never leave/i)).toBeVisible();

    // Appearance tab
    await page.getByRole("tab", { name: "Appearance" }).click();
    await expect(page.getByText("Theme")).toBeVisible();

    // Data tab
    await page.getByRole("tab", { name: "Data" }).click();
    await expect(page.getByText("Export Data")).toBeVisible();
  });

  test("should configure API key for each provider", async ({ page }) => {
    await page.getByRole("button", { name: /settings/i }).click();

    // Expand OpenAI accordion
    await page.getByRole("button", { name: /OpenAI/i }).click();
    await page
      .getByRole("region", { name: /OpenAI/i })
      .getByLabel(/API Key/i)
      .fill("sk-test-key");

    // Close dialog
    await page.keyboard.press("Escape");

    // Reopen and verify key is saved
    await page.getByRole("button", { name: /settings/i }).click();
    await page.getByRole("button", { name: /OpenAI/i }).click();
    await expect(page.getByRole("region", { name: /OpenAI/i }).getByLabel(/API Key/i)).toHaveValue(
      "sk-test-key"
    );
  });

  test("should show active badge for current provider", async ({ page }) => {
    await page.getByRole("button", { name: /settings/i }).click();

    // Set OpenAI key
    await page.getByRole("button", { name: /OpenAI/i }).click();
    await page
      .getByRole("region", { name: /OpenAI/i })
      .getByLabel(/API Key/i)
      .fill("sk-test");

    // Should show Active badge
    await expect(page.getByText("Active").first()).toBeVisible();
  });

  test("should toggle theme", async ({ page }) => {
    await page.getByRole("button", { name: /settings/i }).click();
    await page.getByRole("tab", { name: "Appearance" }).click();

    // Click dark mode
    await page.getByRole("button", { name: /Dark/i }).click();

    // Verify dark class is applied
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });
});
