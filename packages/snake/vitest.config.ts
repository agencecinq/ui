import { defineConfig } from "vitest/config";
import { browser } from "../utils/vitest.browser";

// Real browsers: a swipe needs pointer capture, which only a browser engine implements.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    browser,
  },
});
