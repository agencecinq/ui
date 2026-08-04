export const setInactive = (element: HTMLElement): void => {
  element.classList.remove("is-active");
};

export const setActive = (element: HTMLElement): void => {
  element.classList.add("is-active");
};

export const getURLHash = (): string =>
  decodeURIComponent(document.location.hash.replace(/^#\/?/, ""));
