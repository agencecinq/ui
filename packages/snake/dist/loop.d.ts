/**
 * Fixed-timestep game loop driven only by `requestAnimationFrame`.
 * Simulation steps run at `stepMs`. Drawing runs once per animation frame.
 */
export default class Loop {
    #private;
    constructor(stepMs: number, onTick: () => void, onFrame: () => void);
    get running(): boolean;
    set stepMs(value: number);
    /** Drop leftover time so the next step waits a full interval. */
    hold(): void;
    start(): void;
    stop(): void;
}
//# sourceMappingURL=loop.d.ts.map