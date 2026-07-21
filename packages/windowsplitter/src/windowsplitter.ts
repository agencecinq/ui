import { EVENTS, clamp, dispatchEvent, parseBoolean, parseNumber } from "@agencecinq/utils";
import Keyboard from "./keyboard.js";
import type {
  FormatSize,
  FormatValue,
  Mode,
  Size,
  Detail,
} from "./types.js";

const defaultFormatSize = ({ value }: Size) => `${value}%`;
const defaultFormatValue = (value: number) => String(value);

const parseMode = (value: string | null | undefined): Mode =>
  value === "clip" || value === "none" || value === "resize" ? value : "resize";


/**
 * Window splitter Web Component (APG-style).
 *
 * The host `<cinq-windowsplitter>` is the **layout wrapper** (bounds + CSS
 * custom properties). A nested separator (`role="separator"` or `slider`) is
 * the focusable control: ARIA value attributes and `aria-controls` live there.
 * Style the host via `[collapsed]` / `[dragging]` / `[disabled]`, or the
 * separator via `[role="separator"]`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 * @see https://github.com/19h47/19h47-windowsplitter
 */
export class WindowSplitter extends HTMLElement {
  static observedAttributes = [
    "data-windowsplitter-mode",
    "data-windowsplitter-step",
    "data-windowsplitter-page",
    "data-windowsplitter-fixed",
  ];

  /** Focusable separator control inside the host. */
  $separator: HTMLElement | null = null;

  mode: Mode = "resize";
  step = 1;
  page = 10;
  fixed = false;
  formatSize: FormatSize = defaultFormatSize;
  formatValue: FormatValue = defaultFormatValue;

  private history: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private keyboard: Keyboard | null = null;
  private bound = false;
  /** Active pointer drag; `null` when idle. `id` is `PointerEvent.pointerId`. */
  private drag: {
    offset: number;
    origin: number;
    length: number;
    id: number;
  } | null = null;

