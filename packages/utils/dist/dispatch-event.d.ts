export type Options = {
    /** Whether the event bubbles (default `true`). */
    bubbles?: boolean;
    /** Whether `preventDefault()` can cancel the event (default `true`). */
    cancelable?: boolean;
};
/**
 * Dispatches a typed `CustomEvent` on `target`.
 *
 * Defaults match the cancelable host-event pattern used across CINQ WCs:
 * `bubbles: true`, `cancelable: true`.
 *
 * @typeParam T - Shape of `event.detail`.
 * @param target - Event target that receives the event.
 * @param name - Event type name (e.g. `EVENTS.DISCLOSURE_BUTTON_OPEN`).
 * @param detail - Optional payload exposed as `event.detail`.
 * @param options - Overrides for `bubbles` / `cancelable`.
 * @returns `false` if a listener called `preventDefault()`, otherwise `true`.
 *
 * @example
 * if (!dispatchEvent(button, EVENTS.DISCLOSURE_BUTTON_OPEN, { open: true })) {
 *   return; // aborted
 * }
 *
 * @example
 * dispatchEvent(document.documentElement, EVENTS.MODAL_CLOSE, undefined, {
 *   bubbles: false,
 *   cancelable: false,
 * });
 */
export declare const dispatchEvent: <T = unknown>(target: EventTarget, name: string, detail?: T, options?: Options) => boolean;
//# sourceMappingURL=dispatch-event.d.ts.map