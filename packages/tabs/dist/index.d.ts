import { default as TabPanel } from './TabPanel.js';
import { default as Tab } from './Tab.js';
export declare class Tabs extends HTMLElement {
    #private;
    $tabList: HTMLElement | null;
    current: number;
    tabPanels: TabPanel[];
    tabs: Tab[];
    href: string;
    hash: boolean;
    delay: number;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind tabs + panels. Call {@link destroy} first if already bound.
     */
    init(): void;
    initEvents(): void;
    handleKeydown: (event: KeyboardEvent) => boolean | void;
    deactivateTabs: () => void;
    deactivateTabPanels: () => void;
    delete({ target }: KeyboardEvent): boolean;
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map