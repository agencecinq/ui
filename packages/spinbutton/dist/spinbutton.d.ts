import { FormatValue, Options, Value } from './types.js';
/**
 * Spinbutton Web Component implementing the WAI-ARIA spinbutton pattern.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */
export declare class Spinbutton extends HTMLElement {
    #private;
    $input: HTMLInputElement | null;
    $increase: HTMLButtonElement | null;
    $decrease: HTMLButtonElement | null;
    $live: HTMLElement | null;
    options: Options;
    value: Value;
    get formatValue(): FormatValue | undefined;
    set formatValue(fn: FormatValue | undefined);
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    decrease: () => void;
    increase: () => void;
    setMin(value: number, emit?: boolean): void;
    setMax(value: number, emit?: boolean): void;
    setValue(value: number, emit?: boolean): void;
    destroy(): void;
}
//# sourceMappingURL=spinbutton.d.ts.map