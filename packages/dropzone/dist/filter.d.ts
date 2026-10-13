import { Rejection } from './types.js';
export type Rules = {
    /** The input's `accept`: extensions (`.svg`), MIME types (`image/png`) or groups (`image/*`). */
    accept: string;
    /** Largest file in bytes, `0` for no limit. */
    maxSize: number;
    multiple: boolean;
};
/** Whether a file matches an `accept` attribute, as the native picker reads it. */
export declare function accepts(file: File, accept: string): boolean;
/** Splits files into the ones the input keeps and the ones it leaves out. */
export declare function filter(files: File[], { accept, maxSize, multiple }: Rules): {
    accepted: File[];
    rejected: Rejection[];
};
//# sourceMappingURL=filter.d.ts.map