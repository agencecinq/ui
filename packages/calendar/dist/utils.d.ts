/** Local calendar day as `YYYY-MM-DD`. */
export declare function toDayString(date: Date): string;
/** Parse a local `YYYY-MM-DD` day into a Date at local midnight. */
export declare function fromDayString(day: string): Date;
/** Inclusive `YYYY-MM-DD` range check. */
export declare function isBetween(check: string, from: string, to: string): boolean;
/** @see https://dzone.com/articles/determining-number-days-month */
export declare function getDaysInMonth(year: number, month: number): number;
/**
 * How many weekdays precede the 1st of the month, given a week start
 * (`0`=Sun … `6`=Sat).
 *
 * @see https://stackoverflow.com/a/33508649/5091221
 */
export declare function getLeadingDays(month: number, year: number, weekStart?: number): number;
/**
 * Week start for a locale as JS `getDay()` (0=Sun … 6=Sat).
 * Falls back to Sunday when `Intl.Locale.getWeekInfo` is unavailable.
 */
export declare function getWeekStart(locale: string): number;
/** Sunday-first weekday labels (Jan 5, 2020 was a Sunday). */
export declare function getIntlWeekdays(locale: string, weekday?: Intl.DateTimeFormatOptions["weekday"]): string[];
export declare function getIntlMonth(locale: string, month: number): string;
//# sourceMappingURL=utils.d.ts.map