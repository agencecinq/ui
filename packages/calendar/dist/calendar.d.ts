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
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    destroy(): void;
    /** Navigate by `delta` months (negative = previous). */
    move(delta: number, { focus }?: {
        focus?: boolean | undefined;
    }): void;
    /** Assign selection, mirror `data-picked-dates`, optionally emit `calendar:change`. */
    setPicked(picked: string[], emit?: boolean): void;
    setDaySelected($el: HTMLElement, selected: boolean): void;
    /** Paint in-between days while choosing the range end (mouse or keyboard). */
    previewRange(to: string): void;
    getMonthName(month: number): string;
    getWeekdays(): string[];
    renderDays(): void;
    renderHeader(month: number, year: number): void;
    renderCalendar(month: number, year: number, { focus }?: {
        focus?: boolean | undefined;
    }): void;
    reset(): void;
    render({ focus }?: {
        focus?: boolean | undefined;
    }): void;
    /** Override to enrich or rebuild each day cell. Keep `.js-day` and `data-day`. */
    renderInner(_inner: HTMLElement, _date: Date): void;
}
//# sourceMappingURL=calendar.d.ts.map