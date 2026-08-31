import {
  EVENTS,
  clamp,
  dispatchEvent,
  parseNumber,
  throttle,
} from "@agencecinq/utils";
import type { FormatValue, Options, Value } from "./types.js";

const DEFAULTS: Options = {
  step: 1,
  delay: 100,
};

/**
 * Spinbutton Web Component implementing the WAI-ARIA spinbutton pattern.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */
export class Spinbutton extends HTMLElement {
  $input: HTMLInputElement | null = null;
  $increase: HTMLButtonElement | null = null;
  $decrease: HTMLButtonElement | null = null;
  $live: HTMLElement | null = null;

  options: Options = { ...DEFAULTS };
  value: Value = { min: false, max: false, now: 0 };

  #formatValue?: FormatValue;
  #dispatchChange: () => void = () => { };

  get formatValue(): FormatValue | undefined {
    return this.#formatValue;
  }

  set formatValue(fn: FormatValue | undefined) {
    this.#formatValue = fn;

    if (!this.$input || !fn) {
      return;
    }

    const valuetext = fn(this.value.now);
    this.$input.setAttribute("aria-valuetext", valuetext);

    if (this.$live) {
      this.$live.textContent = valuetext;
    }
  }

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$input = null;
    this.$increase = null;
    this.$decrease = null;
    this.$live = null;
  }

  init(): void {
    this.$input = this.querySelector<HTMLInputElement>("input");

    if (!this.$input) {
      throw new Error("Spinbutton must have an input element");
    }

    this.$increase = this.querySelector<HTMLButtonElement>(
      'button[name="increase"]',
    );
    this.$decrease = this.querySelector<HTMLButtonElement>(
      'button[name="decrease"]',
    );
    this.$live = this.querySelector<HTMLElement>("[aria-live]");

    this.options.step = parseNumber(
      this.getAttribute("data-step"),
      DEFAULTS.step,
    );
    this.options.delay = parseNumber(
      this.getAttribute("data-delay"),
      DEFAULTS.delay,
    );

    const min = this.$input.getAttribute("aria-valuemin");
    const max = this.$input.getAttribute("aria-valuemax");
    const now = parseNumber(this.$input.getAttribute("aria-valuenow"), 0);

    this.value = {
      min: min === null ? false : parseNumber(min, 0),
      max: max === null ? false : parseNumber(max, 0),
      now,
    };

    this.$input.addEventListener("keydown", this.#handleKeydown);
    this.$input.addEventListener("change", this.#handleChange);
    this.$increase?.addEventListener("click", this.increase);
    this.$decrease?.addEventListener("click", this.decrease);

    this.#dispatchChange = throttle(() => {
      dispatchEvent(this, EVENTS.SPINBUTTON_CHANGE, { value: this.value.now });
    }, this.options.delay);
  }

  #handleChange = ({ target }: Event): void => {
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const { value } = target;
    this.setValue(parseNumber(value, this.value.now));
  };

  #handleKeydown = (event: KeyboardEvent): void => {
    const { step } = this.options;

    const handlers: Record<string, () => void> = {
      ArrowUp: () => this.setValue(this.value.now + step),
      ArrowDown: () => this.setValue(this.value.now - step),
      PageUp: () => this.setValue(this.value.now + step * 5),
      PageDown: () => this.setValue(this.value.now - step * 5),
      Home: () => this.value.min !== false && this.setValue(this.value.min),
      End: () => this.value.max !== false && this.setValue(this.value.max),
    };

    const handler = handlers[event.key];

    if (handler) {
      event.preventDefault();
      handler();
    }
  };

  decrease = (): void => {
    this.setValue(this.value.now - this.options.step);
  };

  increase = (): void => {
    this.setValue(this.value.now + this.options.step);
  };

  setMin(value: number, emit: boolean = true): void {
    this.value.min = value;
    this.$input?.setAttribute("aria-valuemin", value.toString());
    this.setValue(this.value.now, emit);
  }

  setMax(value: number, emit: boolean = true): void {
    this.value.max = value;
    this.$input?.setAttribute("aria-valuemax", value.toString());
    this.setValue(this.value.now, emit);
  }

  setValue(value: number, emit: boolean = true): void {
    if (!this.$input) {
      return;
    }

    const min = this.value.min !== false ? this.value.min : Number.MIN_SAFE_INTEGER;
    const max = this.value.max !== false ? this.value.max : Number.MAX_SAFE_INTEGER;

    if (value < min || value > max) {
      this.$input.setAttribute("aria-invalid", "true");
    } else {
      this.$input.removeAttribute("aria-invalid");
    }

    this.value.now = clamp(value, min, max);

    this.$increase?.toggleAttribute(
      "disabled",
      this.value.max !== false && this.value.now === this.value.max,
    );
    this.$decrease?.toggleAttribute(
      "disabled",
      this.value.min !== false && this.value.min === this.value.now,
    );

    this.$input.setAttribute("aria-valuenow", this.value.now.toString());
    this.$input.value = this.value.now.toString();
    this.$input.setAttribute("value", this.value.now.toString());

    if (this.#formatValue) {
      const valuetext = this.#formatValue(this.value.now);
      this.$input.setAttribute("aria-valuetext", valuetext);

      if (this.$live) {
        this.$live.textContent = valuetext;
      }
    }

    if (emit) {
      this.#dispatchChange();
    }
  }

  destroy(): void {
    this.$input?.removeEventListener("keydown", this.#handleKeydown);
    this.$input?.removeEventListener("change", this.#handleChange);
    this.$increase?.removeEventListener("click", this.increase);
    this.$decrease?.removeEventListener("click", this.decrease);
    this.#dispatchChange = () => { };
  }
}

if (!customElements.get("cinq-spinbutton")) {
  customElements.define("cinq-spinbutton", Spinbutton);
}
