import { FormatSize, FormatValue, Mode, Orientation } from './types.js';
/**
 * Window splitter Web Component (APG-style).
 *
 * The host `<cinq-windowsplitter>` is the focusable separator. HTML is the
 * source of truth for roles and ARIA (`aria-orientation`, `aria-valuemin` /
 * `max` / `now`, `aria-controls`, labelling). Style via ARIA / host attrs
 * (`[collapsed]`, `[dragging]`, `[disabled]`, `:focus-visible`) — no invented
 * CSS classes.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 * @see https://github.com/19h47/19h47-windowsplitter
 */
export declare class WindowSplitter extends HTMLElement {
    static observedAttributes: string[];
    $container: HTMLElement | null;
    $primary: HTMLElement | null;
    mode: Mode;
    step: number;
    page: number;
    fixed: boolean;
    formatSize: FormatSize;
    formatValue: FormatValue;
    private previousValue;
    private isMoving;
    private pointerId;
    private grabOffset;
    private previousTouchAction;
    private resizeObserver;
    private bound;
    private reflectingAttribute;
    private containerOverride;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    get orientation(): Orientation;
    get vertical(): boolean;
    get min(): number;
    get max(): number;
    get value(): number;
    set value(next: number);
    get ratio(): number;
    get disabled(): boolean;
    set disabled(on: boolean);
    get collapsed(): boolean;
    /** Optional bounds container; defaults to `parentElement`. */
    set container(el: HTMLElement | null);
    get container(): HTMLElement | null;
    /** Re-read ARIA / primary pane and apply layout. */
    sync(): void;
    /**
     * Set the splitter value (primary pane size).
     * Writes `aria-valuenow`, positions the separator, updates the primary pane.
     */
    setValue(next: number, trigger?: boolean): boolean;
    /** Collapse the primary pane to `aria-valuemin` (remembers previous value). */
    collapse(trigger?: boolean): boolean;
    /** Restore the primary pane to its pre-collapse value (or midpoint). */
    restore(trigger?: boolean): boolean;
    toggle(trigger?: boolean): boolean;
    destroy(): void;
    private mount;
    private syncOptionsFromAttributes;
    private resolveContainer;
    private resolvePrimary;
    private observeContainer;
    private apply;
    private update;
    private containerLength;
    private pointerPosition;
    private valueFromPointer;
    private handlePointerdown;
    private handlePointermove;
    private handlePointerup;
    private handleKeydown;
    private emit;
    private reflectCollapsedAttribute;
    private reflectDraggingAttribute;
    private reflectDisabledAttribute;
}
//# sourceMappingURL=windowsplitter.d.ts.map