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
    /** Selected days as `YYYY-MM-DD`. */
    picked: string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    get validity(): ValidityState;
    get validationMessage(): string;
    checkValidity(): boolean;
    reportValidity(): boolean;
    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    /** `:disabled` already follows `disabled` and a disabled `<fieldset>`: only the days need a new render. */
    formDisabledCallback(): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: string | null): void;
    /**
     * Bind markup + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Unbind and empty the grid. A destroyed calendar no longer renders nor blocks its form. */
    destroy(): void;
    /** Navigate by `delta` months (negative = previous). */
    move(delta: number, { focus }?: {
        focus?: boolean | undefined;
    }): void;
    /** Assign selection, mirror `data-picked`, paint the grid, optionally emit `calendar:change`. */
    setPicked(picked: string[], emit?: boolean): void;
    /** Paint the range to come while choosing its end (mouse or keyboard), with the attributes of a picked range. */
    previewRange(to: string): void;
    getWeekdayNames(): string[];
    renderDays(): void;
    renderHeader(year: number, month: number): void;
    renderCalendar(year: number, month: number): void;
    reset(): void;
    /**
     * Rebuild the grid. Focus comes back to the grid when it was there, and the
     * range preview runs once `calendar:render` listeners have decorated the days.
     */
    render({ focus }?: {
        focus?: boolean | undefined;
    }): void;
}
//# sourceMappingURL=calendar.d.ts.map