import { FormatSize, FormatValue, Mode } from './types.js';
/**
 * Window splitter Web Component (APG-style).
 *
 * The host `<cinq-windowsplitter>` is the **layout wrapper** (bounds + CSS
 * custom properties). A nested separator (`role="separator"` or `slider`) is
 * the focusable control: ARIA value attributes and `aria-controls` live there.
 * Style the host via `[collapsed]` / `[dragging]` / `[disabled]`, or the
 * separator via `[role="separator"]`. Host CSS variables: `--value`, `--ratio`,
 * `--offset`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 * @see https://github.com/19h47/19h47-windowsplitter
 */
export declare class WindowSplitter extends HTMLElement {
    #private;
    static observedAttributes: string[];
    /** Focusable separator control inside the host. */
    $separator: HTMLElement | null;
    mode: Mode;
    step: number;
    page: number;
    fixed: boolean;
    formatSize: FormatSize;
    formatValue: FormatValue;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Bind separator + listeners. Call {@link destroy} first if already bound.
     */
    init(): void;
    /** Detaches listeners and observers. Safe to call from outside while mounted. */
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
}
//# sourceMappingURL=windowsplitter.d.ts.map