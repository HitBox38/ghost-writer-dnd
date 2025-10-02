import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.mts"],
    exclude: ["**/node_modules/**", "**/tests/e2e/**", "**/.next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "components/ui/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/dist/**",
        "vitest.setup.mts",
        "playwright.config.ts",
        "app/**/page.tsx",
        "app/**/layout.tsx",
        "app/globals.css",
        "components/providers.tsx",
      ],
      all: true,
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
