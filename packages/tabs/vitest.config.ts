import { defineConfig } from "vitest/config";
import { browser } from "../utils/vitest.browser";

// Real browsers: focus, keyboard and the reading direction need an engine.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    browser,
  },
});
