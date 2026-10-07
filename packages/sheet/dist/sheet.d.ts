export declare class Sheet extends HTMLElement {
    #private;
    static observedAttributes: string[];
    /** Element that last requested the sheet to open. */
    trigger: HTMLElement | null;
    $dialog: HTMLDialogElement | null;
    $handle: HTMLElement | null;
    get modal(): boolean;
    get dismissible(): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    init(): void;
    /** Removes listeners and closes the native dialog. Leaves `open` as is. */
    destroy(): void;
    toggle(trigger?: HTMLElement | null): boolean;
    /**
     * Dispatches cancelable `sheet:before-open`. A listener can call
     * `preventDefault()` then `detail.resolve()` once async work is done.
     */
    open(trigger?: HTMLElement | null): boolean;
    /**
     * Dispatches cancelable `sheet:before-close`. A listener can call
     * `preventDefault()` then `detail.resolve()` once async work is done.
     */
    close(): boolean;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
}
//# sourceMappingURL=sheet.d.ts.map