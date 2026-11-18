export type { BeforeCloseDetail, BeforeOpenDetail } from './types.js';
export declare class Drawer extends HTMLElement {
    #private;
    trigger: HTMLElement | null;
    $dialog: HTMLDialogElement | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind dialog listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners and closes the dialog. Safe to call from outside while the host stays mounted. */
    destroy(): void;
    /**
     * Opens the drawer. Dispatches cancelable `drawer:before-open`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @returns Whether this call opened the drawer.
     */
    show(): Promise<boolean>;
    /**
     * Closes the drawer. Dispatches cancelable `drawer:before-close`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @param returnValue - Becomes the dialog's `returnValue` on a modal drawer, as with `dialog.close()`.
     * @returns Whether this call closed the drawer.
     */
    close(returnValue?: string): Promise<boolean>;
}
//# sourceMappingURL=drawer.d.ts.map