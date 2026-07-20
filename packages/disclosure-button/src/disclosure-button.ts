import { EVENTS, dispatchEvent } from "@agencecinq/utils";
import type { Detail } from "./types.js";

const { DISCLOSURE_BUTTON_OPEN, DISCLOSURE_BUTTON_CLOSE } = EVENTS;

/**
 * Disclosure button Web Component wrapping a slotted trigger.
 *
 * HTML is the source of truth: `aria-expanded` / `aria-controls` live on the
 * trigger; style via `[aria-expanded]` or `:has([aria-expanded="true"])`.
 * Controlled nodes come from `ariaControlsElements`
 * (`FrozenArray<Element>?`, reflecting `aria-controls`).
 *
 * Visibility rules:
 * - `aria-expanded` is `true` when **at least one** controlled element is visible.
 * - If **any** controlled element is visible, `toggle()` / a trigger click closes
 *   them all (including after a partial external dismiss).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 * @see https://w3c.github.io/aria/#dom-ariamixin-ariacontrolselements
 */
export class DisclosureButton extends HTMLElement {
  $button: HTMLButtonElement | null = null;
  /** Controlled elements from `ariaControlsElements` (HTML disclosure targets). */
  elements: HTMLElement[] = [];

  connectedCallback(): void {
    this.$button = this.querySelector<HTMLButtonElement>("button");

    if (!this.$button) {
      throw new Error("DisclosureButton: button element not found");
    }

    // IDL: `attribute FrozenArray<Element>? ariaControlsElements`
    // Spec types these as Element; disclosure targets use HTMLElement.hidden.
    this.elements = (this.$button.ariaControlsElements ?? []) as HTMLElement[];

    this.$button.addEventListener("click", this.handleClick);
    this.$button.addEventListener("focus", this.handleFocus);
    this.$button.addEventListener("blur", this.handleBlur);
  }

  disconnectedCallback(): void {
    this.destroy();
    this.$button = null;
    this.elements = [];
  }

  /**
   * Reads `aria-expanded` on the trigger (HTML source of truth).
   * After mutating controlled elements yourself, call {@link update} first.
   */
  get expanded(): boolean {
    return this.$button?.getAttribute("aria-expanded") === "true";
  }

  /** Controlled elements that are currently visible (`!hidden`). */
  private get visibleElements(): HTMLElement[] {
    return this.elements.filter((element) => !element.hidden);
  }

  /** Every controlled element is visible. */
  private get allVisibleElements(): boolean {
    return (
      this.elements.length > 0 &&
      this.visibleElements.length === this.elements.length
    );
  }

  /**
   * Toggles open/closed.
   * Closes when any controlled element is visible; otherwise opens all.
   * @returns `false` if a cancelable event was aborted.
   */
  toggle(): boolean {
    if (!this.$button) return false;

    if (this.visibleElements.length > 0) {
      if (
        !dispatchEvent(
          this.$button,
          DISCLOSURE_BUTTON_CLOSE,
          this.detail(false),
        )
      ) {
        return false;
      }

      this.close(false);
      return true;
    }

    if (
      !dispatchEvent(
        this.$button,
        DISCLOSURE_BUTTON_OPEN,
        this.detail(true),
      )
    ) {
      return false;
    }

    this.open(false);
    return true;
  }

  /** Hides every controlled element. Dispatches a close event by default. */
  close(emit = true): void {
    if (!this.$button) return;

    if (emit && this.visibleElements.length > 0) {
      if (
        !dispatchEvent(
          this.$button,
          DISCLOSURE_BUTTON_CLOSE,
          this.detail(false),
        )
      ) {
        return;
      }
    }

    this.elements.forEach((element) => {
      element.hidden = true;
    });
    this.update();
  }

  /** Shows every controlled element. Dispatches an open event by default. */
  open(emit = true): void {
    if (!this.$button) {
      return;
    }

    if (emit && !this.allVisibleElements) {
      if (
        !dispatchEvent(
          this.$button,
          DISCLOSURE_BUTTON_OPEN,
          this.detail(true),
        )
      ) {
        return;
      }
    }

    this.elements.forEach((element) => {
      element.hidden = false;
    });
    this.update();
  }

  /**
   * Re-reads controlled elements and syncs `aria-expanded`.
   * `aria-expanded` is `true` while at least one controlled element is visible.
   * Call after an external dismiss so the trigger stays honest.
   */
  update(): void {
    if (!this.$button) return;

    this.$button.setAttribute(
      "aria-expanded",
      this.visibleElements.length > 0 ? "true" : "false",
    );
  }

  /** Detaches listeners. Called automatically from `disconnectedCallback`. */
  destroy(): void {
    if (!this.$button) {
      return;
    }

    this.$button.removeEventListener("click", this.handleClick);
    this.$button.removeEventListener("focus", this.handleFocus);
    this.$button.removeEventListener("blur", this.handleBlur);
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

  private detail(open: boolean): Detail {
    return {
      ids: this.elements.map((element) => element.id),
      elements: this.elements,
      el: this.$button!,
      open,
    };
  }
}

if (!customElements.get("cinq-disclosure-button")) {
  customElements.define("cinq-disclosure-button", DisclosureButton);
}
