import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

// Real browsers: focus, keyboard, mouse hover and ARIA element reflection need
// an engine.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [
        { browser: "chromium" },
        { browser: "firefox" },
        { browser: "webkit" },
      ],
    },
  },
});
