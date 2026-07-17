export default class Props {
  id: string;
  role: string;
  "aria-posinset": number;
  "aria-setsize": number;
  "aria-selected"?: string;

  /**
   * @param prefix — Listbox `id` (HTML source of truth). Scopes option ids
   * when several comboboxes share the page.
   */
  constructor(index: number, selected: number, prefix: string, size: number) {
    this.id = `${prefix}-option-${index}`;
    this.role = "option";
    this["aria-posinset"] = index + 1;
    this["aria-setsize"] = size;

    if (index === selected) {
      this["aria-selected"] = "true";
    }
  }

  toString(): string {
    const self = this as unknown as Record<string, string | number>;

    return Object.keys(this).reduce(
      (str, key) => `${str} ${key}="${self[key]}"`,
      "",
    );
  }
}
