import type { Direction } from "./types.js";

const KEYS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

const SWIPE_PX = 24;

/**
 * Arrow keys (and optional swipe) to a heading. The host owns game rules.
 */
export default class Keyboard {
  #onDirection: (direction: Direction) => void;
  #pointer: { x: number; y: number } | null = null;

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

  handlePointerDown = (event: PointerEvent): void => {
    this.#pointer = { x: event.clientX, y: event.clientY };
  };

  handlePointerUp = (event: PointerEvent): void => {
    const origin = this.#pointer;
    this.#pointer = null;

    if (!origin) {
      return;
    }

    const { clientX, clientY } = event;
    const dx = clientX - origin.x;
    const dy = clientY - origin.y;

    if (Math.hypot(dx, dy) < SWIPE_PX) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      this.#onDirection(dx > 0 ? "right" : "left");
      return;
    }

    this.#onDirection(dy > 0 ? "down" : "up");
  };

  handlePointerCancel = (): void => {
    this.#pointer = null;
  };
}
