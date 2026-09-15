import { COLS, INITIAL_LENGTH, ROWS } from "./config.js";
import type { Direction, Point, TickResult } from "./types.js";

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const DELTA: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * Grid state: snake, food, score, collisions.
 * No DOM, no canvas, no timers. The host asks for a tick on each step.
 */
export default class Game {
  #cols: number;
  #rows: number;
  #snake: Point[] = [];
  #direction: Direction = "right";
  #pending: Direction = "right";
  #food: Point = { x: 0, y: 0 };
  #score = 0;
  #alive = true;
  #started = false;

  constructor(cols = COLS, rows = ROWS) {
    this.#cols = Math.max(1, cols);
    this.#rows = Math.max(1, rows);
    this.reset();
  }

  get cols(): number {
    return this.#cols;
  }

  get rows(): number {
    return this.#rows;
  }

  get snake(): readonly Point[] {
    return this.#snake;
  }

  get food(): Point {
    return this.#food;
  }

  get score(): number {
    return this.#score;
  }

  get alive(): boolean {
    return this.#alive;
  }

  get started(): boolean {
    return this.#started;
  }

  /** Change the grid size and reset the board. */
  setSize(cols: number, rows: number): void {
    this.#cols = Math.max(1, Math.floor(cols));
    this.#rows = Math.max(1, Math.floor(rows));
    this.reset();
  }

  /** Place a centered snake, spawn food, clear score. Waits for the first turn. */
  reset(): void {
    const length = Math.min(INITIAL_LENGTH, this.#cols);
    const y = Math.min(this.#rows - 1, Math.floor(this.#rows / 2));
    const headX = Math.min(
      this.#cols - 1,
      Math.max(length - 1, Math.floor(this.#cols / 2)),
    );
    const snake: Point[] = [];

    for (let i = 0; i < length; i += 1) {
      snake.push({ x: headX - i, y });
    }

    this.#snake = snake;
    this.#direction = "right";
    this.#pending = "right";
    this.#score = 0;
    this.#alive = true;
    this.#started = false;
    this.#spawnFood();
  }

  /**
   * Queue the next heading. 180-degree turns are ignored so the snake cannot
   * fold onto itself between two ticks. The first accepted key starts movement.
   */
  setDirection(next: Direction): void {
    if (next === OPPOSITE[this.#direction]) {
      return;
    }

    this.#pending = next;

    if (!this.#started && this.#alive) {
      this.#started = true;
    }
  }

  /**
   * Advance one cell. Returns `idle` until the first direction, `dead` on a
   * wall or self hit, `eat` when the head lands on food, otherwise `move`.
   */
  tick(): TickResult {
    if (!this.#alive) {
      return "dead";
    }

    if (!this.#started) {
      return "idle";
    }

    this.#direction = this.#pending;

    const { x: dx, y: dy } = DELTA[this.#direction];
    const head = this.#snake[0];
    const next = { x: head.x + dx, y: head.y + dy };

    if (this.#hitsWall(next)) {
      this.#alive = false;
      return "dead";
    }

    const willEat = next.x === this.#food.x && next.y === this.#food.y;

    if (this.#hitsBody(next, willEat)) {
      this.#alive = false;
      return "dead";
    }

    this.#snake.unshift(next);

    if (willEat) {
      this.#score += 1;
      this.#spawnFood();
      return "eat";
    }

    this.#snake.pop();
    return "move";
  }

  #hitsWall({ x, y }: Point): boolean {
    return x < 0 || y < 0 || x >= this.#cols || y >= this.#rows;
  }

  /**
   * The tail cell is free on a non-eating move because it vacates this tick.
   * When growing, the tail stays, so it counts as occupied.
   */
  #hitsBody(next: Point, willEat: boolean): boolean {
    const last = willEat ? this.#snake.length : this.#snake.length - 1;

    for (let i = 0; i < last; i += 1) {
      const part = this.#snake[i];

      if (part.x === next.x && part.y === next.y) {
        return true;
      }
    }

    return false;
  }

  #spawnFood(): void {
    const taken = new Set(
      this.#snake.map((part) => `${part.x},${part.y}`),
    );
    const empty: Point[] = [];

    for (let y = 0; y < this.#rows; y += 1) {
      for (let x = 0; x < this.#cols; x += 1) {
        if (!taken.has(`${x},${y}`)) {
          empty.push({ x, y });
        }
      }
    }

    if (empty.length === 0) {
      return;
    }

    this.#food = empty[Math.floor(Math.random() * empty.length)];
  }
}
