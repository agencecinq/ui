import { afterEach, describe, expect, it } from "vitest";
import { focusByKey } from "./focus-by-key.js";

function mount(dir = "ltr"): HTMLElement[] {
  document.body.innerHTML = `
    <div dir="${dir}">
      <button id="sword" type="button">Sword</button>
      <button id="mace" type="button">Mace</button>
      <button id="dagger" type="button">Dagger</button>
    </div>
  `;

  return [...document.querySelectorAll<HTMLElement>("button")];
}

/** Presses `key` on `elements[index]` and returns what focusByKey gave back. */
function press(
  elements: HTMLElement[],
  index: number,
  key: string,
  init: KeyboardEventInit = {},
): { destination: number | undefined; event: KeyboardEvent } {
  const event = new KeyboardEvent("keydown", { key, cancelable: true, ...init });

  elements[index].focus();

  return { destination: focusByKey(event, elements, index), event };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("focusByKey", () => {
  it("moves to the next element on ArrowDown and ArrowRight, wrapping", () => {
    const elements = mount();

    expect(press(elements, 0, "ArrowDown").destination).toBe(1);
    expect(document.activeElement).toBe(elements[1]);

    expect(press(elements, 1, "ArrowRight").destination).toBe(2);
    expect(press(elements, 2, "ArrowDown").destination).toBe(0);
    expect(document.activeElement).toBe(elements[0]);
  });

  it("moves to the previous element on ArrowUp and ArrowLeft, wrapping", () => {
    const elements = mount();

    expect(press(elements, 2, "ArrowUp").destination).toBe(1);
    expect(press(elements, 1, "ArrowLeft").destination).toBe(0);
    expect(press(elements, 0, "ArrowUp").destination).toBe(2);
    expect(document.activeElement).toBe(elements[2]);
  });

  it("moves to the first and last elements on Home and End", () => {
    const elements = mount();

    expect(press(elements, 1, "Home").destination).toBe(0);
    expect(press(elements, 1, "End").destination).toBe(2);
    expect(document.activeElement).toBe(elements[2]);
  });

  it("swaps left and right in a right-to-left context", () => {
    const elements = mount("rtl");

    expect(press(elements, 0, "ArrowLeft").destination).toBe(1);
    expect(press(elements, 1, "ArrowRight").destination).toBe(0);
    expect(press(elements, 0, "ArrowDown").destination).toBe(1);
  });

  it("cancels the default action of the keys it handles", () => {
    const elements = mount();

    expect(press(elements, 0, "ArrowDown").event.defaultPrevented).toBe(true);
  });

  it("leaves other keys to the browser", () => {
    const elements = mount();
    const { destination, event } = press(elements, 0, "PageDown");

    expect(destination).toBeUndefined();
    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(elements[0]);
  });

  it("leaves keys pressed with Alt, Ctrl or Meta to the browser", () => {
    const elements = mount();

    ["altKey", "ctrlKey", "metaKey"].forEach(modifier => {
      const { destination, event } = press(elements, 0, "ArrowDown", { [modifier]: true });

      expect(destination).toBeUndefined();
      expect(event.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(elements[0]);
    });
  });
});
