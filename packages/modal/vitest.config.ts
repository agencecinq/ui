import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

// Real browsers: the modal leans on <dialog>, invoker commands and close
// requests, which only a browser engine implements.
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
