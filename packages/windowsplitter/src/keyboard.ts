import type { WindowSplitter } from "./windowsplitter.js";

/**
 * W3C APG window splitter keyboard behaviour.
 * Bound once to the separator keydown; host owns state and side effects.
 *
 * Arrow keys follow `aria-orientation`: Left/Right for a vertical splitter,
 * Up/Down for a horizontal one.
 */
export default class Keyboard {
  constructor(private readonly host: WindowSplitter) {}

  handle = (event: KeyboardEvent): void => {
    const { host } = this;

    if (host.disabled) {
      return;
    }

    const { key, shiftKey } = event;
    const step = shiftKey ? host.page : host.step;
    const current = host.value;
    const vertical = host.orientation === "vertical";

    const move = (next: number) => {
      host.setValue(next);
      event.preventDefault();
    };

    if (key === "Enter") {
      host.toggle();
      event.preventDefault();
      return;
    }

    if (host.fixed) {
      return;
    }

    if (key === "Home") {
      move(host.min);
      return;
    }

    if (key === "End") {
      move(host.max);
      return;
    }

    if (key === "PageUp") {
      move(current + host.page);
      return;
    }

    if (key === "PageDown") {
      move(current - host.page);
      return;
    }

    if (vertical) {
      if (key === "ArrowLeft") {
        move(current - step);
        return;
      }

      if (key === "ArrowRight") {
        move(current + step);
        return;
      }

      return;
    }

    if (key === "ArrowUp") {
      move(current - step);
      return;
    }

    if (key === "ArrowDown") {
      move(current + step);
    }
  };
}
