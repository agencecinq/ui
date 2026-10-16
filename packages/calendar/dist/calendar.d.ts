import { Current, Options } from './types.js';
/**
 * Date / range / multi-date picker Web Component.
 *
 * Markup and CSS are yours — the package fills the grid and handles selection.
 * Follows the WAI-ARIA APG date grid practices.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
 * @see https://github.com/19h47/19h47-calendar
 */
export declare class Calendar extends HTMLElement {
    #private;
    static formAssociated: boolean;
    static observedAttributes: string[];
    today: Date;
    day: string;
    options: Options;
    current: Current;
    $body: HTMLTableSectionElement | null;
    $title: HTMLElement | null;
    $next: HTMLButtonElement | null;
    $previous: HTMLButtonElement | null;
    /** Selected days as `YYYY-MM-DD`. */
    picked: string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    formDisabledCallback(disabled: boolean): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | null): void;
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    destroy(): void;
    /** Navigate by `delta` months (negative = previous). */
    move(delta: number, { focus }?: {
        focus?: boolean | undefined;
    }): void;
    /** Assign selection, mirror `data-picked`, paint the grid, optionally emit `calendar:change`. */
    setPicked(picked: string[], emit?: boolean): void;
    /** Paint in-between days while choosing the range end (mouse or keyboard). */
    previewRange(to: string): void;
    getMonthName(month: number): string;
    getWeekdayNames(): string[];
    renderDays(): void;
    renderHeader(year: number, month: number): void;
    renderCalendar(year: number, month: number, { focus }?: {
        focus?: boolean | undefined;
    }): void;
    reset(): void;
    render({ focus }?: {
        focus?: boolean | undefined;
    }): void;
}
//# sourceMappingURL=calendar.d.ts.map