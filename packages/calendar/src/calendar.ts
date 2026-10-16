import {
  EVENTS,
  dispatchBeforeEvent,
  dispatchEvent,
  parseBoolean,
  parseNumber,
} from "@agencecinq/utils";
import Keyboard from "./keyboard.js";
import type { Detail, Current, Options, Mode, StateClasses } from "./types.js";
import {
  getDaysInMonth,
  getIntlMonth,
  getIntlWeekdays,
  getLeadingDays,
  getWeekStart,
  isBetween,
  toDayString,
} from "./utils.js";

const stateClassesDefault: StateClasses = {
  active: "active",
  range: "range",
  start: "start",
  end: "end",
};

const MODES = ["single", "range", "multiple"] as const;

const parseMode = (el: HTMLElement): Mode => {
  const mode = el.getAttribute("mode");

  if (mode && (MODES as readonly string[]).includes(mode)) {
    return mode as Mode;
  }

  return "single";
};

/** The browser's own message for an empty required field, in the user's language. */
const valueMissingMessage = (): string => {
  const input = document.createElement("input");
  input.required = true;

  return input.validationMessage;
};

const dayButton = (
  day: string,
  date: number,
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
		class="js-day${className ? ` ${className}` : ""}"
		data-day="${day}"
		tabindex="${tabIndex}"
		aria-label="${label}"
		${disabled ? 'aria-disabled="true"' : ""}
		${current ? 'aria-current="date"' : ""}
	>
		${date}
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
  static observedAttributes = ["min", "max", "required"];

  today: Date = new Date();
  day = "";
  options: Options = {
    mode: "single",
    firstDay: 0,
    stateClasses: { ...stateClassesDefault },
    locale: "en",
    buttonClass: "",
    deselect: false,
  };
  current: Current = { month: 0, year: 0, day: null };

  #keyboard: Keyboard | null = null;
  #dispatchChange: () => void = () => { };
  #internals = this.attachInternals();
  #defaultPicked: string[] | null = null;
  #disabled = false;

  $body: HTMLTableSectionElement | null = null;
  $title: HTMLElement | null = null;
  $next: HTMLButtonElement | null = null;
  $previous: HTMLButtonElement | null = null;

  /** Selected days as `YYYY-MM-DD`. */
  picked: string[] = [];

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.#keyboard = null;
    this.$body = null;
    this.$title = null;
    this.$next = null;
    this.$previous = null;
  }

  attributeChangedCallback(): void {
    if (this.$body) {
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

  #readOptions(): Options {
    const locale =
      this.getAttribute("locale") ||
      this.getAttribute("data-locale") ||
      document.documentElement.getAttribute("lang") ||
      "en";

    const firstDay = this.getAttribute("first-day");

    return {
      mode: parseMode(this),
      firstDay:
        firstDay != null && firstDay !== ""
          ? parseNumber(firstDay, getWeekStart(locale))
          : getWeekStart(locale),
      stateClasses: { ...stateClassesDefault },
      locale,
      buttonClass: this.getAttribute("button-class") || "",
      deselect: parseBoolean(this.getAttribute("deselect"), false),
      name: this.getAttribute("name") || undefined,
    };
  }

  /**
   * Bind markup + listeners. Call {@link destroy} first if already bound.
   */
  init(): void {
    const now = new Date();

    this.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.day = toDayString(this.today);

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

    this.$title = this.querySelector(".js-title");
    this.$body = this.querySelector<HTMLTableSectionElement>(".js-body");
    this.$next = this.querySelector(".js-next");
    this.$previous = this.querySelector(".js-previous");

    if (!this.$body) {
      throw new Error("Calendar: .js-body element not found");
    }

    this.#keyboard = new Keyboard(this);

    this.picked = JSON.parse(
      this.getAttribute("data-picked") || "[]",
    ) as string[];
    this.#defaultPicked ??= [...this.picked];

    this.render();
    this.addEventListener("click", this.#handleClick);

    this.#keyboard.attach();

    if (this.options.mode === "range") {
      this.$body.addEventListener("mousemove", this.#handleMousemove, false);
    }

    this.#dispatchChange = () => {
      const detail: Detail = {
        values: this.picked,
        name: this.options.name,
      };

      dispatchEvent(this, EVENTS.CALENDAR_CHANGE, detail, { cancelable: false });
    };
  }

  destroy(): void {
    this.removeEventListener("click", this.#handleClick);

    if (this.#keyboard) {
      this.#keyboard.detach();
      this.$body?.removeEventListener(
        "mousemove",
        this.#handleMousemove,
        false,
      );
    }

    this.reset();
    this.#dispatchChange = () => { };
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

  /** Reflect `picked` on the grid: `aria-selected` on each selected cell, state classes on its day button. */
  #paint(): void {
    const { mode, stateClasses } = this.options;
    const [start, end] = this.picked;
    const isRange = mode === "range";
    const isComplete = isRange && 2 === this.picked.length;

    this.$body?.querySelectorAll<HTMLElement>(".js-day").forEach($day => {
      const day = $day.getAttribute("data-day") as string;
      const isPicked = this.picked.includes(day);
      const inRange = isComplete && isBetween(day, start, end);
      const $cell = $day.closest("td");

      if (isPicked || inRange) {
        $cell?.setAttribute("aria-selected", "true");
      } else {
        $cell?.removeAttribute("aria-selected");
      }

      $day.classList.toggle(stateClasses.active, isPicked);
      $day.classList.toggle(stateClasses.range, inRange);
      $day.classList.toggle(stateClasses.start, isRange && day === start);
      $day.classList.toggle(stateClasses.end, isComplete && day === end);
    });
  }

  /** Mirror the selection into the form: days joined by commas, `valueMissing` while `required` lacks a day or a range end. */
  #syncForm(): void {
    this.#internals.setFormValue(this.picked.join(",") || null);

    const needed = this.options.mode === "range" ? 2 : 1;

    if (!this.hasAttribute("required") || this.picked.length >= needed) {
      this.#internals.setValidity({});
      return;
    }

    this.#internals.setValidity(
      { valueMissing: true },
      valueMissingMessage(),
      this.$body?.querySelector<HTMLElement>('.js-day[tabindex="0"]') ?? undefined,
    );
  }

  /** Selection once `day` is activated, by mode. */
  #nextPicked(day: string): string[] {
    const { mode, deselect } = this.options;
    const isPicked = this.picked.includes(day);

    if (mode === "multiple") {
      return isPicked
        ? this.picked.filter(picked => picked !== day)
        : [...this.picked, day].sort();
    }

    if (mode === "single") {
      return isPicked && deselect ? [] : [day];
    }

    return 1 === this.picked.length ? [this.picked[0], day].sort() : [day];
  }

  #handleClick = (event: MouseEvent) => {
    const { target } = event;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest(".js-next")) {
      return this.move(1, { focus: false });
    }

    if (target.closest(".js-previous")) {
      return this.move(-1, { focus: false });
    }

    const $day = target.closest<HTMLButtonElement>(".js-day");

    if (!$day || $day.getAttribute("aria-disabled") === "true") {
      return;
    }

    const picked = this.#nextPicked($day.getAttribute("data-day") as string);
    this.#keyboard?.setFocusDay($day, { focus: false });

    if (picked.join() === this.picked.join()) {
      return;
    }

    const current = this.picked;
    const commit = (proceed: boolean) => {
      if (proceed && this.picked === current) {
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

  /** Paint in-between days while choosing the range end (mouse or keyboard). */
  previewRange(to: string) {
    if (this.options.mode !== "range" || 1 !== this.picked.length || !this.$body) {
      return;
    }

    const $target = this.$body.querySelector(
      `[data-day="${to}"]`,
    ) as HTMLElement | null;

    if (!$target || $target.getAttribute("aria-disabled") === "true") {
      return;
    }

    const items = this.$body.querySelectorAll(".js-day");
    const $start = this.$body.querySelector(`[data-day="${this.picked[0]}"]`);

    let isReversed = false;
    let from = this.picked[0];
    let end = to;

    if (from > end) {
      isReversed = true;
      end = this.picked[0];
      from = to;
    }

    items.forEach(item => {
      const check = item.getAttribute("data-day") as string;
      item.classList.remove(
        this.options.stateClasses.range,
        this.options.stateClasses.end,
        this.options.stateClasses.start,
      );

      if (isBetween(check, from, end)) {
        item.classList.add(this.options.stateClasses.range);
      }
    });

    $start?.classList.add(this.options.stateClasses.start);
    $target.classList.add(this.options.stateClasses.end);

    if (isReversed) {
      $start?.classList.add(this.options.stateClasses.end);
      $start?.classList.remove(this.options.stateClasses.start);
      $target.classList.add(this.options.stateClasses.start);
      $target.classList.remove(this.options.stateClasses.end);
    }
  }

  #handleMousemove = (event: MouseEvent) => {
    const $target = (event.target as HTMLElement).closest(
      ".js-day",
    ) as HTMLElement | null;

    if (!$target) {
      return;
    }

    const day = $target.getAttribute("data-day");
    if (day) {
      this.previewRange(day);
    }
  };

  getMonthName(month: number): string {
    return (
      this.options.months?.[month] ?? getIntlMonth(this.options.locale, month)
    );
  }

  getWeekdays(): string[] {
    return this.options.days ?? getIntlWeekdays(this.options.locale, "short");
  }

  renderDays() {
    const row = this.querySelector(".js-days") as HTMLTableRowElement | null;
    if (!row) {
      return;
    }

    const labels = this.getWeekdays();
    const abbreviations = getIntlWeekdays(this.options.locale, "long");

    row.innerHTML = "";

    for (let i = 0; i < 7; i += 1) {
      const index = (this.options.firstDay + i) % 7;
      const th = document.createElement("th");

      th.scope = "col";
      th.abbr = abbreviations[index];
      th.textContent = labels[index];
      row.appendChild(th);
    }
  }

  renderHeader(month: number, year: number) {
    if (this.$title) {
      this.$title.textContent = new Date(year, month, 1).toLocaleDateString(
        this.options.locale,
        {
          month: "long",
          year: "numeric",
        },
      );
    }

    this.$previous?.setAttribute(
      "data-content",
      this.getMonthName(0 > month - 1 ? 11 : month - 1),
    );
    this.$next?.setAttribute(
      "data-content",
      this.getMonthName(11 < month + 1 ? 0 : month + 1),
    );
  }

  renderCalendar(month: number, year: number, { focus = false } = {}) {
    if (!this.$body) {
      return;
    }

    const buttonClass = this.options.buttonClass ?? "";
    const min = this.getAttribute("min");
    const max = this.getAttribute("max");
    const longDate = new Intl.DateTimeFormat(this.options.locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
        const inner = document.createElement("div");

        if (
          0 === i &&
          j <
          this.options.firstDay +
          getLeadingDays(month, year, this.options.firstDay)
        ) {
          row.appendChild(cell);
        } else if (dayOfMonth > getDaysInMonth(year, month)) {
          break;
        } else {
          const day = toDayString(date);

          inner.innerHTML = dayButton(day, dayOfMonth, buttonClass, {
            label: longDate.format(date),
            disabled:
              this.#disabled ||
              (!!min && day < min) ||
              (!!max && day > max),
            current: day === this.day,
            tabIndex: -1,
          });

          this.renderInner(inner, date);

          cell.appendChild(inner);
          row.appendChild(cell);

          dayOfMonth += 1;
        }
      }

      if (row.childNodes.length) {
        this.$body.appendChild(row);
      }
    }

    this.#paint();
    this.#keyboard?.sync({ focus });
  }

  reset() {
    if (this.$body) {
      this.$body.innerHTML = "";
    }
  }

  render({ focus = false } = {}) {
    this.reset();
    this.renderDays();
    this.renderHeader(this.current.month, this.current.year);
    this.renderCalendar(this.current.month, this.current.year, { focus });
    this.#syncForm();
  }

  /** Override to enrich or rebuild each day cell. Keep `.js-day` and `data-day`. */
  renderInner(_inner: HTMLElement, _date: Date) { }
}

if (!customElements.get("cinq-calendar")) {
  customElements.define("cinq-calendar", Calendar);
}
