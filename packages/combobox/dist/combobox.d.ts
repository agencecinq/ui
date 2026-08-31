import { HideOptions, Mode, OnSelect, Option, OptionRenderProps, Render, SearchFn, SelectMode, Write } from './types.js';
/** Build plain props for a managed `[role="option"]`. */
export declare function optionRenderProps(index: number, selectedIndex: number, listboxId: string, size: number): OptionRenderProps;
/** Serialize managed option ARIA attributes for HTML markup. */
export declare function serializeOptionAttrs({ id, index, size, selected, }: OptionRenderProps): string;
/**
 * Editable combobox with list autocomplete Web Component.
 *
 * HTML is the source of truth for roles and structure. Assign `search` (required)
 * to start the controller — the component does not invent missing ARIA markup.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export declare class Combobox extends HTMLElement {
    #private;
    static observedAttributes: string[];
    $input: HTMLInputElement | null;
    $listbox: HTMLElement | null;
    $button: HTMLButtonElement | null;
    index: number;
    options: Option[];
    loading: boolean;
    mode: Mode;
    selectMode: SelectMode;
    autoselect: boolean;
    autocomplete: string;
    debounce: number;
    minLength: number;
    openOnEmpty: boolean;
    write: Write;
    onSelect: OnSelect | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /** Current textbox value (mirrored on the host `value` attribute). */
    get value(): string;
    set value(next: string);
    get expanded(): boolean;
    get disabled(): boolean;
    /**
     * Update the textbox value from outside (property, attribute, or API).
     * Does not open the listbox or fire `combobox:submit`.
     */
    setValue(next: string, { reflect }?: {
        reflect?: boolean;
    }): void;
    /** Required. Assign a search function to bind the combobox. */
    get search(): SearchFn | null;
    set search(value: SearchFn | null);
    get render(): Render;
    set render(value: Render);
    /** KeyboardHost: the focusable textbox (available after init). */
    get input(): HTMLInputElement;
    /** Whether an option has visual focus (`aria-activedescendant`). */
    get focused(): boolean;
    show(): void;
    hide({ force, clear }?: HideOptions): void;
    /** Accept the visually focused option (Enter / click / Tab). */
    select: () => void;
    destroy(): void;
    /** Clear visual focus without closing the listbox. */
    blurOption(): void;
    /** Sync ARIA on existing options, then announce active descendant. */
    refresh(index: number): void;
    /** Open the listbox if needed (runs search when closed / empty). */
    ensureOpen(): Promise<boolean>;
    /**
     * Bind markup + listeners once `search` is set. Call {@link destroy} first
     * if already bound.
     */
    init(): void;
}
//# sourceMappingURL=combobox.d.ts.map