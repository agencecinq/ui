import { EVENTS, dispatchEvent, getFocusableElements } from "@agencecinq/utils";
import type { Detail } from "./types.js";

const { DRILLDOWN_OPEN, DRILLDOWN_CLOSE } = EVENTS;

/**
 * Drill-down navigation Web Component.
 *
 * Panels are the direct children of the host: only one is visible at a time.
 * A `<button aria-controls>` inside a panel opens the child panel it controls;
 * a `[data-close]` button goes back to the parent panel.
 *
 * State lives in the HTML: `hidden` on panels and `aria-expanded` on triggers.
 * The path back to the root is read from the expanded triggers, so no stack is kept.
 *
 * Focus is moved, never trapped: put the host in a drawer or modal to contain it.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
export class Drilldown extends HTMLElement {
  panels: HTMLElement[] = [];

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
    this.panels = [];
  }

  init(): void {
    this.panels = Array.from(this.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );

    this.addEventListener("click", this.#handleClick);
  }

  destroy(): void {
    this.removeEventListener("click", this.#handleClick);
  }

  /** The visible panel. */
  get current(): HTMLElement | null {
    return this.panels.find((panel) => !panel.hidden) ?? null;
  }

  /**
   * Shows the panel with the given ID and hides the current one.
   * Focus moves to the panel's `[autofocus]` element, or its first focusable one.
   *
   * @param id - ID of a child panel controlled by a trigger in the current panel.
   * @param trigger - Trigger to expand. Defaults to the one in the current panel.
   */
  open(id: string, trigger: HTMLButtonElement | null = null): boolean {
    const previous = this.current;
    const panel = this.panels.find((element) => element.id === id);

    if (!previous || !panel || panel === previous) {
      return false;
    }

    const $button =
      trigger ??
      previous.querySelector<HTMLButtonElement>(
        `button[aria-controls="${CSS.escape(id)}"]`,
      );

    if (!$button) {
      return false;
    }

    if (
      !dispatchEvent(this, DRILLDOWN_OPEN, {
        panel,
        previous,
        $button,
        open: true,
      } satisfies Detail)
    ) {
      return false;
    }

    $button.setAttribute("aria-expanded", "true");
    previous.hidden = true;
    panel.hidden = false;

    (
      panel.querySelector<HTMLElement>("[autofocus]") ??
      getFocusableElements(panel)[0]
    )?.focus();

    return true;
  }

  /**
   * Goes back to the parent panel. Focus returns to the trigger that opened the current one.
   * Returns `false` on the root panel.
   */
  close(focus = true): boolean {
    const previous = this.current;
    const $button = previous ? this.#trigger(previous) : null;
    const panel = $button ? this.#panel($button) : null;

    if (!previous || !$button || !panel) {
      return false;
    }

    if (
      !dispatchEvent(this, DRILLDOWN_CLOSE, {
        panel,
        previous,
        $button,
        open: false,
      } satisfies Detail)
    ) {
      return false;
    }

    $button.setAttribute("aria-expanded", "false");
    previous.hidden = true;
    panel.hidden = false;

    if (focus) {
      $button.focus();
    }

    return true;
  }

  /** Goes back to the root panel without moving focus (e.g. when the drawer closes). */
  closeAll(): void {
    while (this.close(false));
  }

  /** Expanded trigger that controls the given panel. */
  #trigger(panel: HTMLElement): HTMLButtonElement | null {
    return this.querySelector<HTMLButtonElement>(
      `button[aria-controls="${CSS.escape(panel.id)}"][aria-expanded="true"]`,
    );
  }

  /** Panel containing the given element. */
  #panel(element: Element): HTMLElement | null {
    return this.panels.find((panel) => panel.contains(element)) ?? null;
  }

  #handleClick = (event: Event): void => {
    const target = event.target as Element;
    const $close = target.closest("[data-close]");

    if ($close && this.contains($close)) {
      this.close();
      return;
    }

    const $button = target.closest<HTMLButtonElement>("button[aria-controls]");
    const id = $button?.getAttribute("aria-controls");

    if ($button && id && this.contains($button)) {
      this.open(id, $button);
    }
  };
}

if (!customElements.get("cinq-drilldown")) {
  customElements.define("cinq-drilldown", Drilldown);
}
