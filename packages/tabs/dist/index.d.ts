import { default as TabPanel } from './TabPanel';
import { default as Tab } from './Tab';
export type Callback = () => void;
interface Options {
    callback?: Callback;
    delay: number;
}
export declare class Tabs extends HTMLElement {
    $tabList: HTMLElement | null;
    current: number;
    tabPanels: TabPanel[];
    tabs: Tab[];
    href: string;
    options: Options;
    hash: boolean;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    init(): void;
    initEvents(): void;
    handleKeydown: (event: KeyboardEvent) => boolean | void;
    deactivateTabs: () => void;
    deactivateTabPanels: () => void;
    delete({ target }: KeyboardEvent): boolean;
    destroy(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map