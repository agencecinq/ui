import { Direction, Point, TickResult } from './types.js';
/**
 * Grid state: snake, food, score, collisions.
 * No DOM, no canvas, no timers. The host asks for a tick on each step.
 */
export default class Game {
    #private;
    constructor(cols?: number, rows?: number);
    get cols(): number;
    get rows(): number;
    get snake(): readonly Point[];
    get food(): Point;
    get score(): number;
    get alive(): boolean;
    get started(): boolean;
    /** Change the grid size and reset the board. */
    setSize(cols: number, rows: number): void;
    /** Place a centered snake, spawn food, clear score. Waits for the first turn. */
    reset(): void;
    /**
     * Queue the next heading. 180-degree turns are ignored so the snake cannot
     * fold onto itself between two ticks. The first accepted key starts movement.
     */
    setDirection(next: Direction): void;
    /**
     * Advance one cell. Returns `idle` until the first direction, `dead` on a
     * wall or self hit, `eat` when the head lands on food, otherwise `move`.
     */
    tick(): TickResult;
}
//# sourceMappingURL=game.d.ts.map