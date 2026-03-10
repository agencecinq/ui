import { Callback } from './index';
export default class Tab {
    el: HTMLElement;
    active: boolean;
    id: string;
    callback: Callback;
    controls: string;
    constructor(el: HTMLElement, callback: Callback);
    init: () => void;
    initEvents: () => void;
    /**
     * Handle click
     */
    handleClick: () => Promise<void>;
    /**
     * Toggle
     *
     * @param {boolean} focus
     */
    toggle(focus?: boolean): Promise<void>;
    /**
     * Activate tab
     *
     * @param {boolean} focus
     * @return void
     */
    activate(focus?: boolean): void;
    /**
     * Deactivate tab
     *
     * @return void
     */
    deactivate(): void;
    /**
     * Focus tab
     *
     * @return void
     */
    focus: () => void;
    /**
     * Delete tab
     *
     * @return void
     */
    delete: () => void;
    destroy(): void;
}
//# sourceMappingURL=Tab.d.ts.map