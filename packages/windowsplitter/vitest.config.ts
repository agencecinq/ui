import { defineConfig } from "vitest/config";
import { browser } from "../utils/vitest.browser";

// Real browsers: dragging the separator needs pointer capture and layout, which
// only a browser engine implements.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    browser,
  },
});
