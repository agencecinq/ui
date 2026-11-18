import { defineConfig } from "vitest/config";
import { browser } from "./vitest.browser";

// Real browsers: pointer capture and pointer events only exist in an engine.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    browser,
  },
});
