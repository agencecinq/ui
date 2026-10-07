export declare class Sheet extends HTMLElement {
    #private;
    static observedAttributes: string[];
    /** Element that last requested the sheet to open. */
    trigger: HTMLElement | null;
    $dialog: HTMLDialogElement | null;
    $handle: HTMLElement | null;
    get modal(): boolean;
    /** Pulls dismiss unless the dialog opts out with `closedby="none"`. */
    get dismissible(): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    init(): void;
    /** Removes listeners and closes the native dialog. Leaves `open` as is. */
    destroy(): void;
    /** @returns Whether the sheet is open after the toggle. */
    toggle(trigger?: HTMLElement | null): boolean;
    /**
     * Dispatches cancelable `sheet:before-open`. A listener can call
     * `preventDefault()` then `detail.resolve()` once async work is done.
     *
     * @returns `false` if already open, still closed after abort, or waiting on `resolve()`.
     */
    open(trigger?: HTMLElement | null): boolean;
    /**
     * Dispatches cancelable `sheet:before-close`. A listener can call
     * `preventDefault()` then `detail.resolve()` once async work is done.
     *
     * @returns `false` if already closed, still open after abort, or waiting on `resolve()`.
     */
    close(): boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
//# sourceMappingURL=sheet.d.ts.map