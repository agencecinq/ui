/**
 * Parses a space-separated token list into an array of non-empty strings.
 *
 * Useful for ARIA ID reference lists such as `aria-controls`, `aria-labelledby`,
 * or `aria-describedby`.
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
//# sourceMappingURL=parse-list.d.ts.map