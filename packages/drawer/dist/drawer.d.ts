export type { BeforeCloseDetail, BeforeOpenDetail } from './types.js';
export declare class Drawer extends HTMLElement {
    #private;
    trigger: HTMLElement | null;
    $dialog: HTMLDialogElement | null;
    /** `data-modal="false"` opens with `show()`: the page stays interactive. Read on open. */
    get modal(): boolean;
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind dialog + document listeners. Call {@link destroy} first if already bound.
     * Shows the dialog when the host is already `open` in the markup.
     */
    init(): void;
    /**
     * Detaches listeners. Releases scroll lock and focus if still open;
     * leaves the `open` attribute and the dialog state (HTML is source of truth).
     * Safe to call from outside while the host stays mounted.
     */
    destroy(): void;
    /**
     * Toggles the drawer between open and closed.
     *
     * @param trigger - Element that triggered the toggle, or null.
     * @returns Whether the drawer is open once the request settles.
     */
    toggle({ trigger }?: {
        trigger?: HTMLElement | null;
    }): Promise<boolean>;
    /**
     * Opens the drawer. Dispatches cancelable `drawer:before-open`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @returns Whether this call opened the drawer.
     */
    open(): Promise<boolean>;
    /**
     * Closes the drawer. Dispatches cancelable `drawer:before-close`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @returns Whether this call closed the drawer.
     */
    close(): Promise<boolean>;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
}
//# sourceMappingURL=drawer.d.ts.map