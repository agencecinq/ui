export type { BeforeCloseDetail, BeforeOpenDetail } from './types.js';
export declare class Drawer extends HTMLElement {
    #private;
    trigger: HTMLElement | null;
    trap: HTMLElement | null;
    $overlay: Element | null;
    $panel: HTMLElement | null;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind overlay + document listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /**
     * Detaches listeners. Clears trap/scroll/inline styles if still open;
     * leaves the `open` attribute (HTML is source of truth).
     * Safe to call from outside while the host stays mounted.
     */
    destroy(): void;
    /**
     * Toggles the drawer between open and closed.
     *
     * @param trigger - Element that triggered the toggle, or null.
     * @param trap - Focus-trap root when open (defaults to the drawer).
     * @returns Whether the drawer is open after the toggle.
     */
    toggle({ trigger, trap, }: {
        trigger: HTMLElement | null;
        trap: HTMLElement | null;
    }): boolean;
    /**
     * Opens the drawer. Dispatches cancelable `drawer-before-open` with
     * `detail.resolve()` to commit after async work.
     *
     * @returns `false` if already open, still closed after abort, or waiting on `resolve()`.
     */
    open(): boolean;
    /**
     * Closes the drawer. Dispatches cancelable `drawer-before-close` with
     * `detail.resolve()` to commit after async work.
     *
     * @returns `false` if already closed, still open after abort, or waiting on `resolve()`.
     */
    close(): boolean;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
}
//# sourceMappingURL=drawer.d.ts.map