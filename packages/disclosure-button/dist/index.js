import { EVENTS as e, dispatchEvent as t } from "@agencecinq/utils";
//#region src/disclosure-button.ts
var { DISCLOSURE_BUTTON_OPEN: n, DISCLOSURE_BUTTON_CLOSE: r } = e, i = class extends HTMLElement {
	$button = null;
	elements = [];
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$button = null, this.elements = [];
	}
	init() {
		if (this.$button = this.querySelector("button"), !this.$button) throw Error("DisclosureButton: button element not found");
		this.elements = this.$button.ariaControlsElements ?? [], this.$button.addEventListener("click", this.#t);
	}
	get expanded() {
		return this.$button?.getAttribute("aria-expanded") === "true";
	}
	get #e() {
		return this.elements.filter((e) => !e.hidden);
	}
	toggle() {
		return this.$button ? this.#e.length > 0 ? t(this.$button, r, this.#n(!1)) ? (this.close(!1), !0) : !1 : t(this.$button, n, this.#n(!0)) ? (this.open(!1), !0) : !1 : !1;
	}
	close(e = !0) {
		this.$button && (e && this.#e.length > 0 && !t(this.$button, r, this.#n(!1)) || (this.elements.forEach((e) => {
			e.hidden = !0;
		}), this.update()));
	}
	open(e = !0) {
		this.$button && (!e || this.#e.length === this.elements.length || t(this.$button, n, this.#n(!0))) && (this.elements.forEach((e) => {
			e.hidden = !1;
		}), this.update());
	}
	update() {
		this.$button && this.$button.setAttribute("aria-expanded", this.#e.length > 0 ? "true" : "false");
	}
	destroy() {
		this.$button && this.$button.removeEventListener("click", this.#t);
	}
	#t = () => {
		this.toggle();
	};
	#n(e) {
		return {
			ids: this.elements.map((e) => e.id),
			elements: this.elements,
			$button: this.$button,
			open: e
		};
	}
};
customElements.get("cinq-disclosure-button") || customElements.define("cinq-disclosure-button", i);
//#endregion
export { i as DisclosureButton };
