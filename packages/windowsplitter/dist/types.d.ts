export type Mode = "resize" | "clip" | "none";
export type Size = {
    value: number;
    ratio: number;
    offset: number;
    length: number;
};
export type FormatSize = (size: Size) => string;
export type FormatValue = (value: number) => string;
export type Detail = {
    value: number;
    min: number;
    max: number;
    ratio: number;
    collapsed: boolean;
};
//# sourceMappingURL=types.d.ts.map