  connectedCallback(): void {
    this.$separator = this.querySelector<HTMLElement>(
      '[role="separator"], [role="slider"]',
    );

    if (!this.$separator) {
      throw new Error(
        'cinq-windowsplitter: nested [role="separator"] or [role="slider"] not found',
      );
    }

    this.read();
    this.$separator.style.touchAction = "none";

    this.keyboard = new Keyboard(this);
    this.$separator.addEventListener("keydown", this.keyboard.handle);
    this.$separator.addEventListener("pointerdown", this.handlePointerdown);
    this.$separator.addEventListener("pointermove", this.handlePointermove);
    this.$separator.addEventListener("pointerup", this.handlePointerup);
    this.$separator.addEventListener("pointercancel", this.handlePointerup);
    this.$separator.addEventListener(
      "lostpointercapture",
      this.handlePointerup,
    );

    this.bound = true;
    this.observe();
    this.sync();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  /** Detaches listeners and observers. Called automatically from `disconnectedCallback`. */
  destroy(): void {
    if (this.bound && this.$separator) {
      if (this.keyboard) {
        this.$separator.removeEventListener("keydown", this.keyboard.handle);
      }
      this.$separator.removeEventListener("pointerdown", this.handlePointerdown);
      this.$separator.removeEventListener("pointermove", this.handlePointermove);
      this.$separator.removeEventListener("pointerup", this.handlePointerup);
      this.$separator.removeEventListener("pointercancel", this.handlePointerup);
      this.$separator.removeEventListener(
        "lostpointercapture",
        this.handlePointerup,
      );
      this.$separator.style.removeProperty("touch-action");
      this.bound = false;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.keyboard = null;
    this.removeAttribute("dragging");
    this.$separator = null;
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    if (!this.bound) return;

    if (name === "data-windowsplitter-mode") {
      this.mode = parseMode(newValue);
      this.sync();
      return;
    }

    if (name === "data-windowsplitter-step") {
      this.step = parseNumber(newValue, 1);
      return;
    }

    if (name === "data-windowsplitter-page") {
      this.page = parseNumber(newValue, 10);
      return;
    }

    if (name === "data-windowsplitter-fixed") {
      this.fixed = parseBoolean(newValue);
    }
  }

  /** Raw `aria-orientation` on `$separator` (HTML source of truth). */
  get orientation(): string | null {
    return this.$separator?.getAttribute("aria-orientation") ?? null;
  }

  /**
   * Primary pane from `$separator.ariaControlsElements`
   * (reflects `aria-controls`; HTML source of truth).
   */
  get $primary(): HTMLElement | null {
    return (
      ((this.$separator?.ariaControlsElements ?? [])[0] as
        | HTMLElement
        | undefined) ?? null
    );
  }

  get min(): number {
    return parseNumber(this.$separator?.getAttribute("aria-valuemin"), 0);
  }

  get max(): number {
    return parseNumber(this.$separator?.getAttribute("aria-valuemax"), 100);
  }

  get value(): number {
    return parseNumber(this.$separator?.getAttribute("aria-valuenow"), this.min);
  }

  set value(next: number) {
    this.setValue(next, false);
  }

  get ratio(): number {
    const { min, max, value } = this;
    const span = max - min;
    return span > 0 ? (value - min) / span : 0;
  }

  get disabled(): boolean {
    return (
      this.hasAttribute("disabled") ||
      this.getAttribute("aria-disabled") === "true" ||
      this.$separator?.getAttribute("aria-disabled") === "true"
    );
  }

  set disabled(on: boolean) {
    if (on) {
      this.setAttribute("disabled", "");
      this.setAttribute("aria-disabled", "true");
      this.$separator?.setAttribute("aria-disabled", "true");
      return;
    }

    this.removeAttribute("disabled");
    this.removeAttribute("aria-disabled");
    this.$separator?.removeAttribute("aria-disabled");
  }

  get collapsed(): boolean {
    return this.value === this.min;
  }

  /** Re-read ARIA and apply layout. */
  sync(): void {
    if (!this.$separator) return;

    this.$separator.setAttribute("aria-valuetext", this.formatValue(this.value));
    this.apply(this.value, false);
  }

  /**
   * Set the splitter value (primary pane size).
   * Writes `aria-valuenow` on the separator, positions it, updates the primary pane.
   */
  setValue(next: number, trigger = true): boolean {
    if (!this.$separator || this.disabled) return false;

    const previous = this.value;
    const value = clamp(Math.round(next), this.min, this.max);
    const changed =
      value !== previous || !this.$separator.hasAttribute("aria-valuenow");

    this.$separator.setAttribute("aria-valuenow", String(value));
    this.$separator.setAttribute("aria-valuetext", this.formatValue(value));
    this.apply(value, trigger && changed);

    return changed;
  }

  /** Collapse the primary pane to `aria-valuemin` (remembers previous value). */
  collapse(trigger = true): boolean {
    if (this.disabled || this.collapsed) {
      return false;
    }

    this.history = this.value;
    return this.setValue(this.min, trigger);
  }

  /** Restore the primary pane to its pre-collapse value (or midpoint). */
  restore(trigger = true): boolean {
    if (this.disabled || !this.collapsed) {
      return false;
    }

    const fallback = Math.round((this.min + this.max) / 2);
    const next = this.history ?? fallback;
    this.history = null;
    return this.setValue(next, trigger);
  }

  toggle(trigger = true): boolean {
    return this.collapsed ? this.restore(trigger) : this.collapse(trigger);
  }

  private read(): void {
    this.mode = parseMode(this.getAttribute("data-windowsplitter-mode"));
    this.step = parseNumber(this.getAttribute("data-windowsplitter-step"), 1);
    this.page = parseNumber(this.getAttribute("data-windowsplitter-page"), 10);
    this.fixed = parseBoolean(this.getAttribute("data-windowsplitter-fixed"));
  }

  private observe(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.apply(this.value, false));
    this.resizeObserver.observe(this);
  }

  private apply(value: number, trigger: boolean): void {
    if (!this.$separator) {
      return;
    }

    const { min, max } = this;
    const span = Math.max(1, max - min);
    let length = 0;

    if (this.drag) {
      length = this.drag.length;
    }

    if (!this.drag) {
      const { width, height } = this.getBoundingClientRect();
      length = this.orientation === "vertical" ? width : height;
    }

    const offset = Math.round(((value - min) / span) * length);
    const ratio = (value - min) / span;

    this.style.setProperty("--windowsplitter-value", String(value));
    this.style.setProperty("--windowsplitter-ratio", String(ratio));
    this.style.setProperty("--windowsplitter-offset", `${offset}px`);

    if (this.orientation === "vertical") {
      this.$separator.style.setProperty(
        "transform",
        `translate3d(${offset}px, 0, 0)`,
      );
    } else {
      this.$separator.style.setProperty(
        "transform",
        `translate3d(0, ${offset}px, 0)`,
      );
    }

    if (this.collapsed) {
      this.setAttribute("collapsed", "");
    } else {
      this.removeAttribute("collapsed");
    }
    this.update(value, ratio, length, offset);
    this.emit(trigger, value, ratio);
  }

  private update(
    value: number,
    ratio: number,
    length: number,
    offset: number,
  ): void {
    if (!this.$primary || this.mode === "none") {
      return;
    }

    if (this.mode === "clip") {
      const remaining = Math.max(0, length - offset);

      if (this.orientation === "vertical") {
        this.$primary.style.clipPath = `inset(0px ${remaining}px 0px 0px)`;
      } else {
        this.$primary.style.clipPath = `inset(0px 0px ${remaining}px 0px)`;
      }

      return;
    }

    const size = this.formatSize({ value, ratio, offset, length });

    if (this.orientation === "vertical") {
      this.$primary.style.width = size;
    } else {
      this.$primary.style.height = size;
    }
  }

  private emit(trigger: boolean, value: number, ratio: number): void {
    if (!trigger) {
      return;
    }

    const detail: Detail = {
      value,
      min: this.min,
      max: this.max,
      ratio,
      collapsed: value === this.min,
    };

    dispatchEvent(this, EVENTS.WINDOWSPLITTER_CHANGE, detail, {
      cancelable: false,
    });
  }

  private valueFromPointer(event: PointerEvent): number {
    const { min, max, drag } = this;

    if (!drag) {
      return this.value;
    }

    const span = max - min;
    const client =
      this.orientation === "vertical" ? event.clientX : event.clientY;
    const ratio =
      drag.length > 0
        ? (client - drag.origin - drag.offset) / drag.length
        : 0;
    return clamp(Math.round(min + span * ratio), min, max);
  }

  private handlePointerdown = (event: PointerEvent): void => {
    if (!this.$separator || this.disabled || event.button !== 0) {
      return;
    }

    this.$separator.focus({ preventScroll: true });
    event.preventDefault();

    if (this.fixed) {
      this.toggle();
      return;
    }

    const { left, top, width, height } = this.getBoundingClientRect();
    const vertical = this.orientation === "vertical";
    const length = vertical ? width : height;
    const origin = vertical ? left : top;
    const client = vertical ? event.clientX : event.clientY;

    this.drag = {
      length,
      origin,
      offset: client - origin - this.ratio * length,
      id: event.pointerId,
    };
    this.setAttribute("dragging", "");
    this.$separator.setPointerCapture(event.pointerId);
  };

  private handlePointermove = (event: PointerEvent): void => {
    if (!this.drag || event.pointerId !== this.drag.id) {
      return;
    }

    this.setValue(this.valueFromPointer(event));
    event.preventDefault();
  };

  private handlePointerup = (event: PointerEvent): void => {
    if (!this.drag) {
      return;
    }

    if (event.pointerId !== this.drag.id) {
      return;
    }

    const { id } = this.drag;

    this.drag = null;
    this.removeAttribute("dragging");

    if (this.$separator?.hasPointerCapture?.(id)) {
      this.$separator.releasePointerCapture(id);
    }
  };
}

if (!customElements.get("cinq-windowsplitter")) {
  customElements.define("cinq-windowsplitter", WindowSplitter);
}
