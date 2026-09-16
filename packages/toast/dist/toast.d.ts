/**
 * Toast Web Component: transient live-region notification.
 *
 * Does not set `role`. The consumer chooses `role="alert"` or `role="status"`
 * (and optional `aria-live` / `aria-atomic`) in markup.
 *
 * Does not move or trap focus (not an Alert Dialog). Auto-dismiss is opt-in via
 * `data-duration` (milliseconds). Pausing the timer (hover, focus, …) is left
 * to the consumer via {@link pause} / {@link resume}.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 */
export declare class Toast extends HTMLElement {
    #private;
    static observedAttributes: string[];
    $content: HTMLElement | null;
    $dismiss: HTMLButtonElement | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners and cancels the auto-dismiss timer. */
    destroy(): void;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
    get open(): boolean;
    get message(): string;
    set message(value: string);
    /**
     * Auto-dismiss duration in ms from `data-duration`. `0` means no auto-dismiss.
     */
    get duration(): number;
    /** Whether the auto-dismiss timer is currently paused. */
    get paused(): boolean;
    /**
     * Show the toast. Optionally set the message first.
     * @returns `false` if already open.
     */
    show(message?: string): boolean;
    /**
     * Hide the toast.
     * @returns `false` if already closed.
     */
    close(): boolean;
    /**
     * Toggle open state. When opening, optionally set the message.
     */
    toggle(message?: string): boolean;
    /**
     * Pause auto-dismiss (and `--toast-progress`). No-op if already paused.
     * Wire hover / focus / keyboard from the consumer.
     */
    pause(): void;
    /**
     * Resume auto-dismiss after {@link pause}. No-op if not paused.
     */
    resume(): void;
}
//# sourceMappingURL=toast.d.ts.map