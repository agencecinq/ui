import { WindowSplitter } from './windowsplitter.js';
/**
 * W3C APG window splitter keyboard behaviour.
 * Bound once to the separator keydown; host owns state and side effects.
 *
 * Arrow keys follow `aria-orientation`: Left/Right for a vertical splitter,
 * Up/Down for a horizontal one.
 */
export default class Keyboard {
    private readonly host;
    constructor(host: WindowSplitter);
    handle: (event: KeyboardEvent) => void;
}
//# sourceMappingURL=keyboard.d.ts.map