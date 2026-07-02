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
      bubbles: true,
      cancelable: true,
      detail: details,
    }),
  );

const setHidden = (element: HTMLElement, open: boolean): void => {
  element.hidden = !open;
};

const applyOpenState = (elements: HTMLElement[]): void => {
  elements.forEach((element) => {
    setHidden(element, true);
  });
};

const applyCloseState = (elements: HTMLElement[]): void => {
  elements.forEach((element) => {
    setHidden(element, false);
  });
};

const isElementOpen = (element: HTMLElement): boolean => !element.hidden;

const parseControlIds = (controls: string | null): string[] => {
  if (!controls) return [];

  return controls
    .trim()
    .split(/\s+/)
    .map((id) => id.trim())
    .filter(Boolean);
};

const isLinkedDetail = (
  detail: DisclosureButtonDetail,
  elements: HTMLElement[],
): boolean => detail.elements.some((element) => elements.includes(element));

/**
 * Disclosure button controller for elements with `aria-expanded` and `aria-controls`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export class DisclosureButton {
  el: HTMLElement;
  elements: HTMLElement[] = [];
  private controlIds: string[] = [];

  constructor(el: HTMLElement) {
    this.el = el;
  }

  init(): void {
    this.controlIds = parseControlIds(this.el.getAttribute("aria-controls"));
    if (this.controlIds.length === 0) return;

    const selectors = this.controlIds.map((id) => `#${id}`).join(",");
    this.elements = [...document.querySelectorAll<HTMLElement>(selectors)];

    this.initEvents();
    this.updateExpandedFromElements();
  }

  private initEvents(): void {
    this.el.addEventListener("click", this.onClick);
    this.el.addEventListener("focus", this.onFocus);
    this.el.addEventListener("blur", this.onBlur);
    document.addEventListener(EVENTS.DISCLOSURE_BUTTON_OPEN, this.onLinkedChange);
    document.addEventListener(EVENTS.DISCLOSURE_BUTTON_CLOSE, this.onLinkedChange);
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

  private onLinkedChange = (event: Event): void => {
    if (!(event instanceof CustomEvent)) return;

    const detail = event.detail as DisclosureButtonDetail;
    if (detail.el === this.el) return;
    if (!isLinkedDetail(detail, this.elements)) return;

    queueMicrotask(() => {
      this.updateExpandedFromElements();
    });
  };

  private get detail(): DisclosureButtonDetail {
    return { ids: this.controlIds, elements: this.elements, el: this.el };
  }

  private isExpanded(): boolean {
    return this.el.getAttribute("aria-expanded") === "true";
  }

  private updateExpandedFromElements(): void {
    if (this.elements.length === 0) {
      this.el.setAttribute("aria-expanded", "false");
      return;
    }

    const expanded = this.elements.every((element) => isElementOpen(element));
    this.el.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  toggle(): boolean {
    if (this.isExpanded()) {
      if (!dispatchEvent(this.el, this.detail, EVENTS.DISCLOSURE_BUTTON_CLOSE)) {
        return false;
      }

      this.close(false);
      return true;
    }

    if (!dispatchEvent(this.el, this.detail, EVENTS.DISCLOSURE_BUTTON_OPEN)) {
      return false;
    }

    this.open(false);
    return true;
  }

  close(emit = true): void {
    if (emit && this.isExpanded()) {
      if (!dispatchEvent(this.el, this.detail, EVENTS.DISCLOSURE_BUTTON_CLOSE)) {
        return;
      }
    }

    applyCloseState(this.elements);
    this.updateExpandedFromElements();
  }

  open(emit = true): void {
    if (emit && !this.isExpanded()) {
      if (!dispatchEvent(this.el, this.detail, EVENTS.DISCLOSURE_BUTTON_OPEN)) {
        return;
      }
    }

    applyOpenState(this.elements);
    this.updateExpandedFromElements();
  }

  destroy(): void {
    this.el.removeEventListener("click", this.onClick);
    this.el.removeEventListener("focus", this.onFocus);
    this.el.removeEventListener("blur", this.onBlur);
    document.removeEventListener(EVENTS.DISCLOSURE_BUTTON_OPEN, this.onLinkedChange);
    document.removeEventListener(EVENTS.DISCLOSURE_BUTTON_CLOSE, this.onLinkedChange);
  }
}
