import { afterEach, describe, expect, it } from "vitest";
import { commands } from "vitest/browser";
import { EVENTS } from "@agencecinq/utils";
import type { DragCommandOptions } from "../../utils/vitest.browser";
import "./index.js";

declare module "vitest/browser" {
  interface BrowserCommands {
    drag: (selector: string, options?: DragCommandOptions) => Promise<void>;
  }
}

/** Rail 400 px wide, thumbs 40 px: a single thumb has a 360 px track, a range 320 px. */
const style = `
  <style>
    cinq-slider,
    cinq-slider-range {
      --thumb-size: 40px;
      position: relative;
      display: block;
      width: 400px;
      height: 40px;
      /* The test page is 414 px wide: no side margin, or the end of the rail falls off it. */
      margin: 120px 0;
    }

    cinq-slider:has([aria-orientation="vertical"]) {
      width: 40px;
      height: 400px;
    }

    [role="slider"] {
      position: absolute;
      top: 0;
      width: var(--thumb-size);
      height: var(--thumb-size);
      padding: 0;
      border: 0;
      touch-action: none;
    }

    cinq-slider [role="slider"] {
      inset-inline-start: calc(var(--ratio) * (100% - var(--thumb-size)));
    }

    cinq-slider [aria-orientation="vertical"] {
      top: auto;
      inset-inline-start: 0;
      bottom: calc(var(--ratio) * (100% - var(--thumb-size)));
    }

    cinq-slider-range [role="slider"]:first-child {
      inset-inline-start: calc(var(--thumb-size) + var(--max-ratio) * (100% - 2 * var(--thumb-size)));
    }

    cinq-slider-range [role="slider"]:last-child {
      inset-inline-start: calc(var(--min-ratio) * (100% - 2 * var(--thumb-size)));
    }
  </style>
`;

const thumb = (id: string, value: number, orientation = "horizontal") => `
  <button
    type="button"
    id="${id}"
    role="slider"
    tabindex="0"
    aria-label="${id}"
    aria-orientation="${orientation}"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="${value}"
  ></button>
`;

function mount(html: string): void {
  document.body.innerHTML = style + html;
}

const valueOf = (id: string): number =>
  Number(document.getElementById(id)?.getAttribute("aria-valuenow"));

afterEach(() => {
  document.body.innerHTML = "";
});

describe("cinq-slider, drag", () => {
  it("moves the value with the pointer: 90 px of a 360 px track is a quarter", async () => {
    mount(`<cinq-slider>${thumb("volume", 50)}</cinq-slider>`);

    await commands.drag("#volume", { dx: 90 });

    expect(valueOf("volume")).toBe(75);
  });

  it("keeps the grab offset: a press beside the center does not move the thumb", async () => {
    mount(`<cinq-slider>${thumb("volume", 50)}</cinq-slider>`);

    await commands.drag("#volume", { at: { x: 12 } });
    expect(valueOf("volume")).toBe(50);

    await commands.drag("#volume", { at: { x: -12 }, dx: -90 });
    expect(valueOf("volume")).toBe(25);
  });

  it("goes up on a vertical slider when the pointer goes up", async () => {
    mount(`<cinq-slider>${thumb("potency", 50, "vertical")}</cinq-slider>`);

    await commands.drag("#potency", { dy: -90 });

    expect(valueOf("potency")).toBe(75);
  });

  it("goes down when the pointer goes right in a right-to-left slider", async () => {
    mount(`<cinq-slider dir="rtl">${thumb("volume", 50)}</cinq-slider>`);

    await commands.drag("#volume", { dx: 90 });

    expect(valueOf("volume")).toBe(25);
  });

  it("sets [dragging] during the drag, dispatches slider:change, and focuses the thumb", async () => {
    mount(`<cinq-slider>${thumb("volume", 50)}</cinq-slider>`);

    const $host = document.querySelector("cinq-slider")!;
    const states: boolean[] = [];

    $host.addEventListener(EVENTS.SLIDER_CHANGE, () => {
      states.push($host.hasAttribute("dragging"));
    });

    await commands.drag("#volume", { dx: 90 });

    expect(states.length).toBeGreaterThan(0);
    expect(states.every(Boolean)).toBe(true);
    expect($host.hasAttribute("dragging")).toBe(false);
    expect(document.activeElement).toBe(document.getElementById("volume"));
  });

  it("ignores a non-primary button", async () => {
    mount(`<cinq-slider>${thumb("volume", 50)}</cinq-slider>`);

    await commands.drag("#volume", { dx: 90, button: "right" });

    expect(valueOf("volume")).toBe(50);
  });
});

describe("cinq-slider-range, drag", () => {
  const range = `
    <cinq-slider-range aria-label="Price">
      ${thumb("max", 80)}
      ${thumb("min", 20)}
    </cinq-slider-range>
  `;

  /**
   * The value right after the press, then at the end. Measured from the press:
   * the range geometry and its documented CSS disagree by half a thumb, so a
   * press moves the min thumb a little (tracked apart from this drag).
   */
  async function dragFromPress(id: string, dx: number): Promise<number> {
    const $host = document.querySelector("cinq-slider-range")!;
    const values: number[] = [];
    const record = () => values.push(valueOf(id));

    $host.addEventListener(EVENTS.SLIDER_CHANGE, record);
    await commands.drag(`#${id}`, { dx });
    $host.removeEventListener(EVENTS.SLIDER_CHANGE, record);

    return values[values.length - 1] - values[0];
  }

  it("moves the dragged thumb only, and marks it active", async () => {
    mount(range);

    const $host = document.querySelector("cinq-slider-range")!;

    // 64 px of a 320 px track is a fifth of the 0 to 100 span. The press and
    // the end are each snapped to the step: one step of rounding either way.
    expect(Math.abs((await dragFromPress("min", 64)) - 20)).toBeLessThanOrEqual(1);
    expect(valueOf("max")).toBe(80);
    expect($host.getAttribute("data-active")).toBe("min");

    expect(Math.abs((await dragFromPress("max", -32)) + 10)).toBeLessThanOrEqual(1);
    expect($host.getAttribute("data-active")).toBe("max");
  });

  it("keeps the minimum below the maximum", async () => {
    mount(range);

    await commands.drag("#min", { dx: 300 });

    expect(valueOf("min")).toBeLessThanOrEqual(valueOf("max"));
  });
});
