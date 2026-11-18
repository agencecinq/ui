import { playwright } from "@vitest/browser-playwright";
import type { BrowserCommand } from "vitest/node";

export type DragCommandOptions = {
  /** Horizontal move, in CSS px of the tested page. */
  dx?: number;
  /** Vertical move, in CSS px of the tested page. */
  dy?: number;
  /** Where to press, from the center of the element, in CSS px of the tested page. */
  at?: { x?: number; y?: number };
  /** Number of moves between press and release. */
  steps?: number;
  /** Pause after each move, in ms. About one frame by default: a faster drag reads as a flick. */
  delay?: number;
  button?: "left" | "right" | "middle";
  /** Pause before the release, in ms. */
  hold?: number;
};

/**
 * Presses the mouse at the center of `selector` (moved by `at`), moves it by
 * `dx` and `dy` in steps, and releases it. A real pointer: synthetic events
 * cannot take a pointer capture. Distances are in CSS px of the tested page,
 * whatever the scale Vitest gives its frame.
 */
const drag: BrowserCommand<[selector: string, options?: DragCommandOptions]> = async (
  context,
  selector,
  { dx = 0, dy = 0, at = {}, steps = 8, delay = 16, button = "left", hold = 0 } = {},
) => {
  if (context.provider.name !== "playwright") {
    throw new Error("drag needs the playwright provider");
  }

  const $element = context.iframe.locator(selector);
  const box = await $element.boundingBox();
  const width = await $element.evaluate((element) => element.getBoundingClientRect().width);

  if (!box || !width) {
    throw new Error(`No box for ${selector}`);
  }

  // Page px per CSS px of the frame.
  const scale = box.width / width;
  const x = box.x + box.width / 2 + (at.x ?? 0) * scale;
  const y = box.y + box.height / 2 + (at.y ?? 0) * scale;
  const { mouse } = context.page;

  await mouse.move(x, y);
  await mouse.down({ button });

  for (let step = 1; step <= steps; step += 1) {
    await mouse.move(x + (dx * scale * step) / steps, y + (dy * scale * step) / steps);
    await context.page.waitForTimeout(delay);
  }

  await context.page.waitForTimeout(hold);
  await mouse.up({ button });
};

/**
 * Vitest browser mode shared by the packages: Chromium, Firefox and WebKit
 * through Playwright, with the `drag` command.
 *
 * @example
 * export default defineConfig({ test: { include: ["src/**\/*.test.ts"], browser } });
 */
export const browser = {
  enabled: true,
  headless: true,
  provider: playwright(),
  commands: { drag },
  instances: [
    { browser: "chromium" as const },
    { browser: "firefox" as const },
    { browser: "webkit" as const },
  ],
};
