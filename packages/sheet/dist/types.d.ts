import { WaitUntil } from '@agencecinq/utils';
import { Sheet } from './sheet.js';
export type SheetDetail = {
    sheet: string;
};
export type ToggleDetail = SheetDetail & {
    trigger: HTMLElement | null;
};
export type OpenDetail = SheetDetail & {
    trigger: HTMLElement | null;
};
export type BeforeOpenDetail = SheetDetail & {
    instance: Sheet;
    trigger: HTMLElement | null;
    /** Defers the open until `promise` settles. A rejection cancels it. */
    waitUntil: WaitUntil;
};
export type BeforeCloseDetail = SheetDetail & {
    instance: Sheet;
    /** Defers the close until `promise` settles. A rejection cancels it. */
    waitUntil: WaitUntil;
};
//# sourceMappingURL=types.d.ts.map