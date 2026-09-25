import { test, expect } from "@playwright/test";
import { MODEL_OPTIONS } from "../../lib/types";

test.describe("Generate Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/generate");
    await page.evaluate(() => localStorage.clear());
  });

  test("should redirect to /generate from home", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/generate");
  });

  test("should show no character state initially", async ({ page }) => {
    await page.goto("/generate");
    await expect(page.getByText("No Character Selected")).toBeVisible();
  });

  test("should create character and show generation controls", async ({ page }) => {
    await page.goto("/generate");

    // Click create character button
    await page.getByRole("button", { name: /create first character/i }).click();

    // Fill character form
    await page.getByLabel(/character name/i).fill("Gandalf");
    await page.getByLabel(/race/i).fill("Maia");
    await page.getByLabel(/class/i).fill("Wizard");
    await page.getByLabel(/level/i).fill("20");

    // Submit form
    await page.getByRole("button", { name: /create character/i }).click();

    // Should see generation controls
    await expect(page.getByText("Generation Type")).toBeVisible();
    await expect(page.getByText("AI Provider")).toBeVisible();
  });

  test("should show API key warning when not configured", async ({ page }) => {
    await page.goto("/generate");

    // Create a character first
    await page.getByRole("button", { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill("Test");
    await page.getByRole("button", { name: /create character/i }).click();

    // Should see API key warning
    await expect(page.getByText(/configure your API key in settings/i)).toBeVisible();
  });

  test("should switch between generation types", async ({ page }) => {
    await page.goto("/generate");

    // Create character
    await page.getByRole("button", { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill("Test");
    await page.getByRole("button", { name: /create character/i }).click();

    // Switch to Catchphrases
    await page.getByRole("tab", { name: /catchphrases/i }).click();
    await expect(page.getByRole("tab", { name: /catchphrases/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("should operate Base UI selects and sliders with the keyboard", async ({ page }) => {
    await page.getByRole("button", { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill("Keyboard Test");
    await page.getByRole("button", { name: /create character/i }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    const provider = page.getByRole("combobox", { name: "AI Provider" });
    await expect(provider).toContainText("OpenAI");
    await provider.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("option", { name: "Anthropic", exact: true }).click();
    await expect(provider).toContainText("Anthropic");
    const model = page.getByRole("combobox", { name: "Model", exact: true });
    await expect(model).toContainText(MODEL_OPTIONS.anthropic[0].label);
    await model.click();
    await page.getByRole("option", { name: MODEL_OPTIONS.anthropic[1].label, exact: true }).click();
    await expect(model).toContainText(MODEL_OPTIONS.anthropic[1].label);

    const count = page.getByRole("slider", { name: /Number of Results/ });
    await count.focus();
    await page.keyboard.press("End");
    await expect(count).toHaveAttribute("aria-valuenow", "25");
    const temperature = page.getByRole("slider", { name: /Temperature/ });
    await temperature.focus();
    await page.keyboard.press("Home");
    await expect(temperature).toHaveAttribute("aria-valuenow", "0");
  });

  test("should navigate to favorites page", async ({ page }) => {
    await page.goto("/generate");

    await page.getByRole("link", { name: /favorites/i }).click();
    await expect(page).toHaveURL("/favorites");
    await expect(page.getByText("Favorites", { exact: true })).toBeVisible();
  });
});
