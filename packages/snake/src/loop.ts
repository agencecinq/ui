/**
 * Fixed-timestep game loop driven only by `requestAnimationFrame`.
 * Simulation steps run at `stepMs`. Drawing runs once per animation frame.
 */
export default class Loop {
  #stepMs: number;
  #onTick: () => void;
  #onFrame: () => void;
  #rafId = 0;
  #last = 0;
  #accumulator = 0;
  #running = false;

  constructor(stepMs: number, onTick: () => void, onFrame: () => void) {
    this.#stepMs = stepMs;
    this.#onTick = onTick;
    this.#onFrame = onFrame;
  }

  get running(): boolean {
    return this.#running;
  }

  set stepMs(value: number) {
    this.#stepMs = value;
  }

  /** Drop leftover time so the next step waits a full interval. */
  hold(): void {
    this.#last = 0;
    this.#accumulator = 0;
  }

  start(): void {
    if (this.#running) {
      return;
    }

    this.#running = true;
    this.#last = 0;
    this.#accumulator = 0;
    this.#rafId = requestAnimationFrame(this.#frame);
  }

  stop(): void {
    this.#running = false;

    if (!this.#rafId) {
      return;
    }

    cancelAnimationFrame(this.#rafId);
    this.#rafId = 0;
    this.#last = 0;
    this.#accumulator = 0;
  }

  #frame = (now: number): void => {
    if (!this.#running) {
      return;
    }

    // Schedule the next frame first so a long tick cannot starve the loop.
    this.#rafId = requestAnimationFrame(this.#frame);

    if (this.#last === 0) {
      this.#last = now;
      this.#onFrame();
      return;
    }

    // Cap the delta so a resumed tab cannot dump dozens of steps at once.
    const delta = Math.min(now - this.#last, this.#stepMs * 3);
    this.#last = now;
    this.#accumulator += delta;

    while (this.#running && this.#accumulator >= this.#stepMs) {
      this.#onTick();
      this.#accumulator -= this.#stepMs;
    }

    if (this.#running) {
      this.#onFrame();
    }
  };
}
