import { HideOptions, Mode, OnSelect, Option, Render, SearchFn, SelectMode, Write } from './types.js';
/**
 * Editable combobox with list autocomplete Web Component.
 *
 * HTML is the source of truth for roles and structure. Assign `search` (required)
 * to start the controller — the component does not invent missing ARIA markup.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export declare class Combobox extends HTMLElement {
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
    private _value;
    private _expanded;
    private _search;
    private _render;
    private searchId;
    private debounceTimer;
    private abortController;
    private keyboard;
    private bound;
    private reflectingAttribute;
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
    /** KeyboardHost: the focusable textbox (available after mount). */
    get input(): HTMLInputElement;
    /** Whether an option has visual focus (`aria-activedescendant`). */
    get focused(): boolean;
    private get listbox();
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
    private mount;
    private syncOptionsFromAttributes;
    private syncDisabled;
    /**
     * Find the optional open button linked through `ariaControlsElements`.
     * Prefer the host, then document.
     */
    private resolveButton;
    private bind;
    private isTarget;
    private onDocumentClick;
    private onListboxMousedown;
    private onInput;
    private onInputClick;
    private onButtonMousedown;
    private onButtonClick;
    private onListboxClick;
    private onFocus;
    private onBlur;
    private toggle;
    /** Build managed option markup from string labels. */
    private build;
    /**
     * Reflect selection on existing `[role="option"]` nodes.
     * Does not invent markup — options must already have stable `id`s.
     */
    private sync;
    private active;
    /** Remove `aria-activedescendant` — empty string is an invalid IDREF. */
    private clearActiveDescendant;
    private emit;
    private setLoading;
    private setExpanded;
    private detail;
    private schedule;
    private run;
    private apply;
    private replace;
    private clear;
    private clearDebounce;
    private abort;
    private reflectValueAttribute;
    private reflectExpandedAttribute;
    private reflectBusyAttribute;
}
//# sourceMappingURL=combobox.d.ts.map