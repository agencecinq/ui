import { EVENTS, dispatchEvent, parseList } from "@agencecinq/utils";
import Props from "./Props.js";
import Keyboard from "./keyboard.js";
import type {
  EmptyDetail,
  HideOptions,
  Mode,
  OnSelect,
  Option,
  Render,
  RunOptions,
  SearchFn,
  SearchResult,
  SelectDetail,
  SelectMode,
  Write,
} from "./types.js";

const DEFAULT_WRITE: Write = (el, value) => {
  el.value = value;
};

const DEFAULT_RENDER: Render = (result, props) => `<li${props}>${result}</li>`;

const CONFIG_ATTRIBUTES = [
  "data-combobox-mode",
  "data-combobox-select-mode",
  "data-combobox-debounce",
  "data-combobox-min-length",
  "data-combobox-open-on-empty",
  "data-combobox-autoselect",
] as const;

const parseBooleanAttr = (el: HTMLElement, attr: string): boolean => {
  const raw = el.getAttribute(attr);
  if (raw === null) return false;
  return raw !== "false" && raw !== "0";
};

const parseIntAttr = (
  el: HTMLElement,
  attr: string,
  fallback: number,
): number => {
  const raw = el.getAttribute(attr);
  if (raw === null) return fallback;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

/**
 * Editable combobox with list autocomplete Web Component.
 *
 * HTML is the source of truth for roles and structure. Assign `search` (required)
 * to start the controller — the component does not invent missing ARIA markup.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export class Combobox extends HTMLElement {
  static observedAttributes = [
    "value",
    "disabled",
    "expanded",
    ...CONFIG_ATTRIBUTES,
  ];

  $input: HTMLInputElement | null = null;
  $listbox: HTMLElement | null = null;
  $button: HTMLButtonElement | null = null;

  index = -1;
  options: Option[] = [];
  loading = false;

  mode: Mode = "managed";
  selectMode: SelectMode = "value";
  autoselect = false;
  autocomplete = "list";
  debounce = 0;
  minLength = 0;
  openOnEmpty = false;
  write: Write = DEFAULT_WRITE;
  onSelect: OnSelect | null = null;

  private _value = "";
  private _expanded = false;
  private _search: SearchFn | null = null;
  private _render: Render = DEFAULT_RENDER;
  private searchId = 0;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private abortController: AbortController | null = null;
  private keyboard: Keyboard | null = null;
  private bound = false;
  private reflectingAttribute = false;

  connectedCallback(): void {
    this.$input =
      this.querySelector<HTMLInputElement>('[role="combobox"]') ||
      this.querySelector<HTMLInputElement>("input");
    this.$listbox =
      this.querySelector<HTMLElement>('[role="listbox"]') ||
      this.querySelector<HTMLElement>("[data-combobox-listbox]");
    this.$button =
      this.querySelector<HTMLButtonElement>("[data-combobox-button]") || null;

    this.mount();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$input = null;
    this.$listbox = null;
    this.$button = null;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (this.reflectingAttribute || oldValue === newValue) {
      return;
    }

    if (name === "value") {
      this.setValue(newValue ?? "", { reflect: false });
      return;
    }

    if (name === "disabled") {
      this.syncDisabled();
      return;
    }

    if (name === "expanded") {
      if (newValue !== null) {
        void this.ensureOpen().then((opened) => {
          if (opened) this.blurOption();
        });
      } else {
        this.hide({ force: true });
      }
      return;
    }

    if ((CONFIG_ATTRIBUTES as readonly string[]).includes(name)) {
      this.syncOptionsFromAttributes();
    }
  }

  /** Current textbox value (mirrored on the host `value` attribute). */
  get value(): string {
    return this._value;
  }

  set value(next: string) {
    this.setValue(next);
  }

  get expanded(): boolean {
    return this._expanded;
  }

  get disabled(): boolean {
    return (
      this.hasAttribute("disabled") ||
      this.getAttribute("aria-disabled") === "true"
    );
  }

  /**
   * Update the textbox value from outside (property, attribute, or API).
   * Does not open the listbox or fire `combobox:submit`.
   */
  setValue(
    next: string,
    { reflect = true }: { reflect?: boolean } = {},
  ): void {
    const value = next ?? "";

    this._value = value;

    if (this.$input && this.$input.value !== value) {
      this.write(this.$input, value);
    }

    if (reflect) {
      this.reflectValueAttribute();
    }
  }

  /** Required. Assign a search function to bind the combobox. */
  get search(): SearchFn | null {
    return this._search;
  }

  set search(value: SearchFn | null) {
    this._search = value;
    if (!this.bound) {
      this.mount();
    }
  }

  get render(): Render {
    return this._render;
  }

  set render(value: Render) {
    this._render = value;
  }

  /** KeyboardHost: the focusable textbox (available after mount). */
  get input(): HTMLInputElement {
    if (!this.$input) {
      throw new Error("cinq-combobox: input is not ready");
    }
    return this.$input;
  }

  /** Whether an option has visual focus (`aria-activedescendant`). */
  get focused(): boolean {
    return -1 < this.index;
  }

  private get listbox(): HTMLElement {
    if (!this.$listbox) {
      throw new Error("cinq-combobox: listbox is not ready");
    }
    return this.$listbox;
  }

  show(): void {
    if (!this.$input || !this.$listbox || this.disabled) return;

    this.listbox.removeAttribute("hidden");
    this.setExpanded(true);
  }

  hide({ force = false, clear = true }: HideOptions = {}): void {
    if (!this.$input || !this.$listbox) return;
    if (!force && !this._expanded) {
      return;
    }

    const selected = this.options[this.index];

    if (this.autoselect && selected && this.selectMode === "value") {
      const { value } = selected;

      this.setValue(value);
    }

    this.index = -1;

    if (clear) {
      this.clear();
    } else {
      this.options.forEach(({ element }) => {
        element.setAttribute("aria-selected", "false");
      });
    }

    this.clearActiveDescendant();
    this.listbox.setAttribute("hidden", "");
    this.setExpanded(false);
  }

  /** Accept the visually focused option (Enter / click / Tab). */
  select = (): void => {
    if (!this.$input || !this.$listbox || this.disabled) return;

    const option = this.options[this.index] ?? null;
    const detail = this.detail(option, this.index);

    if (option && this.selectMode === "value") {
      const { value } = option;

      this.setValue(value);
    }

    this.onSelect?.(detail);
    this.emit(EVENTS.COMBOBOX_SUBMIT, detail);
    this.hide({ force: true });
  };

  destroy(): void {
    this.searchId += 1;
    this.clearDebounce();
    this.abort();

    if (this.bound && this.$input && this.$listbox && this.keyboard) {
      this.$input.removeEventListener("input", this.onInput);
      this.$input.removeEventListener("keydown", this.keyboard.handle);
      this.$input.removeEventListener("click", this.onInputClick);
      this.$input.removeEventListener("focus", this.onFocus);
      this.$input.removeEventListener("blur", this.onBlur);
      this.$listbox.removeEventListener("mousedown", this.onListboxMousedown);
      this.$listbox.removeEventListener("click", this.onListboxClick);
      this.$button?.removeEventListener("mousedown", this.onButtonMousedown);
      this.$button?.removeEventListener("click", this.onButtonClick);
      document.removeEventListener("click", this.onDocumentClick);
    }

    this.keyboard = null;
    this.bound = false;
  }

  /** Clear visual focus without closing the listbox. */
  blurOption(): void {
    if (!this.$input || !this.$listbox) return;

    if (!this.focused) {
      this.clearActiveDescendant();
      return;
    }

    this.index = -1;
    this.refresh(this.index);
  }

  /** Sync ARIA on existing options, then announce active descendant. */
  refresh(index: number): void {
    if (!this.$input || !this.$listbox) return;

    this.sync(index);
    this.active(index);

    const { options, value } = this;

    this.emit(EVENTS.COMBOBOX_UPDATE, { options, index, value });
  }

  /** Open the listbox if needed (runs search when closed / empty). */
  async ensureOpen(): Promise<boolean> {
    if (!this.$input || !this.$listbox || this.disabled) return false;

    if (this._expanded && 0 < this.options.length) {
      return true;
    }

    const { value } = this.input;

    await this.run(value, { openWhenEmpty: true });

    return this._expanded && 0 < this.options.length;
  }

  private mount(): void {
    this.destroy();

    if (!this.isConnected || !this.$input || !this.$listbox || !this._search) {
      return;
    }

    this.syncOptionsFromAttributes();
    this.autocomplete =
      this.$input.getAttribute("aria-autocomplete") || "list";

    if (!this.$button) {
      this.$button = this.resolveButton();
    }

    const fromAttr = this.getAttribute("value");
    if (fromAttr !== null) {
      this.setValue(fromAttr, { reflect: false });
    } else if (this.$input.value) {
      this.setValue(this.$input.value);
    }

    this.syncDisabled();

    this.keyboard = new Keyboard(this);
    this.sync(-1);
    this.hide({ force: true, clear: false });
    this.bind();
    this.bound = true;
  }

  private syncOptionsFromAttributes(): void {
    const mode =
      (this.getAttribute("data-combobox-mode") as Mode | null) ?? "managed";
    const selectMode =
      (this.getAttribute("data-combobox-select-mode") as SelectMode | null) ??
      "value";

    this.mode = mode === "external" ? "external" : "managed";
    this.selectMode = selectMode === "custom" ? "custom" : "value";
    this.debounce = Math.max(
      0,
      parseIntAttr(this, "data-combobox-debounce", 0),
    );
    this.minLength = Math.max(
      0,
      parseIntAttr(this, "data-combobox-min-length", 0),
    );
    this.openOnEmpty = parseBooleanAttr(this, "data-combobox-open-on-empty");
    this.autoselect = parseBooleanAttr(this, "data-combobox-autoselect");
  }

  private syncDisabled(): void {
    const isDisabled = this.disabled;

    if (this.$input) {
      this.$input.disabled = isDisabled;
      if (isDisabled) {
        this.$input.setAttribute("disabled", "");
      } else {
        this.$input.removeAttribute("disabled");
      }
    }

    if (this.$button) {
      this.$button.disabled = isDisabled;
      if (isDisabled) {
        this.$button.setAttribute("disabled", "");
      } else {
        this.$button.removeAttribute("disabled");
      }
    }

    if (isDisabled && this._expanded) {
      this.hide({ force: true });
    }
  }

  /**
   * Find the optional open button linked through `aria-controls`
   * (space-separated id list supported). Prefer the host, then document.
   */
  private resolveButton(): HTMLButtonElement | null {
    const { id } = this.listbox;

    if (!id) {
      return null;
    }

    for (const scope of [this as ParentNode, document]) {
      const buttons = scope.querySelectorAll<HTMLButtonElement>(
        "button[aria-controls]",
      );

      for (const button of buttons) {
        const controls = button.getAttribute("aria-controls");

        if (!controls) {
          continue;
        }

        const ids = parseList(controls);

        if (ids.includes(id)) {
          return button;
        }
      }
    }

    return null;
  }

  private bind(): void {
    if (!this.$input || !this.$listbox || !this.keyboard) return;

    this.$input.addEventListener("input", this.onInput);
    this.$input.addEventListener("keydown", this.keyboard.handle);
    this.$input.addEventListener("click", this.onInputClick);
    this.$input.addEventListener("focus", this.onFocus);
    this.$input.addEventListener("blur", this.onBlur);

    this.$listbox.addEventListener("mousedown", this.onListboxMousedown);
    this.$listbox.addEventListener("click", this.onListboxClick);

    if (this.$button) {
      this.$button.addEventListener("mousedown", this.onButtonMousedown);
      this.$button.addEventListener("click", this.onButtonClick);
    }

    document.addEventListener("click", this.onDocumentClick);
  }

  private isTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Node)) {
      return false;
    }

    return (
      this.$input === target ||
      !!this.$input?.contains(target) ||
      this.$listbox === target ||
      !!this.$listbox?.contains(target) ||
      this.$button === target ||
      !!this.$button?.contains(target)
    );
  }

  private onDocumentClick = ({ target }: MouseEvent): void => {
    if (this.isTarget(target)) {
      return;
    }

    this.hide({ force: true });
  };

  private onListboxMousedown = (event: MouseEvent): void => {
    // Keep focus on the textbox (aria-activedescendant pattern).
    event.preventDefault();
  };

  private onInput = ({ target }: Event): void => {
    if (!(target instanceof HTMLInputElement) || this.disabled) {
      return;
    }

    const { value } = target;

    this.setValue(value);
    this.blurOption();
    this.schedule(value);
  };

  private onInputClick = (event: MouseEvent): void => {
    if (this.disabled) return;
    event.stopPropagation();
    void this.toggle();
  };

  private onButtonMousedown = (event: MouseEvent): void => {
    event.preventDefault();
  };

  private onButtonClick = (event: MouseEvent): void => {
    if (this.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    void this.toggle().then(() => {
      this.$input?.focus();
    });
  };

  private onListboxClick = ({ target }: MouseEvent): void => {
    if (this.disabled || !(target instanceof Element) || !this.$listbox) {
      return;
    }

    const option = target.closest<HTMLElement>('[role="option"]');

    if (!option || !this.$listbox.contains(option)) {
      return;
    }

    let index = this.options.findIndex(({ element }) => element === option);

    if (0 > index) {
      this.sync(-1);
      index = this.options.findIndex(({ element }) => element === option);

      if (0 > index) {
        return;
      }
    }

    this.index = index;
    this.select();
  };

  private onFocus = ({ target }: FocusEvent): void => {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const { value } = target;

    this.setValue(value);
    this.blurOption();
  };

  private onBlur = ({ relatedTarget }: FocusEvent): void => {
    if (this.isTarget(relatedTarget)) {
      return;
    }
  };

  private async toggle(): Promise<void> {
    if (this.disabled) return;

    if (this._expanded) {
      this.hide({ force: true });
      return;
    }

    const opened = await this.ensureOpen();

    if (opened) {
      this.blurOption();
    }
  }

  /** Build managed option markup from string labels. */
  private build(index: number, labels: string[]): void {
    this.listbox.innerHTML = "";

    const { length } = labels;
    const { id } = this.listbox;

    labels.forEach((label, i) => {
      const props = new Props(i, index, id, length);

      this.listbox.insertAdjacentHTML(
        "beforeend",
        this._render(label, props),
      );
    });

    this.sync(index);
  }

  /**
   * Reflect selection on existing `[role="option"]` nodes.
   * Does not invent markup — options must already have stable `id`s.
   */
  private sync(index: number): void {
    if (!this.$listbox) return;

    const elements = [
      ...this.$listbox.querySelectorAll<HTMLElement>('[role="option"]'),
    ];

    this.options = elements.map((element, i) => {
      element.setAttribute("aria-selected", i === index ? "true" : "false");

      const { id, textContent, dataset } = element;
      const label = (textContent ?? "").trim();

      return {
        id,
        label,
        value: dataset.value ?? label,
        element,
      };
    });
  }

  private active(index: number): void {
    if (-1 < index && this.options[index]) {
      const { id, element } = this.options[index];

      // Never point activedescendant at a missing / empty id (invalid IDREF).
      if (id) {
        this.input.setAttribute("aria-activedescendant", id);
        element.scrollIntoView({ block: "nearest" });
        return;
      }
    }

    this.clearActiveDescendant();
  }

  /** Remove `aria-activedescendant` — empty string is an invalid IDREF. */
  private clearActiveDescendant(): void {
    this.$input?.removeAttribute("aria-activedescendant");
  }

  private emit(name: string, detail?: unknown): void {
    dispatchEvent(this, name, detail, { cancelable: false });
  }

  private setLoading(on: boolean): void {
    this.loading = on;

    if (on) {
      this.$listbox?.setAttribute("aria-busy", "true");
      this.reflectBusyAttribute(true);
      return;
    }

    this.$listbox?.removeAttribute("aria-busy");
    this.reflectBusyAttribute(false);
  }

  private setExpanded(open: boolean): void {
    this._expanded = open;

    if (this.$input) {
      this.$input.setAttribute("aria-expanded", open ? "true" : "false");
    }
    this.$button?.setAttribute("aria-expanded", open ? "true" : "false");
    this.reflectExpandedAttribute();
  }

  private detail(option: Option | null, index: number): SelectDetail {
    const { value = "" } = option ?? {};

    return { option, index, value };
  }

  private schedule(value: string): void {
    if (this.disabled) return;

    this.clearDebounce();

    if (value.trim().length < this.minLength) {
      this.abort();
      this.searchId += 1;
      this.clear();
      this.emit(EVENTS.COMBOBOX_EMPTY, { value } satisfies EmptyDetail);
      this.hide({ force: true });
      return;
    }

    if (0 < this.debounce) {
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null;
        void this.run(value);
      }, this.debounce);
      return;
    }

    void this.run(value);
  }

  private async run(
    value: string,
    { openWhenEmpty = false }: RunOptions = {},
  ): Promise<void> {
    if (!this._search || this.disabled) return;

    this.abort();
    this.abortController = new AbortController();

    const requestId = ++this.searchId;
    const { signal } = this.abortController;

    this.emit(EVENTS.COMBOBOX_LOADING);
    this.setLoading(true);

    let raw: SearchResult;

    try {
      raw = await this._search(value, { signal });
    } catch (error) {
      if (signal.aborted || requestId !== this.searchId) {
        return;
      }

      this.setLoading(false);
      throw error;
    }

    if (requestId !== this.searchId) {
      return;
    }

    this.apply(raw);
    this.emit(EVENTS.COMBOBOX_LOADED);
    this.setLoading(false);

    if (0 === this.options.length) {
      this.emit(EVENTS.COMBOBOX_EMPTY, { value } satisfies EmptyDetail);

      if (this.openOnEmpty) {
        this.show();
        return;
      }

      this.hide({ force: true });
      return;
    }

    if (!openWhenEmpty && 0 === value.length && this.autocomplete === "list") {
      this.index = -1;
      this.refresh(this.index);
      this.hide({ force: true, clear: false });
      return;
    }

    this.index = this.autoselect ? 0 : -1;
    this.refresh(this.index);
    this.show();
  }

  private apply(raw: SearchResult): void {
    if (Array.isArray(raw)) {
      if (0 === raw.length) {
        this.clear({ clearDom: this.mode === "managed" });
        return;
      }

      if (typeof raw[0] === "string") {
        this.build(-1, raw as string[]);
        return;
      }

      this.replace(raw as HTMLElement[]);
      return;
    }

    const { html, options } = raw;

    if (html != null && this.mode === "external") {
      this.listbox.innerHTML = html;
      this.sync(-1);
      return;
    }

    if (options) {
      if (0 === options.length) {
        this.clear({ clearDom: true });
        return;
      }

      if (typeof options[0] === "string") {
        this.build(-1, options as string[]);
        return;
      }

      this.replace(options as HTMLElement[]);
      return;
    }

    if (this.mode === "external") {
      this.sync(-1);
      return;
    }

    this.clear({ clearDom: true });
  }

  private replace(elements: HTMLElement[]): void {
    this.listbox.innerHTML = "";
    elements.forEach((element) => {
      this.listbox.appendChild(element);
    });
    this.sync(-1);
  }

  private clear({ clearDom = true }: { clearDom?: boolean } = {}): void {
    this.options = [];
    this.index = -1;

    if (clearDom && this.$listbox) {
      this.$listbox.innerHTML = "";
    }
  }

  private clearDebounce(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  private abort(): void {
    this.abortController?.abort();
    this.abortController = null;
  }

  private reflectValueAttribute(): void {
    this.reflectingAttribute = true;

    if (this._value) {
      this.setAttribute("value", this._value);
    } else {
      this.removeAttribute("value");
    }

    this.reflectingAttribute = false;
  }

  private reflectExpandedAttribute(): void {
    this.reflectingAttribute = true;

    if (this._expanded) {
      this.setAttribute("expanded", "");
    } else {
      this.removeAttribute("expanded");
    }

    this.reflectingAttribute = false;
  }

  private reflectBusyAttribute(on: boolean): void {
    this.reflectingAttribute = true;

    if (on) {
      this.setAttribute("busy", "");
    } else {
      this.removeAttribute("busy");
    }

    this.reflectingAttribute = false;
  }
}

if (!customElements.get("cinq-combobox")) {
  customElements.define("cinq-combobox", Combobox);
}
