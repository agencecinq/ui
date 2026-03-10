interface ThrottleFunction {
    (func: (...args: any[]) => void, wait: number): (...args: any[]) => void;
}
/**
 * Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.
 *
 * @param func - The function to throttle.
 * @param wait - The number of milliseconds to wait before allowing `func` to be called again.
 * @returns A new throttled function.
 */
export declare const throttle: ThrottleFunction;
export {};
//# sourceMappingURL=throttle.d.ts.map