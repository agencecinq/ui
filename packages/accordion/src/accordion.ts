import { EVENTS, keycode, parseBoolean } from "@agencecinq/utils";
import Panel from "./Panel.js";
import type { AccordionOptions } from "./types.js";
import { getURLHash, getAccordionPanels } from "./utils.js";

const DEFAULTS: AccordionOptions = {
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
  options: AccordionOptions = { ...DEFAULTS };

  connectedCallback(): void {
    const multiselectable = this.getAttribute("data-accordion-multiselectable");
    const hash = this.getAttribute("data-accordion-hash");

    this.options = {
      multiselectable: parseBoolean(multiselectable),
      hash: parseBoolean(hash, DEFAULTS.hash),
    };

    const panelElements = getAccordionPanels(this);

    this.panels = panelElements.map((element, index) => {
      const panel = new Panel(element, index);
      panel.init();
      return panel;
    });

    this.panels.forEach((panel, index) => {
      panel.el.addEventListener(EVENTS.ACCORDION_PANEL_OPEN, () =>
        this.handlePanelOpen(index),
      );
    });

    this.addEventListener("keydown", this.handleKeydown);

    if (this.options.hash) {
      window.addEventListener("hashchange", this.handleHashChange);
      this.handleHashChange();
    }
  }

  disconnectedCallback(): void {
    this.destroy();
  }

  closeAll(): void {
    this.panels.forEach((panel) => panel.close(false));
  }

  destroy(): void {
    this.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("hashchange", this.handleHashChange);
    this.panels.forEach((panel) => panel.destroy());
    this.panels = [];
  }

  private handlePanelOpen = (index: number): void => {
    this.current = index;

    if (this.options.multiselectable) return;

    this.panels.forEach((panel, i) => {
      if (i !== index) {
        panel.close(false);
      }
    });
  };

  private handleHashChange = (): void => {
    const hash = getURLHash();
    if (!hash) return;

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

  private handleKeydown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const header =
      target.matches("[data-accordion-header]")
        ? (target as HTMLButtonElement)
        : null;

    if (!header) return;

    const panelIndex = this.panels.findIndex(
      (panel) => panel.$button === header,
    );

    if (panelIndex < 0) return;

    this.current = panelIndex;

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

    const handlers: Record<number, () => void> = {
      [keycode.ARROW_UP]: previous,
      [keycode.ARROW_DOWN]: next,
      [keycode.ARROW_LEFT]: previous,
      [keycode.ARROW_RIGHT]: next,
      [keycode.HOME]: first,
      [keycode.END]: last,
    };

    handlers[event.keyCode]?.();
  };
}

if (!customElements.get("cinq-accordion")) {
  customElements.define("cinq-accordion", Accordion);
}
