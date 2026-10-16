/** Local `YYYY-MM-DD` day of a date. */
export function dayFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`;
}

/** Date at local midnight of a `YYYY-MM-DD` day. */
export function dateFromDay(day: string): Date {
  const [year, month, dayOfMonth] = day.split("-").map(Number);

  return new Date(year, month - 1, dayOfMonth);
}

/** Whether a `YYYY-MM-DD` day falls between `start` and `end`, both included. */
export function isBetween(day: string, start: string, end: string): boolean {
  return day >= start && day <= end;
}

/** Number of days in a month (`month` is `0`-`11`). */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * How many cells precede the 1st of the month in its first week row, given
 * the first day of the week (`0`=Sun ... `6`=Sat).
 */
export function getLeadingDays(
  year: number,
  month: number,
  firstDay = 0,
): number {
  return (new Date(year, month, 1).getDay() - firstDay + 7) % 7;
}

/**
 * First day of the week for a locale, as `Date#getDay()` (`0`=Sun ... `6`=Sat).
 * Sunday when `Intl.Locale#getWeekInfo()` is unavailable.
 */
export function getFirstDay(locale: string): number {
  const weekInfo = (
    new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
    }
  ).getWeekInfo?.();

  return (weekInfo?.firstDay ?? 0) % 7;
}

/**
 * Date formatter on the Gregorian calendar the grid is built on, whatever the
 * locale's own calendar (Persian for `fa`, Buddhist for `th`).
 */
export function getDateFormat(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, { ...options, calendar: "gregory" });
}

/** Weekday names, Sunday first (5 January 2020 was a Sunday). */
export function getWeekdayNames(
  locale: string,
  width: "long" | "short" | "narrow" = "short",
): string[] {
  const format = getDateFormat(locale, { weekday: width });

  return Array.from({ length: 7 }, (_, weekday) =>
    format.format(new Date(2020, 0, 5 + weekday)),
  );
}
