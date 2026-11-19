import { EVENTS as e, dispatchEvent as t } from "@agencecinq/utils";
//#region src/switch.ts
var n = class extends HTMLElement {
	static formAssociated = !0;
	static observedAttributes = ["aria-checked", "value"];
	#e = this.attachInternals();
	#t = null;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		this.#t ??= this.checked, this.addEventListener("click", this.#n), this.addEventListener("keydown", this.#r);
	}
	attributeChangedCallback() {
		this.#o();
	}
	formResetCallback() {
		this.#a(this.#t ?? !1);
	}
	formStateRestoreCallback(e) {
		this.#a(e === "true");
	}
	get value() {
		return this.getAttribute("value") ?? "on";
	}
	get checked() {
		return this.getAttribute("aria-checked") === "true";
	}
	get disabled() {
		return this.matches(":disabled") || this.getAttribute("aria-disabled") === "true";
	}
	toggle() {
		return this.disabled ? !1 : this.checked ? this.deactivate() : this.activate();
	}
	activate(n = !0) {
		return this.disabled || this.checked || n && !t(this, e.SWITCH_ACTIVATE, this.#i) ? !1 : (this.#a(!0), !0);
	}
	deactivate(n = !0) {
		return this.disabled || !this.checked || n && !t(this, e.SWITCH_DEACTIVATE, this.#i) ? !1 : (this.#a(!1), !0);
	}
	destroy() {
		this.removeEventListener("click", this.#n), this.removeEventListener("keydown", this.#r);
	}
	#n = (e) => {
		this.disabled || e.detail !== 0 && this.toggle();
	};
	#r = (e) => {
		this.disabled || (e.key === " " || e.key === "Enter") && (e.preventDefault(), this.toggle());
	};
	get #i() {
		return { el: this };
	}
	#a(e) {
		this.setAttribute("aria-checked", e.toString());
	}
	#o() {
		let e = this.checked ? this.value : null, t = this.checked.toString();
		this.#e.setFormValue(e, t);
	}
};
customElements.get("cinq-switch") || customElements.define("cinq-switch", n);
//#endregion
export { n as Switch };
