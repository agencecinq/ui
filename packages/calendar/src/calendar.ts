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

/** The browser's own message for an empty required field, in the user's language. */
const valueMissingMessage = (): string => {
  const input = document.createElement("input");
  input.required = true;

  return input.validationMessage;
};

/** Invoker commands a `commandfor` button can send to the calendar, with the months each one moves by. */
const COMMANDS: Record<string, number> = {
  "--previous-month": -1,
  "--next-month": 1,
  "--previous-year": -12,
  "--next-year": 12,
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
  #dispatchChange: () => void = () => { };
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
    this.#keyboard = null;
    this.$body = null;
    this.$title = null;
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

  /**
   * Language of the labels: the closest `lang`, the calendar's or an
   * ancestor's, else the browser's. The week starts on its first day unless
   * `first-day` says otherwise.
   */
  #readLanguage(): Pick<Options, "locale" | "firstDay"> {
    const locale =
      this.closest("[lang]")?.getAttribute("lang") || navigator.language;

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
    this.removeEventListener("command", this.#handleCommand);

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
      this.$body?.querySelector<HTMLElement>('[data-day][tabindex="0"]') ?? undefined,
    );
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

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const $day = target.closest<HTMLButtonElement>("[data-day]");

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

    if (!$target || $target.getAttribute("aria-disabled") === "true") {
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

  #handleMousemove = (event: MouseEvent) => {
    const $target = (event.target as HTMLElement).closest(
      "[data-day]",
    ) as HTMLElement | null;

    if (!$target) {
      return;
    }

    const day = $target.getAttribute("data-day");
    if (day) {
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
    if (this.$title) {
      this.$title.textContent = getDateFormat(this.options.locale, {
        month: "long",
        year: "numeric",
      }).format(new Date(year, month, 1));
    }
  }

  renderCalendar(year: number, month: number, { focus = false } = {}) {
    if (!this.$body) {
      return;
    }

    const buttonClass = this.options.buttonClass ?? "";
    const min = this.getAttribute("min");
    const max = this.getAttribute("max");
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
        const inner = document.createElement("div");

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

          inner.innerHTML = dayButton(day, numerals.format(dayOfMonth), buttonClass, {
            label: longDate.format(date),
            disabled:
              this.#disabled ||
              (!!min && day < min) ||
              (!!max && day > max),
            current: day === this.day,
            tabIndex: -1,
          });

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
    Object.assign(this.options, this.#readLanguage());

    this.reset();
    this.renderDays();
    this.renderHeader(this.current.year, this.current.month);
    this.renderCalendar(this.current.year, this.current.month, { focus });
    this.#syncForm();

    dispatchEvent<RenderDetail>(
      this,
      EVENTS.CALENDAR_RENDER,
      { year: this.current.year, month: this.current.month },
      { cancelable: false },
    );
  }
}

if (!customElements.get("cinq-calendar")) {
  customElements.define("cinq-calendar", Calendar);
}
