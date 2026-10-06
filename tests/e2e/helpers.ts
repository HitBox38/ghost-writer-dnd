import { expect, type Page } from "@playwright/test";
import { characterFixture, quipFixtures } from "@/tests/fixtures/characters";
export { characterFixture, quipFixtures };
export const seed = async (page: Page, withFavorites = false) => {
  await page.route("**/generate", async (route) => {
    const request = route.request();
    if (request.method() !== "POST" || !request.headers()["next-action"]) return route.fallback();
    const [provider] = request.postDataJSON();
    if (typeof provider !== "string") return route.fallback();
    await route.fulfill({
      contentType: "text/x-component",
      body: `0:{"a":"$@1","f":"","b":"test"}\n1:${JSON.stringify([
        provider === "anthropic"
          ? { value: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" }
          : { value: "gpt-5", label: "GPT-5" },
      ])}\n`,
    });
  });
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
};
export const mockGeneration = async (page: Page, lines = quipFixtures) => {
  await page.route("**/generate", async (route) => {
    const request = route.request();
    if (request.method() !== "POST" || !request.headers()["next-action"]) return route.fallback();
    // Model discovery and generation share the same Server Action endpoint.
    const [character] = request.postDataJSON();
    if (typeof character !== "object" || character === null) return route.fallback();
    await route.fulfill({
      status: 200,
      contentType: "text/x-component",
      body: `0:{"a":"$@1","f":"","b":"test"}\n1:${JSON.stringify(lines)}\n`,
    });
  });
};
export const generate = async (page: Page) => {
  await page.getByRole("button", { name: "Generate lines", exact: true }).click();
  await expect(page.getByRole("article").first()).toBeVisible();
};
export const localCharacters = async (page: Page) => {
  return page.evaluate(() => JSON.parse(localStorage.getItem("dnd-flavor-characters") || "[]"));
};
