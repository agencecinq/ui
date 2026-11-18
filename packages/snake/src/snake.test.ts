import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { commands } from "vitest/browser";
import type { DragCommandOptions } from "../../utils/vitest.browser";
import Game from "./game.js";
import "./index.js";

declare module "vitest/browser" {
  interface BrowserCommands {
    drag: (selector: string, options?: DragCommandOptions) => Promise<void>;
  }
}

/** The heading a swipe asks for: the game decides what to do with it. */
let turns: string[] = [];

beforeEach(() => {
  turns = [];
  vi.spyOn(Game.prototype, "setDirection").mockImplementation((direction) => {
    turns.push(direction);
  });

  document.body.innerHTML = `
    <cinq-snake cols="15" rows="15">
      <canvas tabindex="0" aria-label="Snake" style="display: block; width: 300px; height: 300px; touch-action: none"></canvas>
    </cinq-snake>
  `;
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("cinq-snake, swipe", () => {
  it("turns toward the swipe, on its dominant axis", async () => {
    await commands.drag("canvas", { dx: 60 });
    await commands.drag("canvas", { dy: 60 });
    await commands.drag("canvas", { dx: -60, dy: 20 });
    await commands.drag("canvas", { dx: 20, dy: -60 });

    expect(turns).toEqual(["right", "down", "left", "up"]);
  });

  it("ignores a press shorter than 24 px", async () => {
    await commands.drag("canvas", { dx: 16, dy: 10 });

    expect(turns).toEqual([]);
  });

  it("focuses the board on a press, so the arrow keys follow", async () => {
    await commands.drag("canvas");

    expect(document.activeElement).toBe(document.querySelector("canvas"));
  });
});
