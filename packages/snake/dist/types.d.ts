export type Direction = "up" | "down" | "left" | "right";
export type TickResult = "idle" | "move" | "eat" | "dead";
export interface Point {
    x: number;
    y: number;
}
export interface Detail {
    score: number;
}
/** Snapshot the renderer needs. The host passes this, not the Game class. */
export interface DrawState {
    snake: readonly Point[];
    food: Point;
    cols: number;
    rows: number;
}
//# sourceMappingURL=types.d.ts.map