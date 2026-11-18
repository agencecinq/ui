export type { BeforeCloseDetail, BeforeOpenDetail } from './types.js';
export declare class Sheet extends HTMLElement {
    #private;
    /** Element that last requested the sheet to open. */
    trigger: HTMLElement | null;
    $dialog: HTMLDialogElement | null;
    $handle: HTMLElement | null;
    /** Pulls dismiss unless the dialog opts out with `closedby="none"`. */
    get dismissible(): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind dialog, handle and trigger listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners and closes the dialog. Safe to call from outside while the host stays mounted. */
    destroy(): void;
    /**
     * Opens the sheet. Dispatches cancelable `sheet:before-open`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @returns Whether this call opened the sheet.
     */
    show(): Promise<boolean>;
    /**
     * Closes the sheet. Dispatches cancelable `sheet:before-close`: listeners
     * cancel with `preventDefault()` or defer with `detail.waitUntil(promise)`.
     *
     * @param returnValue - Becomes the dialog's `returnValue` on a modal sheet, as with `dialog.close()`.
     * @returns Whether this call closed the sheet.
     */
    close(returnValue?: string): Promise<boolean>;
}
//# sourceMappingURL=sheet.d.ts.map