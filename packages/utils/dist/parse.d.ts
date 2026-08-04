/**
 * Parses a space-separated token list into an array of non-empty strings.
 *
 * Useful for ARIA ID reference list *attributes* such as `aria-labelledby` or
 * `aria-describedby`. Prefer `Element.ariaControlsElements` when resolving
 * `aria-controls` targets to live DOM nodes.
 *
 * @param value - Raw attribute value, or `null` / `undefined` when missing.
 * @returns Trimmed tokens; an empty array when `value` is empty or absent.
 *
 * @example
 * parseList('a b c');           // ['a', 'b', 'c']
 * parseList('  foo   bar  ');   // ['foo', 'bar']
 * parseList(null);              // []
 */
export declare const parseList: (value: string | null | undefined) => string[];
/**
 * Parses a raw attribute string into a finite number.
 *
 * @param value - Attribute value, or `null` / `undefined` when missing.
 * @param fallback - Returned when `value` is empty or not a finite number.
 *
 * @example
 * parseNumber('12', 0);   // 12
 * parseNumber('', 1);     // 1
 * parseNumber(null, 10);  // 10
 */
export declare const parseNumber: (value: string | null | undefined, fallback: number) => number;
/**
 * Parses a raw attribute string as a boolean.
 *
 * Absent attributes use `fallback`. Present values are `true` unless
 * explicitly `"false"` or `"0"`.
 *
 * @example
 * parseBoolean(null);          // false
 * parseBoolean(null, true);    // true
 * parseBoolean('false');       // false
 * parseBoolean('');            // true (attribute present)
 */
export declare const parseBoolean: (value: string | null | undefined, fallback?: boolean) => boolean;
//# sourceMappingURL=parse.d.ts.map