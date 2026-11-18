import { WaitUntil } from '@agencecinq/utils';
import { Sheet } from './sheet.js';
export type BeforeOpenDetail = {
    /** The dialog's `id`. */
    sheet: string;
    instance: Sheet;
    trigger: HTMLElement | null;
    /** Defers the open until `promise` settles. A rejection cancels it. */
    waitUntil: WaitUntil;
};
export type BeforeCloseDetail = {
    /** The dialog's `id`. */
    sheet: string;
    instance: Sheet;
    /** Defers the close until `promise` settles. A rejection cancels it. */
    waitUntil: WaitUntil;
};
//# sourceMappingURL=types.d.ts.map