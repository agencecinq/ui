export const setInactive = (element: HTMLElement): void => {
  element.classList.remove("is-active");
};

export const setActive = (element: HTMLElement): void => {
  element.classList.add("is-active");
};

export const getURLHash = (): string =>
  document.location.hash.replace(/^#\//, "");

/** Panels owned by this accordion host — excludes panels inside nested accordions. */
export const getAccordionPanels = (root: HTMLElement): HTMLElement[] =>
  [...root.querySelectorAll<HTMLElement>("[data-accordion-panel]")].filter(
    (panel) => panel.closest("cinq-accordion") === root,
  );
