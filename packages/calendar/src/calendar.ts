import {
  EVENTS,
  dispatchBeforeEvent,
  dispatchEvent,
  parseBoolean,
  parseNumber,
} from "@agencecinq/utils";
import Keyboard from "./keyboard.js";
import type {
  Detail,
  Current,
  Options,
  Mode,
  RenderDetail,
} from "./types.js";
import {
  dayFromDate,
  getDateFormat,
  getDaysInMonth,
  getFirstDay,
  getLeadingDays,
  getWeekdayNames,
  isBetween,
} from "./utils.js";

/**
 * The browser's own validation message for a date field in the same state, in
 * the user's language. Empty when such a field would be valid.
 */
const nativeMessage = (
  state: Partial<Pick<HTMLInputElement, "required" | "min" | "max" | "value">>,
): string => {
  const input = document.createElement("input");
  input.type = "date";
  Object.assign(input, state);

  return input.validationMessage;
};

/** Invoker commands a `commandfor` button can send to the calendar, with the months each one moves by. */
const COMMANDS: Record<string, number> = {
  "--previous-month": -1,
  "--next-month": 1,
  "--previous-year": -12,
  "--next-year": 12,
};

/** The `lang` that applies to `element`, through shadow roots like the `:lang()` selector. */
const langOf = (element: Element): string | null => {
  for (
    let node: Element | undefined = element;
    node;
    node = (node.getRootNode() as ShadowRoot).host
  ) {
    const holder = node.closest("[lang]");

    if (holder) {
      return holder.getAttribute("lang");
    }
  }

  return null;
};

const dayButton = (
  day: string,
  numeral: string,
  className: string,
  {
    label,
    disabled,
    current,
    tabIndex,
  }: {
    label: string;
    disabled: boolean;
    current: boolean;
    tabIndex: 0 | -1;
  },
) => `
	<button
		type="button"
		${className ? `class="${className}"` : ""}
		data-day="${day}"
		tabindex="${tabIndex}"
		aria-label="${label}"
		${disabled ? 'aria-disabled="true"' : ""}
		${current ? 'aria-current="date"' : ""}
	>
		${numeral}
	</button>
`;

/**
 * Date / range / multi-date picker Web Component.
 *
 * Markup and CSS are yours — the package fills the grid and handles selection.
 * Follows the WAI-ARIA APG date grid practices.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
 * @see https://github.com/19h47/19h47-calendar
 */
