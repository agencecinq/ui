import { defineConfig } from "vitest/config";
import { browser } from "../utils/vitest.browser";

// Real browsers: the sheet leans on <dialog>, popovers, invoker commands, close
// requests and pointer capture, which only a browser engine implements.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    browser,
  },
});
