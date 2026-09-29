import { expect, type Page } from "@playwright/test";
import { characterFixture, quipFixtures } from "../fixtures/characters";
export { characterFixture, quipFixtures };
export async function seed(page: Page, withFavorites = false) {
  await page.addInitScript(
    ({ character, lines, withFavorites }) => {
      if (sessionStorage.getItem("redesign-fixture")) return;
      sessionStorage.setItem("redesign-fixture", "yes");
      localStorage.setItem(
        "dnd-flavor-characters",
        JSON.stringify([
          {
            ...character,
            favorites: withFavorites
              ? lines.map((line, index) => ({
                  ...line,
                  type: index % 2 ? "catchphrase" : "mockery",
                  context: index % 2 ? "At the tavern" : "Dueling a knight",
                  createdAt: 1700000000000 + index,
                }))
              : [],
          },
        ]),
      );
      localStorage.setItem(
        "dnd-flavor-settings",
        JSON.stringify({
          provider: "openai",
          apiKey: "test-only-not-a-real-key",
          apiKeys: {
            openai: "test-only-not-a-real-key",
            anthropic: "",
            google: "",
            openrouter: "",
          },
          model: "gpt-5",
          temperature: 0.8,
          theme: "light",
        }),
      );
    },
    { character: characterFixture, lines: quipFixtures, withFavorites },
  );
}
export async function mockGeneration(page: Page, lines = quipFixtures) {
  await page.route("**/generate", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    await route.fulfill({
      status: 200,
      contentType: "text/x-component",
      body: `0:{"a":"$@1","f":"","b":"test"}\n1:${JSON.stringify(lines)}\n`,
    });
  });
}
export async function generate(page: Page) {
  await page.getByRole("button", { name: "Generate lines", exact: true }).click();
  await expect(page.getByRole("article").first()).toBeVisible();
}
export async function localCharacters(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("dnd-flavor-characters") || "[]"));
}
