import { Calendar } from './calendar.js';
/** APG day-grid focus: roving tabindex + keyboard navigation. */
export default class Keyboard {
    #private;
    host: Calendar;
    constructor(host: Calendar);
    setFocusDay($button: HTMLButtonElement, { focus }?: {
        focus?: boolean | undefined;
    }): void;
    /** Same day-of-month in the viewed month, or last day if it does not exist (APG). */
    dayInView(): string;
    focusDayByOffset(fromDay: string, dayDelta: number): void;
    sync({ focus }?: {
        focus?: boolean | undefined;
    }): void;
    attach(): void;
    detach(): void;
}
//# sourceMappingURL=keyboard.d.ts.map