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
    /** @returns Whether the sheet is open once the request settles. */
    toggle(trigger?: HTMLElement | null): Promise<boolean>;
    /**
     * Dispatches cancelable `sheet:before-open`: listeners cancel with
     * `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @returns Whether this call opened the sheet.
     */
    open(trigger?: HTMLElement | null): Promise<boolean>;
    /**
     * Dispatches cancelable `sheet:before-close`: listeners cancel with
     * `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @returns Whether this call closed the sheet.
     */
    close(): Promise<boolean>;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
//# sourceMappingURL=sheet.d.ts.map