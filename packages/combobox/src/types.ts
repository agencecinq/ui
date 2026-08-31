/** Plain props passed to `render` when building managed options. */
export type OptionRenderProps = {
  id: string;
  index: number;
  size: number;
  selected: boolean;
};

export type Write = (input: HTMLInputElement, value: string) => void;
export type Render = (label: string, props: OptionRenderProps) => string;

/**
 * What happens when an option is accepted (Enter, click, Tab with visual focus).
 * - `value` — write the option label/value into the textbox (classic autocomplete).
 * - `custom` — do not mutate the textbox; use `onSelect` / `combobox:submit` instead.
 */
export type SelectMode = "value" | "custom";

export type SearchContext = {
  /** Aborted when a newer search starts or `destroy()` is called. */
  signal: AbortSignal;
};

/** Normalized option used for keyboard / ARIA, regardless of render mode. */
export type Option = {
  id: string;
  /** Accessible / display label (usually textContent). */
  label: string;
  /** Value passed to `write` in `selectMode: 'value'`. */
  value: string;
  element: HTMLElement;
};

/**
 * Return type of `search`.
 * - `string[]` — managed labels (rendered via `render`)
 * - `{ html }` — external markup (options must include stable `id`s)
 * - `HTMLElement[]` — external option nodes
 */
export type SearchResult =
  | string[]
  | HTMLElement[]
  | {
    html?: string;
    options?: string[] | HTMLElement[];
  };

export type SearchFn = (
  value: string,
  context: SearchContext,
) => SearchResult | Promise<SearchResult>;

/** How the listbox DOM is produced. */
export type Mode = "managed" | "external";

export type Detail = {
  value: string;
};

export type SelectDetail = Detail & {
  option: Option | null;
  index: number;
};

export type OnSelect = (detail: SelectDetail) => void;

export type HideOptions = {
  force?: boolean;
  clear?: boolean;
};

/** Internal options for a search/run cycle. */
export type RunOptions = {
  openWhenEmpty?: boolean;
};

export interface Options {
  search: SearchFn;
  /**
   * `managed` — library rebuilds options from `search` strings via `render`.
   * `external` — consumer owns markup; library only syncs `[role="option"]` + ARIA state.
   * @default 'managed'
   */
  mode?: Mode;
  /** @default 'value' */
  selectMode?: SelectMode;
  /** Called when an option is accepted, before the listbox closes. */
  onSelect?: OnSelect;
  /**
   * Debounce (ms) for input-driven searches only.
   * @default 0
   */
  debounce?: number;
  /**
   * Minimum trimmed length before an input-driven search runs.
   * @default 0
   */
  minLength?: number;
  /**
   * Keep the popup open (`aria-expanded="true"`, listbox visible) when search
   * returns no options — pair with a live region on `combobox:empty`.
   * @default false
   */
  openOnEmpty?: boolean;
  autoselect?: boolean;
  write?: Write;
  render?: Render;
  /** Optional open button (APG). */
  button?: HTMLButtonElement | null;
}
