import { EVENTS, parseBoolean } from "@agencecinq/utils";
import { Panel } from "./Panel.js";
import type { Detail, Options } from "./types.js";
import { getURLHash } from "./utils.js";

const DEFAULTS: Options = {
  multiselectable: false,
  hash: true,
};

/**
 * Accordion Web Component implementing the WAI-ARIA accordion pattern.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export class Accordion extends HTMLElement {
  panels: Panel[] = [];
  current = 0;
  options: Options = { ...DEFAULTS };

  connectedCallback(): void {
    this.init();
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  init(): void {
    this.options = {
      multiselectable: parseBoolean(
        this.getAttribute("data-accordion-multiselectable"),
      ),
      hash: parseBoolean(
        this.getAttribute("data-accordion-hash"),
        DEFAULTS.hash,
      ),
    };

    this.panels = [
      ...this.querySelectorAll<HTMLElement>("[data-accordion-panel]"),
    ]
      .filter((panel) => panel.closest("cinq-accordion") === this)
      .map((element, index) => {
        const panel = new Panel(element, index);
        panel.init();
        return panel;
      });

    this.addEventListener(EVENTS.ACCORDION_PANEL_OPEN, this.#handlePanelOpen);
    this.addEventListener("keydown", this.#handleKeydown);

    if (this.options.hash) {
      window.addEventListener("hashchange", this.#handleHashChange);
      this.#handleHashChange();
    }
  }

  closeAll(): void {
    this.panels.forEach((panel) => panel.close(false));
  }

  destroy(): void {
    this.removeEventListener(EVENTS.ACCORDION_PANEL_OPEN, this.#handlePanelOpen);
    this.removeEventListener("keydown", this.#handleKeydown);
    window.removeEventListener("hashchange", this.#handleHashChange);

    this.panels.forEach((panel) => panel.destroy());
    this.panels = [];
  }

  #handlePanelOpen = (event: Event): void => {
    const { el, index } = (event as CustomEvent<Detail>).detail;

    if (el.closest("cinq-accordion") !== this) {
      return;
    }

    this.current = index;

    if (this.options.multiselectable) {
      return;
    }

    this.panels.forEach((panel, i) => {
      if (i !== index) {
        panel.close(false);
      }
    });
  };

  #handleHashChange = (): void => {
    const hash = getURLHash();
    if (!hash) {
      return;
    }

    this.panels.forEach((panel, index) => {
      if (panel.$body && panel.$body.id === hash) {
        this.current = index;

        this.panels.forEach((other, i) => {
          if (i !== index) {
            other.close(false);
          }
        });

        panel.openPanel(false);
      }
    });
  };

  #handleKeydown = (event: KeyboardEvent): void => {
    const target = event.target as Node;
    const index = this.panels.findIndex(
      (panel) => panel.$button != null && panel.$button.contains(target),
    );

    if (index < 0) {
      return;
    }

    this.current = index;

    const previous = (): void => {
      this.current =
        this.current - 1 < 0 ? this.panels.length - 1 : this.current - 1;
      this.panels[this.current]?.focus();
      event.preventDefault();
    };

    const next = (): void => {
      this.current =
        this.current + 1 > this.panels.length - 1 ? 0 : this.current + 1;
      this.panels[this.current]?.focus();
      event.preventDefault();
    };

    const first = (): void => {
      this.current = 0;
      this.panels[0]?.focus();
      event.preventDefault();
    };

    const last = (): void => {
      this.current = this.panels.length - 1;
      this.panels[this.current]?.focus();
      event.preventDefault();
    };

    const handlers: Record<string, () => void> = {
      ArrowUp: previous,
      ArrowDown: next,
      ArrowLeft: previous,
      ArrowRight: next,
      Home: first,
      End: last,
    };

    handlers[event.key]?.();
  };
}

if (!customElements.get("cinq-accordion")) {
  customElements.define("cinq-accordion", Accordion);
}
