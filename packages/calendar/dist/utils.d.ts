/** Local `YYYY-MM-DD` day of a date. */
export declare function dayFromDate(date: Date): string;
/** Date at local midnight of a `YYYY-MM-DD` day. */
export declare function dateFromDay(day: string): Date;
/** Whether a `YYYY-MM-DD` day falls between `start` and `end`, both included. */
export declare function isBetween(day: string, start: string, end: string): boolean;
/** Number of days in a month (`month` is `0`-`11`). */
export declare function getDaysInMonth(year: number, month: number): number;
/**
 * How many cells precede the 1st of the month in its first week row, given
 * the first day of the week (`0`=Sun ... `6`=Sat).
 */
export declare function getLeadingDays(year: number, month: number, firstDay?: number): number;
/**
 * First day of the week for a locale, as `Date#getDay()` (`0`=Sun ... `6`=Sat).
 * Sunday when `Intl.Locale#getWeekInfo()` is unavailable.
 */
export declare function getFirstDay(locale: string): number;
/**
 * Date formatter on the Gregorian calendar the grid is built on, whatever the
 * locale's own calendar (Persian for `fa`, Buddhist for `th`).
 */
export declare function getDateFormat(locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat;
/** Weekday names, Sunday first (5 January 2020 was a Sunday). */
export declare function getWeekdayNames(locale: string, width?: "long" | "short" | "narrow"): string[];
/** Month names, January first. */
export declare function getMonthNames(locale: string, width?: "long" | "short" | "narrow"): string[];
//# sourceMappingURL=utils.d.ts.map