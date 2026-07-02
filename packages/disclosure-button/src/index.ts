import { EVENTS } from "@agencecinq/utils";
import type { DisclosureButtonDetail } from "./types.js";

export type { DisclosureButtonDetail } from "./types.js";

const dispatchEvent = (
  target: HTMLElement,
  details: DisclosureButtonDetail,
  eventName: string,
): boolean =>
  target.dispatchEvent(
    new CustomEvent<DisclosureButtonDetail>(eventName, {
      bubbles: false,
      cancelable: true,
      detail: details,
    }),
  );

const toggleDisplay = ($el: HTMLElement): void => {
  const style = $el.getAttribute("style");

  if (style && style.includes("display")) {
    if ($el.style.display === "block") {
      $el.style.setProperty("display", "none");
      return;
    }
    if ($el.style.display === "none") {
      $el.style.setProperty("display", "block");
    }
  }
};

const setAriaHiddenTrue = ($el: HTMLElement): void => {
  if (!$el.hasAttribute("aria-hidden")) return;

  $el.setAttribute("aria-hidden", "true");
  $el.classList.remove("is-active");
  $el.style.setProperty("pointer-events", "none");
};

const setAriaHiddenFalse = ($el: HTMLElement): void => {
  if (!$el.hasAttribute("aria-hidden")) return;

  $el.setAttribute("aria-hidden", "false");
  $el.classList.add("is-active");
  $el.style.setProperty("pointer-events", "auto");
};

/**
 * Disclosure button controller for elements with `aria-expanded` and `aria-controls`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export class DisclosureButton {
  el: HTMLElement;
  elements: HTMLElement[] = [];
  ids: string[] = [];

  constructor(el: HTMLElement) {
    this.el = el;
  }

  init(): void {
    const controls = this.el.getAttribute("aria-controls");
    if (!controls) return;

    this.ids = controls
      .trim()
      .split(" ")
      .map((id) => `#${id.trim()}`);

    this.elements = [...document.querySelectorAll<HTMLElement>(this.ids.join(","))];
    this.initEvents();
  }

  private initEvents(): void {
    this.el.addEventListener("click", this.onClick);
    this.el.addEventListener("focus", this.onFocus);
    this.el.addEventListener("blur", this.onBlur);
  }

  private onClick = (): void => {
    this.toggle();
  };

  private onFocus = (): void => {
    this.el.classList.add("focus");
  };

  private onBlur = (): void => {
    this.el.classList.remove("focus");
  };

  private get detail(): DisclosureButtonDetail {
    return { ids: this.ids, elements: this.elements, el: this.el };
  }

  toggle(): boolean {
    if (this.el.getAttribute("aria-expanded") === "true") {
      this.close();
      return dispatchEvent(this.el, this.detail, EVENTS.DISCLOSURE_BUTTON_CLOSE);
    }

    this.open();
    return dispatchEvent(this.el, this.detail, EVENTS.DISCLOSURE_BUTTON_OPEN);
  }

  close(): void {
    this.el.setAttribute("aria-expanded", "false");

    this.elements.forEach(($el) => {
      toggleDisplay($el);
      setAriaHiddenTrue($el);
    });
  }

  open(): void {
    this.el.setAttribute("aria-expanded", "true");

    this.elements.forEach(($el) => {
      toggleDisplay($el);
      setAriaHiddenFalse($el);
    });
  }

  destroy(): void {
    this.el.removeEventListener("click", this.onClick);
    this.el.removeEventListener("focus", this.onFocus);
    this.el.removeEventListener("blur", this.onBlur);
  }
}
