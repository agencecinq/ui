import { dispatchEvent, parseNumber } from "@agencecinq/utils";
import { color, COLS, ROWS, STEP_MS, STEP_MS_MIN } from "./config.js";
import Game from "./game.js";
import Keyboard from "./keyboard.js";
import Loop from "./loop.js";
import Renderer from "./renderer.js";
import type { Direction } from "./types.js";

/**
 * Canvas Snake host. Markup in light DOM is the source of truth.
 *
 * Required: a `<canvas>`. Ink follows the canvas CSS `color` (inherited).
 * The playfield fill and any frame are consumer CSS on the canvas.
 * `cols` and `rows` (defaults {@link COLS} / {@link ROWS}). Changing them
 * resets the board. Score, overlay, and replay UI stay in the consumer.
 * Listen for `snake:eat`, `snake:over`, and `snake:replay`, and call
 * {@link replay}.
 */
export class Snake extends HTMLElement {
  static observedAttributes = ["cols", "rows"];

  $canvas: HTMLCanvasElement | null = null;

  #game = new Game();
  #loop: Loop | null = null;
  #renderer: Renderer | null = null;
  #keyboard: Keyboard | null = null;

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$canvas = null;
    this.#renderer = null;
    this.#keyboard = null;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name !== "cols" && name !== "rows") {
      return;
    }

    if (!this.#loop || oldValue === newValue) {
      return;
    }

    this.#syncGrid(true);
  }

  /** Bind markup + listeners. Call {@link destroy} first if already bound. */
  init(): void {
    if (this.#loop) {
      return;
    }

    this.$canvas = this.querySelector<HTMLCanvasElement>("canvas");

    if (!this.$canvas) {
      throw new Error("Snake must contain a canvas element");
    }

    const context = this.$canvas.getContext("2d");

    if (!context) {
      throw new Error("Snake could not get a 2d canvas context");
    }

    this.#renderer = new Renderer(this.$canvas, context);
    this.#keyboard = new Keyboard(this.#turn);
    this.#loop = new Loop(STEP_MS, this.#tick, this.#draw);

    this.addEventListener("keydown", this.#handleKeydown);
    this.$canvas.addEventListener("pointerdown", this.#handlePointerDown);
    this.$canvas.addEventListener("pointerup", this.#keyboard.handlePointerUp);
    this.$canvas.addEventListener(
      "pointercancel",
      this.#keyboard.handlePointerCancel,
    );

    this.#syncGrid(false);
    this.sync();
    this.#loop.start();
  }

  /** Detaches listeners and stops the animation loop. */
  destroy(): void {
    if (!this.#loop) {
      return;
    }

    const { $canvas } = this;
    const keyboard = this.#keyboard;

    this.#loop.stop();
    this.#loop = null;

    this.removeEventListener("keydown", this.#handleKeydown);
    $canvas?.removeEventListener("pointerdown", this.#handlePointerDown);

    if ($canvas && keyboard) {
      $canvas.removeEventListener("pointerup", keyboard.handlePointerUp);
      $canvas.removeEventListener(
        "pointercancel",
        keyboard.handlePointerCancel,
      );
    }

    this.#renderer = null;
    this.#keyboard = null;
  }

  /** Re-measure the canvas bitmap. Call after layout changes. */
  sync(): void {
    this.#renderer?.resize();
    this.#draw();
  }

  /** Reset the board and run the loop again. */
  replay(): void {
    this.#game.reset();
    this.#syncSpeed();
    this.sync();
    this.#loop?.start();
    this.$canvas?.focus();
    dispatchEvent(this, "snake:replay", { score: this.#game.score });
  }

  get score(): number {
    return this.#game.score;
  }

  get cols(): number {
    return this.#game.cols;
  }

  get rows(): number {
    return this.#game.rows;
  }

  #grid(): { cols: number; rows: number } {
    return {
      cols: Math.max(
        1,
        Math.floor(parseNumber(this.getAttribute("cols"), COLS)),
      ),
      rows: Math.max(
        1,
        Math.floor(parseNumber(this.getAttribute("rows"), ROWS)),
      ),
    };
  }

  #syncGrid(emit: boolean): void {
    const { cols, rows } = this.#grid();

    if (cols === this.#game.cols && rows === this.#game.rows) {
      return;
    }

    this.#game.setSize(cols, rows);
    this.#syncSpeed();
    this.sync();
    this.#loop?.start();

    if (emit) {
      dispatchEvent(this, "snake:replay", { score: this.#game.score });
    }
  }

  /** Queue a heading. Ignored after a collision. */
  #turn = (direction: Direction): void => {
    if (!this.#game.alive) {
      return;
    }

    const waiting = !this.#game.started;
    this.#game.setDirection(direction);

    if (waiting && this.#game.started) {
      this.#tick();
      this.#loop?.hold();
    }
  };

  /** One grid step from the rAF loop. */
  #tick = (): void => {
    const result = this.#game.tick();

    if (result === "eat") {
      this.#syncSpeed();
      dispatchEvent(this, "snake:eat", { score: this.#game.score });
      return;
    }

    if (result === "dead") {
      this.#end();
    }
  };

  /** Paint the current grid. Called every animation frame while the loop runs. */
  #draw = (): void => {
    if (!this.#renderer || !this.$canvas) {
      return;
    }

    this.#renderer.draw(
      {
        snake: this.#game.snake,
        food: this.#game.food,
        cols: this.#game.cols,
        rows: this.#game.rows,
      },
      this.#color(),
    );
  };

  /** Stop the loop and dispatch `snake:over`. */
  #end(): void {
    this.#loop?.stop();
    this.#draw();
    dispatchEvent(this, "snake:over", { score: this.#game.score });
  }

  /** Shorten the step interval as the score climbs, down to STEP_MS_MIN. */
  #syncSpeed(): void {
    if (!this.#loop) {
      return;
    }

    this.#loop.stepMs = Math.max(STEP_MS_MIN, STEP_MS - this.#game.score * 5);
  }

  /** Canvas CSS `color`, inherited if unset. */
  #color(): string {
    const { $canvas } = this;

    if (!$canvas) {
      return color;
    }

    return getComputedStyle($canvas).color || color;
  }

  #handleKeydown = (event: KeyboardEvent): void => {
    const { key, target } = event;

    if (!this.#game.alive) {
      if (
        target instanceof Element &&
        target.closest("button, a, input, textarea, select")
      ) {
        return;
      }

      if (key === "Enter" || key === " ") {
        event.preventDefault();
        this.replay();
      }

      return;
    }

    this.#keyboard?.handle(event);
  };

  #handlePointerDown = (event: PointerEvent): void => {
    const { $canvas } = this;

    if (!$canvas) {
      return;
    }

    $canvas.focus();
    $canvas.setPointerCapture(event.pointerId);
    this.#keyboard?.handlePointerDown(event);
  };
}

if (!customElements.get("cinq-snake")) {
  customElements.define("cinq-snake", Snake);
}
