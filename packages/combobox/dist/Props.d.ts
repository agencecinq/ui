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
    constructor(index: number, selected: number, prefix: string, size: number);
    toString(): string;
}
//# sourceMappingURL=Props.d.ts.map