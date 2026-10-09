import { WaitUntil } from '@agencecinq/utils';
import { Drawer } from './drawer.js';
export type BeforeOpenDetail = {
    drawer: string;
    instance: Drawer;
    trigger: HTMLElement | null;
    /** Defers the open until `promise` settles. A rejection cancels it. */
    waitUntil: WaitUntil;
};
export type BeforeCloseDetail = {
    drawer: string;
    instance: Drawer;
    /** Defers the close until `promise` settles. A rejection cancels it. */
    waitUntil: WaitUntil;
};
//# sourceMappingURL=types.d.ts.map