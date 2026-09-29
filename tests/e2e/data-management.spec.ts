import { test, expect } from "@playwright/test";
import { seed, characterFixture, localCharacters } from "./helpers";

test.beforeEach(async ({ page }) => {
  await seed(page, true);
  await page.goto("/settings/data");
});
test("exports all character data but no provider credentials", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export backup" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const data = JSON.parse(Buffer.concat(chunks).toString());
  expect(data.characters[0].favorites).toHaveLength(12);
  expect(data.settings).not.toHaveProperty("apiKey");
  expect(data.settings).not.toHaveProperty("apiKeys");
});
test("imports after confirmation and preserves local provider keys", async ({ page }) => {
  const backup = {
    characters: [
      { ...characterFixture, id: "restored", name: "Restored character", characterSheet: "" },
    ],
    settings: {
      theme: "dark",
      resultLayout: "list",
      apiKey: "untrusted-imported-key",
      apiKeys: { openai: "untrusted-imported-key" },
    },
  };
  await page.getByLabel("Backup file").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  expect((await localCharacters(page))[0].name).toBe("Merrin Ashvale");
  await page.getByRole("button", { name: "Restore backup", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toBeHidden();
  expect((await localCharacters(page))[0].name).toBe("Restored character");
  const settings = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("dnd-flavor-settings")!),
  );
  expect(settings.apiKey).toBe("test-only-not-a-real-key");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("link", { name: "Write", exact: true }).click();
  await expect(page.getByRole("button", { name: "List", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
test("rejects malformed data without replacing characters", async ({ page }) => {
  await page.getByLabel("Backup file").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"characters":[{"name":"Incomplete"}]}'),
  });
  await page.getByRole("button", { name: "Restore backup", exact: true }).click();
  await expect(page.locator(".inline-error")).toContainText("Failed to import");
  expect((await localCharacters(page))[0].name).toBe("Merrin Ashvale");
});
test("requires confirmation before clearing local data", async ({ page }) => {
  await page.getByRole("button", { name: "Clear local data", exact: true }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(await localCharacters(page)).toHaveLength(1);
  await page.getByRole("button", { name: "Clear local data", exact: true }).click();
  await page.getByRole("button", { name: "Clear all data", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toBeHidden();
  expect(await localCharacters(page)).toHaveLength(0);
  expect(await page.evaluate(() => localStorage.getItem("dnd-flavor-settings"))).toBeNull();
});
