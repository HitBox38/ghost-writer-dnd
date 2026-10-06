import type { Page } from "@playwright/test";

export const prepareClipboard = async (page: Page, browserName: string) => {
  if (browserName === "chromium") {
    await page.context().grantPermissions(["clipboard-write", "clipboard-read"]);
    return;
  }

  // Firefox and WebKit do not expose Chromium's clipboard permission controls.
  // Capture the application's clipboard writes while keeping the same assertions.
  await page.evaluate(() => {
    let text = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          text = value;
        },
        readText: async () => text,
      },
    });
  });
};