export class Calendar extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ["lang", "first-day", "min", "max", "required"];

  today: Date = new Date();
  day = "";
  options: Options = {
    mode: "single",
    firstDay: 0,
    locale: "en",
    buttonClass: "",
    deselectable: false,
  };
  current: Current = { month: 0, year: 0, day: null };

  #keyboard: Keyboard | null = null;
  #internals = this.attachInternals();
  #defaultPicked: string[] | null = null;
  #disabled = false;

  $body: HTMLTableSectionElement | null = null;
  $title: HTMLElement | null = null;

  /** Selected days as `YYYY-MM-DD`. */
  picked: string[] = [];

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  /** The form the calendar belongs to, as on a native field. */
  get form(): HTMLFormElement | null {
    return this.#internals.form;
  }

  get validity(): ValidityState {
    return this.#internals.validity;
  }

  get validationMessage(): string {
    return this.#internals.validationMessage;
  }

  get willValidate(): boolean {
    return this.#internals.willValidate;
  }

  checkValidity(): boolean {
    return this.#internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.#internals.reportValidity();
  }

  attributeChangedCallback(
    _name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (this.$body && oldValue !== newValue) {
      this.render();
    }
  }

  formDisabledCallback(disabled: boolean): void {
    this.#disabled = disabled;

    if (this.$body) {
      this.render();
    }
  }

  formResetCallback(): void {
    this.setPicked([...(this.#defaultPicked ?? [])], false);
  }

  formStateRestoreCallback(state: string | null): void {
    this.setPicked(state ? state.split(",") : [], false);
  }

  /**
   * Language of the labels: the closest `lang`, the calendar's or an
   * ancestor's, else the browser's. The week starts on its first day unless
   * `first-day` says otherwise.
   */
  #readLanguage(): Pick<Options, "locale" | "firstDay"> {
    const locale = langOf(this) || navigator.language;

    return {
      locale,
      firstDay: parseNumber(this.getAttribute("first-day"), getFirstDay(locale)),
    };
  }

  #readOptions(): Options {
    return {
      mode: (this.getAttribute("mode") || "single") as Mode,
      ...this.#readLanguage(),
      buttonClass: this.getAttribute("button-class") || "",
      deselectable: parseBoolean(this.getAttribute("deselectable"), false),
      name: this.getAttribute("name") || undefined,
    };
  }

  /**
   * Bind markup + listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    const now = new Date();

    this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.day = dayFromDate(this.today);

    this.options = this.#readOptions();

    this.current = {
      month: parseNumber(
        this.getAttribute("data-month"),
        this.today.getMonth(),
      ),
      year: parseNumber(
        this.getAttribute("data-year"),
        this.today.getFullYear(),
      ),
      day: null,
    };

    this.$title = this.querySelector("[aria-live]");
    this.$body = this.querySelector<HTMLTableSectionElement>(
      '[role="grid"] tbody',
    );

    if (!this.$body) {
      throw new Error('Calendar: [role="grid"] tbody not found');
    }

    this.#keyboard = new Keyboard(this);

    this.picked = JSON.parse(
      this.getAttribute("data-picked") || "[]",
    ) as string[];
    this.#defaultPicked ??= [...this.picked];

    this.render();
    this.addEventListener("click", this.#handleClick);
    this.addEventListener("command", this.#handleCommand);
    this.$body.addEventListener("focusin", this.#handleFocusin);

    this.#keyboard.attach();

    if (this.options.mode === "range") {
      this.$body.addEventListener("mousemove", this.#handleMousemove, false);
    }
  }

  /** Unbind and empty the grid. A destroyed calendar no longer renders nor blocks its form. */
  destroy(): void {
    this.removeEventListener("click", this.#handleClick);
    this.removeEventListener("command", this.#handleCommand);
    this.$body?.removeEventListener("focusin", this.#handleFocusin);
    this.$body?.removeEventListener("mousemove", this.#handleMousemove, false);
    this.#keyboard?.detach();

    this.reset();
    this.#internals.setValidity({});
    this.#keyboard = null;
    this.$body = null;
    this.$title = null;
  }

  /** Navigate by `delta` months (negative = previous). */
  move(delta: number, { focus = true } = {}) {
    const { year, month } = this.current;
    const date = new Date(year, month + delta, 1);

    this.current.year = date.getFullYear();
    this.current.month = date.getMonth();

    this.render({ focus });
  }

  /** Assign selection, mirror `data-picked`, paint the grid, optionally emit `calendar:change`. */
  setPicked(picked: string[], emit = true): void {
    this.picked = picked;
    this.setAttribute("data-picked", JSON.stringify(this.picked));
    this.#paint();
    this.#syncForm();

    if (emit) {
      this.#dispatchChange();
    }
  }

  #dispatchChange(): void {
    dispatchEvent<Detail>(
      this,
      EVENTS.CALENDAR_CHANGE,
      { values: this.picked, name: this.options.name },
      { cancelable: false },
    );
  }

  /** Whether `day` cannot be picked: the field is disabled, or the day is outside `min` / `max`. */
  #isUnavailable(day: string): boolean {
    const min = this.getAttribute("min");
    const max = this.getAttribute("max");

    return this.#disabled || (!!min && day < min) || (!!max && day > max);
  }

  /**
   * Reflect `picked` on the grid cells: `aria-selected` on each selected day,
   * and in a range `data-range` inside it (ends included), `data-start` and
   * `data-end` on its ends.
   */
  #paint(): void {
    const [start, end] = this.picked;
    const isRange = this.options.mode === "range";
    const isComplete = isRange && 2 === this.picked.length;

    this.$body?.querySelectorAll<HTMLElement>("[data-day]").forEach($day => {
      const day = $day.getAttribute("data-day") as string;
      const inRange = isComplete && isBetween(day, start, end);
      const $cell = $day.closest("td");

      if (inRange || this.picked.includes(day)) {
        $cell?.setAttribute("aria-selected", "true");
      } else {
        $cell?.removeAttribute("aria-selected");
      }

      $cell?.toggleAttribute("data-range", inRange);
      $cell?.toggleAttribute("data-start", isRange && day === start);
      $cell?.toggleAttribute("data-end", isComplete && day === end);
    });
  }

  /**
   * Mirror the selection into the form: the days joined by commas, with the
   * validity a date field would have with the same `required`, `min` and `max`.
   */
  #syncForm(): void {
    const value = this.picked.join(",");
    const min = this.getAttribute("min") ?? "";
    const max = this.getAttribute("max") ?? "";
    const needed = this.options.mode === "range" ? 2 : 1;
    const anchor =
      this.$body?.querySelector<HTMLElement>('[data-day][tabindex="0"]') ??
      undefined;

    // The state restores an emptied selection too, where a null value would not.
    this.#internals.setFormValue(value || null, value);

    if (this.hasAttribute("required") && this.picked.length < needed) {
      return this.#internals.setValidity(
        { valueMissing: true },
        nativeMessage({ required: true }),
        anchor,
      );
    }

    // A range with only its start is unfinished, like a half-typed date.
    if (2 === needed && 1 === this.picked.length) {
      return this.#internals.setValidity(
        { badInput: true },
        nativeMessage({ required: true }),
        anchor,
      );
    }

    const early = this.picked.find(day => min && day < min);
    const late = this.picked.find(day => max && day > max);
    const underflow = early ? nativeMessage({ min, value: early }) : "";
    const overflow = late ? nativeMessage({ max, value: late }) : "";

    if (underflow) {
      return this.#internals.setValidity({ rangeUnderflow: true }, underflow, anchor);
    }

    if (overflow) {
      return this.#internals.setValidity({ rangeOverflow: true }, overflow, anchor);
    }

    this.#internals.setValidity({});
  }

  /** Selection once `day` is activated, by mode. Any other mode picks a single day. */
  #nextPicked(day: string): string[] {
    const { mode, deselectable } = this.options;
    const isPicked = this.picked.includes(day);

    if (mode === "multiple") {
      return isPicked
        ? this.picked.filter(picked => picked !== day)
        : [...this.picked, day].sort();
    }

    if (mode === "range") {
      return 1 === this.picked.length ? [this.picked[0], day].sort() : [day];
    }

    return isPicked && deselectable ? [] : [day];
  }

  #handleClick = (event: MouseEvent) => {
    const { target } = event;

    if (!(target instanceof Element)) {
      return;
    }

    const $day = target.closest<HTMLButtonElement>("[data-day]");
    const day = $day?.getAttribute("data-day");

    if (
      !$day ||
      !day ||
      !this.$body?.contains($day) ||
      $day.getAttribute("aria-disabled") === "true" ||
      this.#isUnavailable(day)
    ) {
      return;
    }

    const picked = this.#nextPicked(day);
    this.#keyboard?.setFocusDay($day, { focus: false });

    if (picked.join() === this.picked.join()) {
      return;
    }

    const current = this.picked.join();
    const commit = (proceed: boolean) => {
      if (proceed && this.picked.join() === current) {
        this.setPicked(picked);
      }
    };
    const result = dispatchBeforeEvent<Detail>(
      this,
      EVENTS.CALENDAR_BEFORE_CHANGE,
      { values: [...picked], name: this.options.name },
    );

    if (typeof result === "boolean") {
      return commit(result);
    }

    result.then(commit);
  };

  #handleCommand = (event: Event) => {
    const months = COMMANDS[(event as CommandEvent).command];

    if (months) {
      this.move(months, { focus: false });
    }
  };

  /** Paint the range to come while choosing its end (mouse or keyboard), with the attributes of a picked range. */
  previewRange(to: string) {
    if (this.options.mode !== "range" || 1 !== this.picked.length || !this.$body) {
      return;
    }

    const $target = this.$body.querySelector(
      `[data-day="${to}"]`,
    ) as HTMLElement | null;

    if (
      !$target ||
      $target.getAttribute("aria-disabled") === "true" ||
      this.#isUnavailable(to)
    ) {
      return;
    }

    const [start, end] = [this.picked[0], to].sort();

    this.$body.querySelectorAll("[data-day]").forEach($day => {
      const day = $day.getAttribute("data-day") as string;
      const $cell = $day.closest("td");

      $cell?.toggleAttribute("data-range", isBetween(day, start, end));
      $cell?.toggleAttribute("data-start", day === start);
      $cell?.toggleAttribute("data-end", day === end);
    });
  }

  /**
   * Follow the focus, however it moved: the day it lands on becomes the tab
   * stop and the current day, and carries the validation message.
   */
  #handleFocusin = (event: FocusEvent) => {
    const $day = (event.target as Element).closest<HTMLButtonElement>("[data-day]");

    if ($day && this.$body?.contains($day)) {
      this.#keyboard?.setFocusDay($day, { focus: false });
    }

    this.#syncForm();
  };

  #handleMousemove = (event: MouseEvent) => {
    const $target = (event.target as Element).closest("[data-day]");
    const day = $target?.getAttribute("data-day");

    if ($target && day && this.$body?.contains($target)) {
      this.previewRange(day);
    }
  };

  getWeekdayNames(): string[] {
    return this.options.days ?? getWeekdayNames(this.options.locale);
  }

  renderDays() {
    const row = this.querySelector<HTMLTableRowElement>(
      '[role="grid"] thead tr',
    );
    if (!row) {
      return;
    }

    const labels = this.getWeekdayNames();
    const longNames = getWeekdayNames(this.options.locale, "long");

    row.innerHTML = "";

    for (let i = 0; i < 7; i += 1) {
      const index = (this.options.firstDay + i) % 7;
      const th = document.createElement("th");

      th.scope = "col";
      th.abbr = longNames[index];
      th.textContent = labels[index];
      row.appendChild(th);
    }
  }

  renderHeader(year: number, month: number) {
    const title = getDateFormat(this.options.locale, {
      month: "long",
      year: "numeric",
    }).format(new Date(year, month, 1));

    // Rewriting the same month would announce it again.
    if (this.$title && this.$title.textContent !== title) {
      this.$title.textContent = title;
    }
  }

  renderCalendar(year: number, month: number) {
    if (!this.$body) {
      return;
    }

    const buttonClass = this.options.buttonClass ?? "";
    const longDate = getDateFormat(this.options.locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const numerals = new Intl.NumberFormat(this.options.locale);
    let dayOfMonth = 1;

    for (let i = 0; 6 >= i; i += 1) {
      const row = document.createElement("tr");

      for (
        let j = this.options.firstDay;
        j < 7 + this.options.firstDay;
        j += 1
      ) {
        const date = new Date(year, month, dayOfMonth);
        const cell = document.createElement("td");

        if (
          0 === i &&
          j <
          this.options.firstDay +
          getLeadingDays(year, month, this.options.firstDay)
        ) {
          row.appendChild(cell);
        } else if (dayOfMonth > getDaysInMonth(year, month)) {
          break;
        } else {
          const day = dayFromDate(date);

          cell.innerHTML = dayButton(day, numerals.format(dayOfMonth), buttonClass, {
            label: longDate.format(date),
            disabled: this.#isUnavailable(day),
            current: day === this.day,
            tabIndex: -1,
          });

          row.appendChild(cell);

          dayOfMonth += 1;
        }
      }

      if (row.childNodes.length) {
        this.$body.appendChild(row);
      }
    }

    this.#paint();
  }

  reset() {
    if (this.$body) {
      this.$body.innerHTML = "";
    }
  }

  /**
   * Rebuild the grid. Focus comes back to the grid when it was there, and the
   * range preview runs once `calendar:render` listeners have decorated the days.
   */
  render({ focus = false } = {}) {
    const { activeElement } = this.getRootNode() as Document | ShadowRoot;
    const hadFocus = !!this.$body?.contains(activeElement);

    Object.assign(this.options, this.#readLanguage());

    this.reset();
    this.renderDays();
    this.renderHeader(this.current.year, this.current.month);
    this.renderCalendar(this.current.year, this.current.month);

    dispatchEvent<RenderDetail>(
      this,
      EVENTS.CALENDAR_RENDER,
      { year: this.current.year, month: this.current.month },
      { cancelable: false },
    );

    this.#keyboard?.sync({ focus: focus || hadFocus });
    this.#syncForm();
  }
}

if (!customElements.get("cinq-calendar")) {
  customElements.define("cinq-calendar", Calendar);
}
