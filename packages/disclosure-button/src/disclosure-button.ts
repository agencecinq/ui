import { EVENTS } from "@agencecinq/utils";
import type { DisclosureButtonDetail } from "./types.js";

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
 * Disclosure button Web Component wrapping a slotted trigger.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export class DisclosureButton extends HTMLElement {
  static observedAttributes = ["expanded"];

  $button: HTMLButtonElement | null = null;
  elements: HTMLElement[] = [];

  private controlIds: string[] = [];
  private observer: MutationObserver | null = null;
  private reflectingAttribute = false;

  connectedCallback(): void {
    this.$button =
      this.querySelector<HTMLButtonElement>("[data-button]") ||
      this.querySelector<HTMLButtonElement>("button");

    if (!this.$button) {
      throw new Error("DisclosureButton: button element not found");
    }

    this.controlIds = parseControlIds(this.$button.getAttribute("aria-controls"));
    if (this.controlIds.length === 0) return;

    const selectors = this.controlIds.map((id) => `#${id}`).join(",");
    this.elements = [...document.querySelectorAll<HTMLElement>(selectors)];

    this.initEvents();
    this.updateExpandedFromElements();

    this.observer = new MutationObserver(() => {
      if (!this.reflectingAttribute) {
        this.reflectExpandedAttribute();
      }
    });
    this.observer.observe(this.$button, {
      attributes: true,
      attributeFilter: ["aria-expanded"],
    });

    this.reflectExpandedAttribute();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$button = null;
    this.elements = [];
    this.controlIds = [];
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null,
  ): void {
    if (name !== "expanded" || !this.$button || this.reflectingAttribute) {
      return;
    }

    const isExpanded = this.$button.getAttribute("aria-expanded") === "true";

    if (newValue !== null && !isExpanded) {
      this.open();
      return;
    }

    if (newValue === null && isExpanded) {
      this.close();
    }
  }

  get button(): HTMLButtonElement | null {
    return this.$button;
  }

  get expanded(): boolean {
    return this.$button?.getAttribute("aria-expanded") === "true";
  }

  toggle(): boolean {
    if (!this.$button) return false;

    if (this.isExpanded()) {
      if (!dispatchEvent(this.$button, this.detail, EVENTS.DISCLOSURE_BUTTON_CLOSE)) {
        return false;
      }

      this.close(false);
      return true;
    }

    if (!dispatchEvent(this.$button, this.detail, EVENTS.DISCLOSURE_BUTTON_OPEN)) {
      return false;
    }

    this.open(false);
    return true;
  }

  close(emit = true): void {
    if (!this.$button) return;

    if (emit && this.isExpanded()) {
      if (!dispatchEvent(this.$button, this.detail, EVENTS.DISCLOSURE_BUTTON_CLOSE)) {
        return;
      }
    }

    applyCloseState(this.elements);
    this.updateExpandedFromElements();
  }

  open(emit = true): void {
    if (!this.$button) return;

    if (emit && !this.isExpanded()) {
      if (!dispatchEvent(this.$button, this.detail, EVENTS.DISCLOSURE_BUTTON_OPEN)) {
        return;
      }
    }

    applyOpenState(this.elements);
    this.updateExpandedFromElements();
  }

  destroy(): void {
    if (!this.$button) return;

    this.$button.removeEventListener("click", this.handleClick);
    this.$button.removeEventListener("focus", this.handleFocus);
    this.$button.removeEventListener("blur", this.handleBlur);
    document.removeEventListener(EVENTS.DISCLOSURE_BUTTON_OPEN, this.handleLinkedChange);
    document.removeEventListener(EVENTS.DISCLOSURE_BUTTON_CLOSE, this.handleLinkedChange);

    this.observer?.disconnect();
    this.observer = null;
  }

  private initEvents(): void {
    if (!this.$button) return;

    this.$button.addEventListener("click", this.handleClick);
    this.$button.addEventListener("focus", this.handleFocus);
    this.$button.addEventListener("blur", this.handleBlur);
    document.addEventListener(EVENTS.DISCLOSURE_BUTTON_OPEN, this.handleLinkedChange);
    document.addEventListener(EVENTS.DISCLOSURE_BUTTON_CLOSE, this.handleLinkedChange);
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

  private handleLinkedChange = (event: Event): void => {
    if (!(event instanceof CustomEvent) || !this.$button) return;

    const detail = event.detail as DisclosureButtonDetail;
    if (detail.el === this.$button) return;
    if (!isLinkedDetail(detail, this.elements)) return;

    queueMicrotask(() => {
      this.updateExpandedFromElements();
    });
  };

  private get detail(): DisclosureButtonDetail {
    return { ids: this.controlIds, elements: this.elements, el: this.$button! };
  }

  private isExpanded(): boolean {
    return this.$button?.getAttribute("aria-expanded") === "true";
  }

  private updateExpandedFromElements(): void {
    if (!this.$button) return;

    if (this.elements.length === 0) {
      this.$button.setAttribute("aria-expanded", "false");
      return;
    }

    const expanded = this.elements.every((element) => isElementOpen(element));
    this.$button.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  private reflectExpandedAttribute(): void {
    if (!this.$button) return;

    this.reflectingAttribute = true;

    if (this.$button.getAttribute("aria-expanded") === "true") {
      this.setAttribute("expanded", "");
    } else {
      this.removeAttribute("expanded");
    }

    this.reflectingAttribute = false;
  }
}

if (!customElements.get("cinq-disclosure-button")) {
  customElements.define("cinq-disclosure-button", DisclosureButton);
}
