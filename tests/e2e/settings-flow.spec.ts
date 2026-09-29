import { test, expect } from "@playwright/test";
import { seed } from "./helpers";

test.beforeEach(async ({ page }) => {
  await seed(page);
  await page.goto("/settings/connections");
});
test("saves credentials explicitly without changing the active provider", async ({ page }) => {
  const anthropic = page
    .locator("details")
    .filter({ has: page.locator("summary", { hasText: "Anthropic" }) });
  await anthropic.locator("summary").click();
  await anthropic.getByLabel("Anthropic API key").fill("test-anthropic");
  let settings = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("dnd-flavor-settings")!),
  );
  expect(settings.apiKeys.anthropic).toBe("");
  await anthropic.getByRole("button", { name: "Save key", exact: true }).click();
  settings = await page.evaluate(() => JSON.parse(localStorage.getItem("dnd-flavor-settings")!));
  expect(settings.provider).toBe("openai");
  expect(settings.apiKeys.anthropic).toBe("test-anthropic");
  await anthropic.getByRole("button", { name: "Use this provider" }).click();
  settings = await page.evaluate(() => JSON.parse(localStorage.getItem("dnd-flavor-settings")!));
  expect(settings.apiKey).toBe("test-anthropic");
  await expect(anthropic.locator("summary")).toContainText("In use · Key saved");
});
test("masks stored keys and toggles visibility", async ({ page }) => {
  const key = page.getByLabel("OpenAI API key");
  await expect(key).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show OpenAI key" }).click();
  await expect(key).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Hide OpenAI key" }).click();
  await expect(key).toHaveAttribute("type", "password");
});
test("shows verified status only after a successful connection test", async ({ page }) => {
  await page.route("**/settings/connections", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    await route.fulfill({
      contentType: "text/x-component",
      body: '0:{"a":"$@1","f":"","b":"test"}\n1:true\n',
    });
  });
  await expect(page.locator("summary").first()).toContainText("Key saved");
  await page.getByRole("button", { name: "Test connection", exact: true }).first().click();
  await expect(page.locator("summary").first()).toContainText("Connection verified");
});
test("follows changes to the system theme", async ({ page }) => {
  await page.getByRole("link", { name: "Appearance", exact: true }).click();
  await page.getByRole("button", { name: "System", exact: true }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveClass(/light/);
});
test.describe("mobile settings", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("provides mobile section navigation without overflow", async ({ page }) => {
    await page.getByRole("combobox", { name: "Settings section" }).click();
    await page.getByRole("option", { name: "Data & backups", exact: true }).click();
    await expect(page).toHaveURL("/settings/data");
    await expect(page.getByRole("heading", { name: "Data & backups" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
});
