import { Panel } from './Panel.js';
import { Options } from './types.js';
/**
 * Accordion Web Component implementing the WAI-ARIA accordion pattern.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export declare class Accordion extends HTMLElement {
    #private;
    panels: Panel[];
    current: number;
    options: Options;
    connectedCallback(): void;
    disconnectedCallback(): void;
    init(): void;
    closeAll(): void;
    destroy(): void;
}
//# sourceMappingURL=accordion.d.ts.map