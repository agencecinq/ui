import { Drawer } from './drawer.js';
export type BeforeOpenDetail = {
    drawer: string;
    instance: Drawer;
    trigger: HTMLElement | null;
    /** Commit the open after async work (idempotent). */
    resolve: () => void;
};
export type BeforeCloseDetail = {
    drawer: string;
    instance: Drawer;
    /** Commit the close after async work (idempotent). */
    resolve: () => void;
};
//# sourceMappingURL=types.d.ts.map