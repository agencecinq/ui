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

/**
 * A 400 by 200 px host. The component moves the separator with a transform, so
 * it starts at the top left corner. The test page is 414 px wide: no side margin.
 */
const style = `
  <style>
    cinq-windowsplitter {
      position: relative;
      display: block;
      width: 400px;
      height: 200px;
      margin: 120px 0;
    }

    #primary {
      height: 100%;
    }

    [role="separator"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 8px;
      height: 100%;
      margin-left: -4px;
      padding: 0;
      border: 0;
    }

    [role="separator"][aria-orientation="horizontal"] {
      width: 100%;
      height: 8px;
      margin: -4px 0 0;
    }
  </style>
`;

function mount({
  orientation = "vertical",
  value = 50,
  attributes = "",
} = {}): HTMLElement {
  document.body.innerHTML = `
    ${style}
    <cinq-windowsplitter ${attributes}>
      <div id="primary">Spellbook</div>
      <div
        id="separator"
        role="separator"
        tabindex="0"
        aria-label="Resize spellbook"
        aria-controls="primary"
        aria-orientation="${orientation}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${value}"
      ></div>
    </cinq-windowsplitter>
  `;

  return document.querySelector("cinq-windowsplitter")!;
}

const value = (): number =>
  Number(document.getElementById("separator")?.getAttribute("aria-valuenow"));

afterEach(() => {
  document.body.innerHTML = "";
});

describe("cinq-windowsplitter, drag", () => {
  it("follows the pointer across a vertical separator: 100 px of 400 px is a quarter", async () => {
    const $host = mount();

    await commands.drag("#separator", { dx: 100 });

    expect(value()).toBe(75);
    expect(document.getElementById("primary")?.style.width).toBe("75%");
    expect($host.style.getPropertyValue("--ratio")).toBe("0.75");
  });

  it("follows the pointer down a horizontal separator: 50 px of 200 px is a quarter", async () => {
    mount({ orientation: "horizontal" });

    await commands.drag("#separator", { dy: 50 });

    expect(value()).toBe(75);
    expect(document.getElementById("primary")?.style.height).toBe("75%");
  });

  it("keeps the grab offset: a press beside the center does not move the separator", async () => {
    mount();

    await commands.drag("#separator", { at: { x: 3 } });
    expect(value()).toBe(50);

    await commands.drag("#separator", { at: { x: -3 }, dx: -100 });
    expect(value()).toBe(25);
  });

  it("sets [dragging] during the drag, dispatches windowsplitter:change, and focuses the separator", async () => {
    const $host = mount();
    const states: boolean[] = [];

    $host.addEventListener(EVENTS.WINDOWSPLITTER_CHANGE, () => {
      states.push($host.hasAttribute("dragging"));
    });

    await commands.drag("#separator", { dx: 100 });

    expect(states.length).toBeGreaterThan(0);
    expect(states.every(Boolean)).toBe(true);
    expect($host.hasAttribute("dragging")).toBe(false);
    expect(document.activeElement).toBe(document.getElementById("separator"));
  });

  it("clips the primary pane in clip mode", async () => {
    mount({ attributes: 'data-mode="clip"' });

    await commands.drag("#separator", { dx: 100 });

    expect(value()).toBe(75);
    expect(document.getElementById("primary")?.style.clipPath).toBe("inset(0px 100px 0px 0px)");
  });

  it("toggles instead of dragging when fixed", async () => {
    const $host = mount({ attributes: "data-fixed" });
    let dragging = false;

    $host.addEventListener(EVENTS.WINDOWSPLITTER_CHANGE, () => {
      dragging ||= $host.hasAttribute("dragging");
    });

    await commands.drag("#separator", { dx: 100 });
    expect(value()).toBe(0);

    await commands.drag("#separator", { dx: 100 });
    expect(value()).toBe(50);
    expect(dragging).toBe(false);
  });

  it("ignores a press when disabled, or with a non-primary button", async () => {
    mount({ attributes: "disabled" });

    await commands.drag("#separator", { dx: 100 });
    expect(value()).toBe(50);

    mount();

    await commands.drag("#separator", { dx: 100, button: "right" });
    expect(value()).toBe(50);
  });
});
