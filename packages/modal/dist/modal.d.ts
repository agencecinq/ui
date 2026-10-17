export type { BeforeCloseDetail, BeforeOpenDetail } from './types.js';
export declare class Modal extends HTMLElement {
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
     * Opens the modal. Dispatches cancelable `modal:before-open`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @returns Whether this call opened the modal.
     */
    show(): Promise<boolean>;
    /**
     * Closes the modal. Dispatches cancelable `modal:before-close`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @param returnValue - Becomes the dialog's `returnValue`, as with `dialog.close()`.
     * @returns Whether this call closed the modal.
     */
    close(returnValue?: string): Promise<boolean>;
}
//# sourceMappingURL=modal.d.ts.map