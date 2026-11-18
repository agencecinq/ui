import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import type { BrowserCommand } from "vitest/node";

/** Presses the mouse at the center of `selector`, moves it by `dy` and releases it. */
const drag: BrowserCommand<[selector: string, dy: number]> = async (context, selector, dy) => {
  if (context.provider.name !== "playwright") {
    throw new Error("drag needs the playwright provider");
  }

  const box = await context.iframe.locator(selector).boundingBox();

  if (!box) {
    throw new Error(`No box for ${selector}`);
  }

  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const { mouse } = context.page;

  await mouse.move(x, y);
  await mouse.down();
  // Slow steps, about one per frame: a fast move would read as a flick.
  for (let step = 1; step <= 8; step += 1) {
    await mouse.move(x, y + (dy * step) / 8);
    await context.page.waitForTimeout(16);
  }

  await mouse.up();
};

// Real browsers: the sheet leans on <dialog>, popovers, invoker commands, close
// requests and pointer capture, which only a browser engine implements.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      commands: { drag },
      instances: [
        { browser: "chromium" },
        { browser: "firefox" },
        { browser: "webkit" },
      ],
    },
  },
});
