/** What a drag has done so far. */
export type DragValues = {
    /** Horizontal distance from the press, in px. */
    dx: number;
    /** Vertical distance from the press, in px. */
    dy: number;
    /** Horizontal speed over the last 50 ms, in px/ms, positive rightward. */
    vx: number;
    /** Vertical speed over the last 50 ms, in px/ms, positive downward. */
    vy: number;
};
export type DragEndValues = DragValues & {
    /** The browser took the pointer back before the release. */
    canceled: boolean;
};
export type DragOptions = {
    /** Gets `[dragging]` while a gesture runs. */
    host?: Element;
    /**
     * The element that takes the pointer for this press, or `null` to ignore it.
     * Defaults to the listened element. Lets one listener on a container start
     * gestures on its children.
     */
    target?: (event: PointerEvent) => Element | null;
    /** A primary press. Return `false` to ignore it. */
    start?: (event: PointerEvent) => boolean | void;
    move?: (event: PointerEvent, values: DragValues) => void;
    end?: (event: PointerEvent, values: DragEndValues) => void;
};
export type DragTracker = {
    /** Stops a running gesture without calling `end`. */
    cancel(): void;
    /** Cancels a running gesture and removes the listeners. */
    destroy(): void;
};
/**
 * Tracks one pointer gesture at a time on `$element`: captures the pointer on
 * a primary press, follows that pointer only, and ends on release, cancel or
 * lost capture. The caller decides what the values mean.
 *
 * @param $element - Listens for the presses, and takes the pointer unless `target` picks another element.
 * @param options - Callbacks and the element that gets `[dragging]`.
 * @returns `cancel()` and `destroy()`.
 *
 * @example
 * const drag = trackDrag($thumb, {
 *   host: this,
 *   move: (event, { dx }) => this.setValue(this.valueAt(dx)),
 * });
 *
 * // in destroy()
 * drag.destroy();
 */
export declare const trackDrag: ($element: EventTarget, options?: DragOptions) => DragTracker;
//# sourceMappingURL=drag.d.ts.map