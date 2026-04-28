import { Options, Text, Value } from './types';
export declare class Spinbutton extends HTMLElement {
    $input: HTMLInputElement | null;
    $increase: HTMLButtonElement | null;
    $decrease: HTMLButtonElement | null;
    $liveRegion: HTMLElement | null;
    options: Options;
    value: Value;
    text: Text | undefined;
    private throttledEmit;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private parseText;
    init(): void;
    private initEvents;
    private handleInputChange;
    private handleKeydown;
    decrease: () => void;
    increase: () => void;
    setMin(value: number, emit?: boolean): void;
    setMax(value: number, emit?: boolean): void;
    setValue(value: number, emit?: boolean): void;
    private emitChange;
    destroy(): void;
}
//# sourceMappingURL=index.d.ts.map