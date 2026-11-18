import { Direction } from './types.js';
/**
 * Arrow keys to a heading. The host owns game rules.
 */
export default class Keyboard {
    #private;
    constructor(onDirection: (direction: Direction) => void);
    handle: (event: KeyboardEvent) => void;
}
//# sourceMappingURL=keyboard.d.ts.map