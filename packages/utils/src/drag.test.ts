import { afterEach, describe, expect, it, vi } from "vitest";
import { commands } from "vitest/browser";
import type { DragCommandOptions } from "../vitest.browser";
import { trackDrag, type DragEndValues, type DragTracker, type DragValues } from "./drag.js";

declare module "vitest/browser" {
  interface BrowserCommands {
    drag: (selector: string, options?: DragCommandOptions) => Promise<void>;
  }
}

const trackers: DragTracker[] = [];

function mount(): { $host: HTMLElement; $knob: HTMLElement } {
  document.body.innerHTML = `
    <div id="host" style="padding: 200px">
      <div id="knob" style="width: 40px; height: 40px; touch-action: none; background: gray"></div>
      <div id="list">
        <button id="first" type="button" style="touch-action: none">First</button>
        <button id="second" type="button" style="touch-action: none">Second</button>
      </div>
    </div>
  `;

  return {
    $host: document.querySelector<HTMLElement>("#host")!,
    $knob: document.querySelector<HTMLElement>("#knob")!,
  };
}

function track(...args: Parameters<typeof trackDrag>): DragTracker {
  const tracker = trackDrag(...args);

  trackers.push(tracker);
  return tracker;
}

afterEach(() => {
  trackers.splice(0).forEach((tracker) => tracker.destroy());
  document.body.innerHTML = "";
});

describe("trackDrag", () => {
  it("reports the distance from the press while moving and at the release", async () => {
    const { $knob } = mount();
    const moves: DragValues[] = [];
    const ends: DragEndValues[] = [];

    track($knob, {
      move: (_event, values) => moves.push(values),
      end: (_event, values) => ends.push(values),
    });

    await commands.drag("#knob", { dx: 40, dy: 80 });

    expect(moves.length).toBeGreaterThan(1);
    expect(ends).toHaveLength(1);

    const [{ dx, dy, canceled }] = ends;

    // The vitest frame may scale the page: compare the proportion, not exact pixels.
    expect(dx).toBeGreaterThan(0);
    expect(dy / dx).toBeCloseTo(2, 1);
    expect(canceled).toBe(false);
  });

  it("sets [dragging] on the host during the gesture and captures the pointer", async () => {
    const { $host, $knob } = mount();
    const states: boolean[] = [];
    const captures: boolean[] = [];

    track($knob, {
      host: $host,
      move: (event) => {
        states.push($host.hasAttribute("dragging"));
        captures.push($knob.hasPointerCapture(event.pointerId));
      },
    });

    await commands.drag("#knob", { dy: 60 });

    expect(states.every(Boolean)).toBe(true);
    expect(captures.every(Boolean)).toBe(true);
    expect($host.hasAttribute("dragging")).toBe(false);
  });

  it("measures a speed while moving: a fast move is faster than a slow one", async () => {
    const { $knob } = mount();
    const speeds: number[] = [];
    let peak = 0;

    // The peak while moving: the speed at the release depends on how soon it follows the last move.
    track($knob, {
      move: (_event, { vy }) => {
        peak = Math.max(peak, vy);
      },
      end: () => {
        speeds.push(peak);
        peak = 0;
      },
    });

    // Slow but steady: one move per frame, as a real pointer sends them.
    await commands.drag("#knob", { dy: 80, steps: 16 });
    await commands.drag("#knob", { dy: 80, steps: 2, delay: 0 });

    const [slow, fast] = speeds;

    expect(slow).toBeGreaterThan(0);
    expect(fast).toBeGreaterThan(slow);
  });

  it("brings the speed to 0 when the pointer pauses before the release", async () => {
    const { $knob } = mount();
    const ends: DragEndValues[] = [];

    track($knob, { end: (_event, values) => ends.push(values) });

    await commands.drag("#knob", { dy: 80, steps: 2, delay: 0, hold: 150 });

    const [{ dy, vy }] = ends;

    expect(dy).toBeGreaterThan(0);
    expect(vy).toBe(0);
  });

  it("ignores a non-primary button, and a press that start refuses", async () => {
    const { $knob } = mount();
    const start = vi.fn(() => false);
    const end = vi.fn();

    track($knob, { start, end });

    await commands.drag("#knob", { dy: 40, button: "right" });
    expect(start).not.toHaveBeenCalled();

    await commands.drag("#knob", { dy: 40 });
    expect(start).toHaveBeenCalledTimes(1);
    expect(end).not.toHaveBeenCalled();
  });

  it("holds the pointer and sets [dragging] by the time start runs, and undoes both on false", async () => {
    const { $host, $knob } = mount();
    const states: [boolean, boolean][] = [];
    let accept = true;

    track($knob, {
      host: $host,
      start: (event) => {
        states.push([$host.hasAttribute("dragging"), $knob.hasPointerCapture(event.pointerId)]);
        return accept;
      },
    });

    await commands.drag("#knob", { dy: 20 });
    accept = false;
    await commands.drag("#knob", { dy: 20 });

    expect(states).toEqual([
      [true, true],
      [true, true],
    ]);
    expect($host.hasAttribute("dragging")).toBe(false);
  });

  it("starts the gesture on the element target picks, from one listener on a container", async () => {
    mount();

    const $list = document.querySelector<HTMLElement>("#list")!;
    const $second = document.querySelector<HTMLElement>("#second")!;
    const targets: (EventTarget | null)[] = [];

    track($list, {
      target: (event) => (event.target as Element).closest("#second"),
      move: (event) => targets.push(event.target),
      end: (event) => targets.push(event.target),
    });

    await commands.drag("#first", { dy: 30 });
    expect(targets).toHaveLength(0);

    await commands.drag("#second", { dy: 30 });
    expect(targets.length).toBeGreaterThan(1);
    expect(targets.every((target) => target === $second)).toBe(true);
  });

  it("ends as canceled when the capture is lost before the release", async () => {
    const { $knob } = mount();
    const ends: DragEndValues[] = [];

    track($knob, {
      move: (event) => $knob.releasePointerCapture(event.pointerId),
      end: (_event, values) => ends.push(values),
    });

    await commands.drag("#knob", { dy: 40 });

    expect(ends).toHaveLength(1);
    expect(ends[0].canceled).toBe(true);
  });

  it("cancel() stops the gesture without calling end, and destroy() stops listening", async () => {
    const { $host, $knob } = mount();
    const end = vi.fn();
    let tracker: DragTracker | null = null;

    tracker = track($knob, {
      host: $host,
      move: () => tracker?.cancel(),
      end,
    });

    await commands.drag("#knob", { dy: 40 });

    expect(end).not.toHaveBeenCalled();
    expect($host.hasAttribute("dragging")).toBe(false);

    const move = vi.fn();
    const destroyed = track($knob, { move });

    destroyed.destroy();
    await commands.drag("#knob", { dy: 40 });

    expect(move).not.toHaveBeenCalled();
  });
});
