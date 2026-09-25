interface DebounceFunction {
    (func: (...args: any[]) => void, wait: number): (...args: any[]) => void;
}
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last call.
 *
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @returns A new debounced function.
 */
export declare const debounce: DebounceFunction;
export {};
//# sourceMappingURL=debounce.d.ts.map