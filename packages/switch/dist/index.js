//#region ../utils/dist/index.js
var e = {
	DRAWER_BEFORE_CLOSE: "drawer:before-close",
	DRAWER_BEFORE_OPEN: "drawer:before-open",
	DRAWER_CLOSE: "drawer:close",
	DRAWER_OPEN: "drawer:open",
	DRAWER_TOGGLE: "drawer:toggle",
	SHEET_BEFORE_CLOSE: "sheet:before-close",
	SHEET_BEFORE_OPEN: "sheet:before-open",
	SHEET_CLOSE: "sheet:close",
	SHEET_OPEN: "sheet:open",
	SHEET_TOGGLE: "sheet:toggle",
	MODAL_BEFORE_CLOSE: "modal:before-close",
	MODAL_BEFORE_OPEN: "modal:before-open",
	MODAL_CLOSE: "modal:close",
	MODAL_OPEN: "modal:open",
	MODAL_TOGGLE: "modal:toggle",
	SPINBUTTON_CHANGE: "spinbutton:change",
	TOAST_OPEN: "toast:open",
	TOAST_CLOSE: "toast:close",
	DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
	DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close",
	DRILLDOWN_OPEN: "drilldown:open",
	DRILLDOWN_CLOSE: "drilldown:close",
	DROPZONE_CHANGE: "dropzone:change",
	DROPZONE_REJECT: "dropzone:reject",
	SWITCH_ACTIVATE: "switch:activate",
	SWITCH_DEACTIVATE: "switch:deactivate",
	ACCORDION_OPEN: "accordion:open",
	ACCORDION_CLOSE: "accordion:close",
	COMBOBOX_LOADING: "combobox:loading",
	COMBOBOX_LOADED: "combobox:loaded",
	COMBOBOX_UPDATE: "combobox:update",
	COMBOBOX_SUBMIT: "combobox:submit",
	COMBOBOX_EMPTY: "combobox:empty",
	WINDOWSPLITTER_CHANGE: "windowsplitter:change",
	SLIDER_CHANGE: "slider:change",
	SNAKE_EAT: "snake:eat",
	SNAKE_OVER: "snake:over",
	SNAKE_REPLAY: "snake:replay",
	CALENDAR_RENDER: "calendar:render",
	CALENDAR_BEFORE_CHANGE: "calendar:before-change",
	CALENDAR_CHANGE: "calendar:change",
	TABS_BEFORE_ACTIVATE: "tabs:before-activate",
	TABS_ACTIVATE: "tabs:activate",
	TABS_DELETE: "tabs:delete",
	CART_BEFORE_ADD: "cart:before-add",
	CART_BEFORE_UPDATE: "cart:before-update",
	CART_UPDATE: "cart:update",
	VARIANT_CHANGE: "variant:change"
}, t = (e, t, n, r = {}) => {
	let { bubbles: i = !0, cancelable: a = !0 } = r;
	return e.dispatchEvent(new CustomEvent(t, {
		bubbles: i,
		cancelable: a,
		detail: n
	}));
}, n = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, r = document.documentElement, { body: i } = document;
r.hasAttribute("data-debug"), window.addEventListener("pointermove", n(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/switch.ts
var a = class extends HTMLElement {
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
		this.#t ??= this.checked, this.addEventListener("click", this.#n), this.addEventListener("keydown", this.#r), this.#o();
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
		this.setAttribute("aria-checked", String(e));
	}
	#o() {
		this.#e.setFormValue(this.checked ? this.value : null, String(this.checked));
	}
};
customElements.get("cinq-switch") || customElements.define("cinq-switch", a);
//#endregion
export { a as Switch };
