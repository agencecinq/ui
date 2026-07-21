import { EVENTS, clamp, dispatchEvent } from "@agencecinq/utils";
import type {
  FormatSize,
  FormatValue,
  Mode,
  Orientation,
  SizeContext,
  WindowSplitterDetail,
} from "./types.js";

const defaultFormatSize = ({ value }: SizeContext) => `${value}%`;
const defaultFormatValue = (value: number) => String(value);

const toNumber = (value: string | null, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

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
  if (raw === null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
};

const resolveOrientation = (el: HTMLElement): Orientation => {
  const attr = el.getAttribute("aria-orientation");
  if (attr === "horizontal" || attr === "vertical") return attr;
  return "vertical";
};

/**
 * Window splitter Web Component (APG-style).
 *
 * The host `<cinq-windowsplitter>` is the focusable separator. HTML is the
 * source of truth for roles and ARIA (`aria-orientation`, `aria-valuemin` /
 * `max` / `now`, `aria-controls`, labelling). Style via ARIA / host attrs
 * (`[collapsed]`, `[dragging]`, `[disabled]`, `:focus-visible`) — no invented
 * CSS classes.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 * @see https://github.com/19h47/19h47-windowsplitter
 */
export class WindowSplitter extends HTMLElement {
  static observedAttributes = [
    "disabled",
    "data-windowsplitter-mode",
    "data-windowsplitter-step",
    "data-windowsplitter-page",
    "data-windowsplitter-fixed",
  ];

  $container: HTMLElement | null = null;
  $primary: HTMLElement | null = null;

  mode: Mode = "resize";
  step = 1;
  page = 10;
  fixed = false;
  formatSize: FormatSize = defaultFormatSize;
  formatValue: FormatValue = defaultFormatValue;

  private previousValue: number | null = null;
  private isMoving = false;
  private pointerId: number | null = null;
  private grabOffset = 0;
  private previousTouchAction = "";
  private resizeObserver: ResizeObserver | null = null;
  private bound = false;
  private reflectingAttribute = false;
  private containerOverride: HTMLElement | null = null;

  connectedCallback(): void {
    this.mount();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  attributeChangedCallback(): void {
    if (this.reflectingAttribute || !this.bound) return;
    this.syncOptionsFromAttributes();
    this.sync();
  }

  get orientation(): Orientation {
    return resolveOrientation(this);
  }

  get vertical(): boolean {
    return this.orientation === "vertical";
  }

  get min(): number {
    return toNumber(this.getAttribute("aria-valuemin"), 0);
  }

  get max(): number {
    return toNumber(this.getAttribute("aria-valuemax"), 100);
  }

  get value(): number {
    return toNumber(this.getAttribute("aria-valuenow"), this.min);
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
      this.getAttribute("aria-disabled") === "true"
    );
  }

  set disabled(on: boolean) {
    this.reflectingAttribute = true;
    if (on) {
      this.setAttribute("disabled", "");
      this.setAttribute("aria-disabled", "true");
    } else {
      this.removeAttribute("disabled");
      this.removeAttribute("aria-disabled");
    }
    this.reflectingAttribute = false;
    this.sync();
  }

  get collapsed(): boolean {
    return this.value === this.min;
  }

  /** Optional bounds container; defaults to `parentElement`. */
  set container(el: HTMLElement | null) {
    this.containerOverride = el;
    if (this.bound) {
      this.resolveContainer();
      this.observeContainer();
      this.sync();
    }
  }

  get container(): HTMLElement | null {
    return this.$container;
  }

  /** Re-read ARIA / primary pane and apply layout. */
  sync(): void {
    if (!this.$container) return;

    this.resolvePrimary();
    this.setAttribute("aria-valuetext", this.formatValue(this.value));
    this.reflectCollapsedAttribute();
    this.reflectDisabledAttribute();
    this.apply(this.value, false);
  }

  /**
   * Set the splitter value (primary pane size).
   * Writes `aria-valuenow`, positions the separator, updates the primary pane.
   */
  setValue(next: number, trigger = true): boolean {
    if (this.disabled) return false;

    const previous = this.value;
    const value = clamp(Math.round(next), this.min, this.max);
    const changed = value !== previous || !this.hasAttribute("aria-valuenow");

    if (changed && !this.collapsed && value === this.min) {
      this.previousValue = previous;
    }

    this.setAttribute("aria-valuenow", String(value));
    this.setAttribute("aria-valuetext", this.formatValue(value));
    this.apply(value, trigger && changed);

    return changed;
  }

  /** Collapse the primary pane to `aria-valuemin` (remembers previous value). */
  collapse(trigger = true): boolean {
    if (this.disabled || this.collapsed) return false;
    this.previousValue = this.value;
    return this.setValue(this.min, trigger);
  }

  /** Restore the primary pane to its pre-collapse value (or midpoint). */
  restore(trigger = true): boolean {
    if (this.disabled || !this.collapsed) return false;

    const fallback = Math.round((this.min + this.max) / 2);
    const next = this.previousValue ?? fallback;
    this.previousValue = null;
    return this.setValue(next, trigger);
  }

  toggle(trigger = true): boolean {
    return this.collapsed ? this.restore(trigger) : this.collapse(trigger);
  }

  destroy(): void {
    if (this.bound) {
      this.removeEventListener("keydown", this.handleKeydown);
      this.removeEventListener("pointerdown", this.handlePointerdown);
      this.removeEventListener("pointermove", this.handlePointermove);
      this.removeEventListener("pointerup", this.handlePointerup);
      this.removeEventListener("pointercancel", this.handlePointerup);
      this.removeEventListener("lostpointercapture", this.handlePointerup);
      this.style.touchAction = this.previousTouchAction;
      this.removeAttribute("dragging");
      this.bound = false;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.$primary = null;
    this.$container = null;
  }

  private mount(): void {
    if (this.bound) return;

    this.syncOptionsFromAttributes();
    this.resolveContainer();

    if (!this.$container) {
      console.warn("cinq-windowsplitter: container not found (no parentElement)");
      return;
    }

    this.previousTouchAction = this.style.touchAction;
    this.style.touchAction = "none";

    this.addEventListener("keydown", this.handleKeydown);
    this.addEventListener("pointerdown", this.handlePointerdown);
    this.addEventListener("pointermove", this.handlePointermove);
    this.addEventListener("pointerup", this.handlePointerup);
    this.addEventListener("pointercancel", this.handlePointerup);
    this.addEventListener("lostpointercapture", this.handlePointerup);

    this.bound = true;
    this.observeContainer();
    this.sync();
  }

  private syncOptionsFromAttributes(): void {
    const mode = this.getAttribute("data-windowsplitter-mode") as Mode | null;
    this.mode =
      mode === "clip" || mode === "none" || mode === "resize" ? mode : "resize";
    this.step = parseIntAttr(this, "data-windowsplitter-step", 1);
    this.page = parseIntAttr(this, "data-windowsplitter-page", 10);
    this.fixed = parseBooleanAttr(this, "data-windowsplitter-fixed");
  }

  private resolveContainer(): void {
    this.$container =
      this.containerOverride ??
      (this.parentElement as HTMLElement | null);
  }

  private resolvePrimary(): void {
    // IDL: `ariaControlsElements` reflects `aria-controls` ID references.
    this.$primary =
      ((this.ariaControlsElements ?? [])[0] as HTMLElement | undefined) ?? null;
  }

  private observeContainer(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (!this.$container || typeof ResizeObserver === "undefined") return;

    this.resizeObserver = new ResizeObserver(() => this.apply(this.value, false));
    this.resizeObserver.observe(this.$container);
  }

  private apply(value: number, trigger: boolean): void {
    if (!this.$container) return;

    const { min, max } = this;
    const span = Math.max(1, max - min);
    const ratio = (value - min) / span;
    const length = this.containerLength();
    const offset = Math.round(ratio * length);

    this.$container.style.setProperty("--windowsplitter-value", String(value));
    this.$container.style.setProperty("--windowsplitter-ratio", String(ratio));
    this.$container.style.setProperty("--windowsplitter-offset", `${offset}px`);

    if (this.vertical) {
      this.style.setProperty("transform", `translate3d(${offset}px, 0, 0)`);
    } else {
      this.style.setProperty("transform", `translate3d(0, ${offset}px, 0)`);
    }

    this.reflectCollapsedAttribute();
    this.update(value, ratio, length, offset);
    this.emit(trigger, value, ratio);
  }

  private update(
    value: number,
    ratio: number,
    length: number,
    offset: number,
  ): void {
    if (!this.$primary || this.mode === "none") return;

    if (this.mode === "clip") {
      const remaining = Math.max(0, length - offset);

      if (this.vertical) {
        this.$primary.style.clipPath = `inset(0px ${remaining}px 0px 0px)`;
      } else {
        this.$primary.style.clipPath = `inset(0px 0px ${remaining}px 0px)`;
      }

      return;
    }

    const size = this.formatSize({ value, ratio, offset, length });

    if (this.vertical) {
      this.$primary.style.width = size;
      this.$primary.style.flexBasis = size;
    } else {
      this.$primary.style.height = size;
      this.$primary.style.flexBasis = size;
    }
  }

  private containerLength(): number {
    if (!this.$container) return 0;
    const { width, height } = this.$container.getBoundingClientRect();
    return this.vertical ? width : height;
  }

  private pointerPosition(event: PointerEvent): number {
    if (!this.$container) return 0;
    const { left, top } = this.$container.getBoundingClientRect();
    return this.vertical ? event.clientX - left : event.clientY - top;
  }

  private valueFromPointer(event: PointerEvent): number {
    const length = this.containerLength();
    const { min, max } = this;
    const span = max - min;
    const position = this.pointerPosition(event) - this.grabOffset;
    const ratio = length > 0 ? position / length : 0;
    return clamp(Math.round(min + span * ratio), min, max);
  }

  private handlePointerdown = (event: PointerEvent): void => {
    if (this.disabled || event.button !== 0) return;

    this.focus({ preventScroll: true });
    event.preventDefault();

    if (this.fixed) {
      this.toggle();
      return;
    }

    const length = this.containerLength();
    const currentOffset = this.ratio * length;

    this.grabOffset = this.pointerPosition(event) - currentOffset;
    this.isMoving = true;
    this.pointerId = event.pointerId;
    this.reflectDraggingAttribute(true);
    this.setPointerCapture(event.pointerId);
  };

  private handlePointermove = (event: PointerEvent): void => {
    if (!this.isMoving || event.pointerId !== this.pointerId) return;
    this.setValue(this.valueFromPointer(event));
    event.preventDefault();
  };

  private handlePointerup = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId && this.pointerId !== null) return;

    this.isMoving = false;
    this.pointerId = null;
    this.grabOffset = 0;
    this.reflectDraggingAttribute(false);

    if (this.hasPointerCapture?.(event.pointerId)) {
      this.releasePointerCapture(event.pointerId);
    }
  };

  private handleKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    const { key, shiftKey } = event;
    const step = shiftKey ? this.page : this.step;
    const current = this.value;

    const move = (next: number) => {
      this.setValue(next);
      event.preventDefault();
    };

    const toggle = () => {
      this.toggle();
      event.preventDefault();
    };

    if (key === "Enter") {
      toggle();
      return;
    }

    if (this.fixed) return;

    switch (key) {
      case "Home":
        move(this.min);
        break;
      case "End":
        move(this.max);
        break;
      case "PageUp":
        move(current + this.page);
        break;
      case "PageDown":
        move(current - this.page);
        break;
      case "ArrowLeft":
        move(current - step);
        break;
      case "ArrowRight":
        move(current + step);
        break;
      case "ArrowUp":
        move(this.vertical ? current + step : current - step);
        break;
      case "ArrowDown":
        move(this.vertical ? current - step : current + step);
        break;
      default:
        break;
    }
  };

  private emit(trigger: boolean, value: number, ratio: number): void {
    if (!trigger) return;

    const detail: WindowSplitterDetail = {
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

  private reflectCollapsedAttribute(): void {
    this.reflectingAttribute = true;
    if (this.collapsed) {
      this.setAttribute("collapsed", "");
    } else {
      this.removeAttribute("collapsed");
    }
    this.reflectingAttribute = false;
  }

  private reflectDraggingAttribute(on: boolean): void {
    this.reflectingAttribute = true;
    if (on) {
      this.setAttribute("dragging", "");
    } else {
      this.removeAttribute("dragging");
    }
    this.reflectingAttribute = false;
  }

  private reflectDisabledAttribute(): void {
    this.reflectingAttribute = true;
    if (this.disabled) {
      this.setAttribute("disabled", "");
    } else if (this.getAttribute("aria-disabled") !== "true") {
      this.removeAttribute("disabled");
    }
    this.reflectingAttribute = false;
  }
}

if (!customElements.get("cinq-windowsplitter")) {
  customElements.define("cinq-windowsplitter", WindowSplitter);
}
