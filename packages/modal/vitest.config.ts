import { defineConfig } from "vitest/config";
import { browser } from "../utils/vitest.browser";

// Real browsers: the modal leans on <dialog>, invoker commands and close
// requests, which only a browser engine implements.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    browser,
  },
});
