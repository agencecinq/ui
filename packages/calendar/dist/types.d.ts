/** Selection behaviour for `<cinq-calendar>`. */
export type Mode = "single" | "range" | "multiple";
export interface Options {
    /** `single` (default), `range`, or `multiple` (toggle discrete days). */
    mode: Mode;
    /** Read from `first-day`, else the language, on each render: set the attribute to change it. */
    readonly firstDay: number;
    /** Read from the closest `lang` on each render: set `lang` to change it. */
    readonly locale: string;
    buttonClass?: string;
    days?: string[];
    deselectable?: boolean;
    name?: string;
}
export interface Current {
    month: number;
    year: number;
    /** Navigation day as `YYYY-MM-DD` (may be outside the viewed month until render). */
    day: string | null;
}
export interface Detail {
    values: string[];
    name?: string;
}
/** `calendar:render` detail: the month on screen (`month` is `0`-`11`). */
export interface RenderDetail {
    year: number;
    month: number;
}
//# sourceMappingURL=types.d.ts.map