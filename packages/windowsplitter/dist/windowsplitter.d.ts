import { FormatSize, FormatValue, Mode } from './types.js';
/**
 * Window splitter Web Component (APG-style).
 *
 * The host `<cinq-windowsplitter>` is the **layout wrapper** (bounds + CSS
 * custom properties). A nested separator (`role="separator"` or `slider`) is
 * the focusable control: ARIA value attributes and `aria-controls` live there.
 * Style the host via `[collapsed]` / `[dragging]` / `[disabled]`, or the
 * separator via `[role="separator"]`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 * @see https://github.com/19h47/19h47-windowsplitter
 */
export declare class WindowSplitter extends HTMLElement {
    static observedAttributes: string[];
    /** Focusable separator control inside the host. */
    $separator: HTMLElement | null;
    mode: Mode;
    step: number;
    page: number;
    fixed: boolean;
    formatSize: FormatSize;
    formatValue: FormatValue;
    private history;
    private resizeObserver;
    private keyboard;
    private bound;
    /** Active pointer drag; `null` when idle. `id` is `PointerEvent.pointerId`. */
    private drag;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Detaches listeners and observers. Called automatically from `disconnectedCallback`. */
    destroy(): void;
    attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void;
    /** Raw `aria-orientation` on `$separator` (HTML source of truth). */
    get orientation(): string | null;
    /**
     * Primary pane from `$separator.ariaControlsElements`
     * (reflects `aria-controls`; HTML source of truth).
     */
    get $primary(): HTMLElement | null;
    get min(): number;
    get max(): number;
    get value(): number;
    set value(next: number);
    get ratio(): number;
    get disabled(): boolean;
    set disabled(on: boolean);
    get collapsed(): boolean;
    /** Re-read ARIA and apply layout. */
    sync(): void;
    /**
     * Set the splitter value (primary pane size).
     * Writes `aria-valuenow` on the separator, positions it, updates the primary pane.
     */
    setValue(next: number, trigger?: boolean): boolean;
    /** Collapse the primary pane to `aria-valuemin` (remembers previous value). */
    collapse(trigger?: boolean): boolean;
    /** Restore the primary pane to its pre-collapse value (or midpoint). */
    restore(trigger?: boolean): boolean;
    toggle(trigger?: boolean): boolean;
    private read;
    private observe;
    private apply;
    private update;
    private emit;
    private valueFromPointer;
    private handlePointerdown;
    private handlePointermove;
    private handlePointerup;
}
//# sourceMappingURL=windowsplitter.d.ts.map