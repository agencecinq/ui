import { EVENTS, clamp, throttle } from "@agencecinq/utils";
import type { Options, SpinbuttonChangeDetail, Text, Value } from "./types";

const DEFAULTS: Options = {
  step: 1,
  delay: 20,
};

const VISUALLY_HIDDEN_STYLES: Partial<CSSStyleDeclaration> = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: "0",
};

const formatText = (now: number, text?: Text): string => {
  if (!text) return now.toString();
  return `${now} ${now <= 1 ? text.single : text.plural}`;
};

const toggleDisabled = (
  target: HTMLButtonElement | null,
  now: number,
  bound: number | false,
): void => {
  if (!target || bound === false) return;

  if (now === bound) {
    target.setAttribute("disabled", "true");
  } else {
    target.removeAttribute("disabled");
  }
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

export class Spinbutton extends HTMLElement {
  $input: HTMLInputElement | null = null;
  $increase: HTMLButtonElement | null = null;
  $decrease: HTMLButtonElement | null = null;
  $liveRegion: HTMLElement | null = null;

  options: Options = { ...DEFAULTS };
  value: Value = { min: false, max: false, now: 0, text: "0" };
  text: Text | undefined;

  private throttledEmit: (() => void) | null = null;

  connectedCallback(): void {
    this.$input =
      this.querySelector<HTMLInputElement>("[data-spinbutton-input]") ||
      this.querySelector<HTMLInputElement>("input");
    if (!this.$input) return;

    this.$increase = this.querySelector<HTMLButtonElement>(
      '[data-spinbutton-action="increase"]',
    );
    this.$decrease = this.querySelector<HTMLButtonElement>(
      '[data-spinbutton-action="decrease"]',
    );

    this.$liveRegion = document.createElement("div");
    this.$liveRegion.setAttribute("aria-live", "polite");
    this.$liveRegion.setAttribute("aria-atomic", "true");
    Object.assign(this.$liveRegion.style, VISUALLY_HIDDEN_STYLES);
    this.appendChild(this.$liveRegion);

    this.text = this.parseText();
    this.options.step = parseIntAttr(this, "data-spinbutton-step", DEFAULTS.step);
    this.options.delay = parseIntAttr(this, "data-spinbutton-delay", DEFAULTS.delay);

    const min = this.$input.getAttribute("aria-valuemin");
    const max = this.$input.getAttribute("aria-valuemax");
    const now = parseIntAttr(this.$input, "aria-valuenow", 0);

    this.value = {
      min: min === null ? false : parseInt(min, 10),
      max: max === null ? false : parseInt(max, 10),
      now,
      text: formatText(now, this.text),
    };

    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  private parseText(): Text | undefined {
    const raw = this.getAttribute("data-spinbutton-text");
    if (!raw) return undefined;
    try {
      const parsed = JSON.parse(raw) as Partial<Text>;
      if (typeof parsed.single === "string" && typeof parsed.plural === "string") {
        return { single: parsed.single, plural: parsed.plural };
      }
    } catch {
      // Silently ignore malformed JSON; fall back to raw number rendering.
    }
    return undefined;
  }

  init(): void {
    this.setValue(this.value.now, false);
    this.initEvents();
  }

  private initEvents(): void {
    this.$input?.addEventListener("keydown", this.handleKeydown);
    this.$input?.addEventListener("change", this.handleInputChange);
    this.$increase?.addEventListener("click", this.increase);
    this.$decrease?.addEventListener("click", this.decrease);
  }

  private handleInputChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const parsed = parseInt(target.value, 10);
    this.setValue(Number.isNaN(parsed) ? this.value.now : parsed);
  };

  private handleKeydown = (event: KeyboardEvent): void => {
    const key = event.key || event.code;
    const { step } = this.options;

    const handlers: Record<string, () => void> = {
      ArrowUp: () => this.setValue(this.value.now + step),
      ArrowDown: () => this.setValue(this.value.now - step),
      PageUp: () => this.setValue(this.value.now + step * 5),
      PageDown: () => this.setValue(this.value.now - step * 5),
      Home: () => {
        if (this.value.min !== false) this.setValue(this.value.min);
      },
      End: () => {
        if (this.value.max !== false) this.setValue(this.value.max);
      },
    };

    const handler = handlers[key];

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
    if (!this.$input) return;

    const candidate = Number.isNaN(value) ? this.value.now : value;
    const min = this.value.min !== false ? this.value.min : Number.MIN_SAFE_INTEGER;
    const max = this.value.max !== false ? this.value.max : Number.MAX_SAFE_INTEGER;

    if (candidate < min || candidate > max) {
      this.$input.setAttribute("aria-invalid", "true");
    } else {
      this.$input.removeAttribute("aria-invalid");
    }

    this.value.now = clamp(candidate, min, max);
    this.value.text = formatText(this.value.now, this.text);

    toggleDisabled(this.$increase, this.value.now, this.value.max);
    toggleDisabled(this.$decrease, this.value.now, this.value.min);

    this.$input.setAttribute("aria-valuenow", this.value.now.toString());
    this.$input.setAttribute("aria-valuetext", this.value.text);
    this.$input.value = this.value.now.toString();
    this.$input.setAttribute("value", this.value.now.toString());

    if (this.$liveRegion) {
      this.$liveRegion.textContent = this.value.text;
    }

    if (emit) this.emitChange();
  }

  private emitChange(): void {
    const emit =
      this.throttledEmit ??
      (this.throttledEmit = throttle(() => {
        const detail: SpinbuttonChangeDetail = { value: this.value.now };
        this.dispatchEvent(
          new CustomEvent<SpinbuttonChangeDetail>(EVENTS.SPINBUTTON_CHANGE, {
            bubbles: true,
            cancelable: true,
            detail,
          }),
        );
      }, this.options.delay));
    emit();
  }

  destroy(): void {
    this.$input?.removeEventListener("keydown", this.handleKeydown);
    this.$input?.removeEventListener("change", this.handleInputChange);
    this.$increase?.removeEventListener("click", this.increase);
    this.$decrease?.removeEventListener("click", this.decrease);

    if (this.$liveRegion && this.contains(this.$liveRegion)) {
      this.removeChild(this.$liveRegion);
    }
    this.$liveRegion = null;
    this.throttledEmit = null;
  }
}

if (!customElements.get("cinq-spinbutton")) {
  customElements.define("cinq-spinbutton", Spinbutton);
}
