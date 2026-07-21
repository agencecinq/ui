import { EVENTS, dispatchEvent } from "@agencecinq/utils";
import type { AccordionPanelDetail } from "./types.js";
import { parseBooleanAttr, setActive, setInactive } from "./utils.js";

/**
 * Accordion panel controller.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export default class Panel {
  el: HTMLElement;
  $body: HTMLElement | null = null;
  $button: HTMLButtonElement | null = null;
  $inner: HTMLElement | null = null;
  index: number;
  isDeselect = false;
  isOpen = false;
  height = 0;
  transitionDuration = 0;

  constructor(el: HTMLElement, index: number) {
    this.el = el;
    this.index = index;
  }

  init(): void {
    this.$button =
      this.el.querySelector<HTMLButtonElement>("[data-accordion-header]") ||
      this.el.querySelector<HTMLButtonElement>("button");

    if (!this.$button) return;

    // IDL: `ariaControlsElements` reflects `aria-controls` ID references.
    this.$body =
      ((this.$button.ariaControlsElements ?? [])[0] as
        | HTMLElement
        | undefined) ?? null;

    if (!this.$body) return;

    this.$inner =
      this.$body.querySelector<HTMLElement>("[data-accordion-inner]") ||
      (this.$body.firstElementChild as HTMLElement | null);

    this.isDeselect = parseBooleanAttr(
      this.el.getAttribute("data-accordion-deselect"),
    );
    this.isOpen = this.$button.getAttribute("aria-expanded") === "true";

    this.measure();
    this.$button.addEventListener("click", this.handleClick);
    this.$button.addEventListener("focus", this.handleFocus);
    this.$button.addEventListener("blur", this.handleBlur);
    window.addEventListener("resize", this.handleResize);
  }

  get open(): boolean {
    return this.$button?.getAttribute("aria-expanded") === "true";
  }

  openPanel(emit = true): boolean {
    if (!this.$button || !this.$body) return false;

    if (this.open) return false;

    if (
      emit &&
      !dispatchEvent(this.el, EVENTS.ACCORDION_PANEL_OPEN, this.detail)
    ) {
      return false;
    }

    this.$button.setAttribute("aria-expanded", "true");
    this.el.setAttribute("data-accordion-open", "true");
    this.$body.removeAttribute("hidden");

    this.measure();

    this.$body.style.setProperty("max-height", "0");

    requestAnimationFrame(() => {
      this.$body!.style.setProperty("max-height", `${this.height}px`);

      window.setTimeout(() => {
        this.$body!.style.removeProperty("max-height");
      }, this.transitionDuration);
    });

    setActive(this.el);
    this.isOpen = true;
    return true;
  }

  close(emit = true): boolean {
    if (!this.$button || !this.$body) return false;

    if (!this.open) return false;

    if (
      emit &&
      !dispatchEvent(this.el, EVENTS.ACCORDION_PANEL_CLOSE, this.detail)
    ) {
      return false;
    }

    this.$button.setAttribute("aria-expanded", "false");
    this.el.setAttribute("data-accordion-open", "false");

    this.measure();
    this.$body.style.setProperty("max-height", `${this.height}px`);

    requestAnimationFrame(() => {
      this.$body!.style.setProperty("max-height", "0");
    });

    window.setTimeout(() => {
      this.$body!.setAttribute("hidden", "");
    }, this.transitionDuration);

    setInactive(this.el);
    this.isOpen = false;
    return true;
  }

  toggle(): boolean {
    if (!this.isDeselect && this.open) return false;

    if (this.open) {
      return this.close();
    }

    return this.openPanel();
  }

  focus(): void {
    this.$button?.focus();
  }

  destroy(): void {
    this.$button?.removeEventListener("click", this.handleClick);
    this.$button?.removeEventListener("focus", this.handleFocus);
    this.$button?.removeEventListener("blur", this.handleBlur);
    window.removeEventListener("resize", this.handleResize);

    if (this.$body) {
      this.$body.style.removeProperty("max-height");
      this.$body.style.removeProperty("overflow");
    }

    setInactive(this.el);
    this.$body = null;
    this.$button = null;
    this.$inner = null;
  }

  private handleClick = (): void => {
    this.toggle();
  };

  private handleFocus = (): void => {
    this.$button?.classList.add("focus");
  };

  private handleBlur = (): void => {
    this.$button?.classList.remove("focus");
  };

  private handleResize = (): void => {
    this.measure();
  };

  private measure(): void {
    if (!this.$body) return;

    this.$body.removeAttribute("hidden");
    this.height = this.$inner?.offsetHeight || this.$body.scrollHeight || 0;
    this.$body.style.setProperty("overflow", "hidden");

    const duration = parseFloat(
      getComputedStyle(this.$body).transitionDuration,
    );

    this.transitionDuration = Number.isNaN(duration) ? 0 : duration * 1000;

    if (!this.open) {
      this.$body.setAttribute("hidden", "");
      this.$body.style.setProperty("max-height", "0");
    } else {
      this.$body.style.removeProperty("max-height");
    }
  }

  private get detail(): AccordionPanelDetail {
    return { el: this.el, index: this.index };
  }
}
