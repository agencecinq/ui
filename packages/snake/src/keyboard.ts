import type { Direction } from "./types.js";

const KEYS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

/**
 * Arrow keys to a heading. The host owns game rules.
 */
export default class Keyboard {
  #onDirection: (direction: Direction) => void;

  constructor(onDirection: (direction: Direction) => void) {
    this.#onDirection = onDirection;
  }

  handle = (event: KeyboardEvent): void => {
    const direction = KEYS[event.key];

    if (!direction) {
      return;
    }

    // Stop the page from scrolling while the board is focused.
    event.preventDefault();
    this.#onDirection(direction);
  };
}
