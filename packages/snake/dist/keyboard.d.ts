import { Direction } from './types.js';
/**
 * Arrow keys (and optional swipe) to a heading. The host owns game rules.
 */
export default class Keyboard {
    #private;
    constructor(onDirection: (direction: Direction) => void);
    handle: (event: KeyboardEvent) => void;
    handlePointerDown: (event: PointerEvent) => void;
    handlePointerUp: (event: PointerEvent) => void;
    handlePointerCancel: () => void;
}
//# sourceMappingURL=keyboard.d.ts.map