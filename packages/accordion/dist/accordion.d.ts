import { default as Panel } from './Panel.js';
import { AccordionOptions } from './types.js';
/**
 * Accordion Web Component implementing the WAI-ARIA accordion pattern.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export declare class Accordion extends HTMLElement {
    panels: Panel[];
    current: number;
    options: AccordionOptions;
    connectedCallback(): void;
    disconnectedCallback(): void;
    closeAll(): void;
    destroy(): void;
    private handlePanelOpen;
    private handleHashChange;
    private handleKeydown;
}
//# sourceMappingURL=accordion.d.ts.map