import { HideOptions, Write } from './types.js';
/**
 * Minimal surface the keyboard layer needs from the combobox.
 * Keeps key handling free of search / render / DOM sync details.
 */
export type KeyboardHost = {
    input: HTMLInputElement;
    readonly focused: boolean;
    readonly expanded: boolean;
    index: number;
    readonly options: {
        length: number;
    };
    value: string;
    write: Write;
    select(): void;
    hide(options?: HideOptions): void;
    ensureOpen(): Promise<boolean>;
    blurOption(): void;
    refresh(index: number): void;
};
/**
 * W3C APG combobox keyboard behaviour.
 * Bound once to `input` keydown; host owns state and side effects.
 */
export default class Keyboard {
    #private;
    constructor(host: KeyboardHost);
    handle: (event: KeyboardEvent) => void;
}
//# sourceMappingURL=keyboard.d.ts.map