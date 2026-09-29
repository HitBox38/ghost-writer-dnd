import { test, expect } from "@playwright/test";
import { seed, mockGeneration, generate, quipFixtures, localCharacters } from "./helpers";

test("first run leads to character creation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/generate");
  await page.getByRole("link", { name: "Create your first character" }).click();
  await expect(page).toHaveURL("/characters/new");
});

test.describe("Writing workspace", () => {
  test.beforeEach(async ({ page }) => {
    await seed(page);
    await mockGeneration(page);
    await page.goto("/generate");
  });
  test("generates twelve lines, saves and unsaves in sync with the collection", async ({
    page,
  }) => {
    await page.getByLabel("What's happening?").fill("A pompous knight challenges you");
    await page.getByLabel("Number of lines").fill("12");
    await generate(page);
    await expect(page.getByRole("article")).toHaveCount(12);
    await page
      .getByRole("article")
      .first()
      .getByRole("button", { name: "Save", exact: true })
      .click();
    expect((await localCharacters(page))[0].favorites).toHaveLength(1);
    await page.getByRole("link", { name: "Saved lines", exact: true }).click();
    await expect(page.getByRole("article")).toHaveCount(1);
    await page.getByRole("link", { name: "Write", exact: true }).click();
    await expect(page.getByLabel("What's happening?")).toHaveValue(
      "A pompous knight challenges you",
    );
    await expect(page.getByRole("article")).toHaveCount(12);
    await page.getByRole("button", { name: "Saved", exact: true }).click();
    expect((await localCharacters(page))[0].favorites).toHaveLength(0);
  });
  test("collapses the full scene column, retains drafts and restores focus", async ({ page }) => {
    await page.getByLabel("What's happening?").fill("Keep this scene");
    await page.getByLabel("Number of lines").fill("25");
    await page.getByRole("button", { name: "Hide scene" }).click();
    await expect(page.getByRole("button", { name: "Show scene" })).toBeFocused();
    await expect(page.locator(".scene-sidebar")).toHaveAttribute("inert", "");
    await page.getByRole("button", { name: "Show scene" }).click();
    await expect(page.getByRole("button", { name: "Hide scene" })).toBeFocused();
    await expect(page.getByLabel("What's happening?")).toHaveValue("Keep this scene");
    await expect(page.getByLabel("Number of lines")).toHaveValue("25");
  });
  test("sorts without filtering and keeps layout choices", async ({ page }) => {
    await generate(page);
    const secondText = quipFixtures[1].text;
    await page
      .getByRole("article")
      .nth(1)
      .getByRole("button", { name: "Save", exact: true })
      .click();
    await page.getByRole("combobox", { name: "Sort lines" }).click();
    await page.getByRole("option", { name: "Saved first", exact: true }).click();
    await expect(page.getByRole("article").first()).toContainText(secondText);
    await expect(page.getByRole("article")).toHaveCount(12);
    await page.getByRole("button", { name: "List", exact: true }).click();
    await page.getByRole("button", { name: "Hide scene" }).click();
    await expect(page.getByRole("button", { name: "List", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("combobox", { name: "Sort lines" }).click();
    await page.getByRole("option", { name: "Original order", exact: true }).click();
    await expect(page.getByRole("article").first()).toContainText(quipFixtures[0].text);
  });
  test("preserves work through dedicated settings routes", async ({ page }) => {
    await page.getByLabel("What's happening?").fill("The party meets a dragon");
    await generate(page);
    await page.getByRole("link", { name: "Settings", exact: true }).click();
    await expect(page).toHaveURL("/settings/connections");
    await page.getByRole("link", { name: "Appearance", exact: true }).click();
    await page.getByRole("button", { name: "Dark", exact: true }).click();
    await page.getByRole("link", { name: "Back to workspace" }).click();
    await expect(page.getByLabel("What's happening?")).toHaveValue("The party meets a dragon");
    await expect(page.getByRole("article")).toHaveCount(12);
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
  test("keeps all 25 long results reachable in the scrolling list", async ({ page }) => {
    const lines = Array.from({ length: 25 }, (_, index) => ({
      id: String(index),
      text: `Line ${index + 1}. ${quipFixtures[index % 12].text}`,
    }));
    await mockGeneration(page, lines);
    await page.getByLabel("Number of lines").fill("25");
    await generate(page);
    await expect(page.getByRole("article")).toHaveCount(25);
    await page.getByRole("article").last().scrollIntoViewIfNeeded();
    await expect(page.getByRole("article").last()).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await page
      .getByRole("article")
      .last()
      .getByRole("button", { name: "Copy", exact: true })
      .click({ trial: true });
  });
  test("supports keyboard generation and rejects invalid counts", async ({ page }) => {
    await page.getByLabel("Number of lines").fill("26");
    await expect(page.getByRole("button", { name: "Generate lines" })).toBeDisabled();
    await page.getByLabel("Number of lines").fill("1");
    await page.getByLabel("What's happening?").focus();
    await page.keyboard.press("Control+Enter");
    await expect(page.getByRole("article")).toHaveCount(12);
  });
});
