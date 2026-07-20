//#region ../utils/dist/index.js
var e = {
	DRAWER_CLOSE: "drawer-close",
	DRAWER_OPEN: "drawer-open",
	DRAWER_TOGGLE: "drawer-toggle",
	MODAL_CLOSE: "modal-close",
	MODAL_OPEN: "modal-open",
	MODAL_TOGGLE: "modal-toggle",
	SPINBUTTON_CHANGE: "spinbutton-change",
	DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
	DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close",
	SWITCH_ACTIVATE: "switch:activate",
	SWITCH_DEACTIVATE: "switch:deactivate",
	ACCORDION_PANEL_OPEN: "accordion-panel:open",
	ACCORDION_PANEL_CLOSE: "accordion-panel:close",
	COMBOBOX_LOADING: "combobox:loading",
	COMBOBOX_LOADED: "combobox:loaded",
	COMBOBOX_UPDATE: "combobox:update",
	COMBOBOX_SUBMIT: "combobox:submit",
	COMBOBOX_EMPTY: "combobox:empty",
	WINDOWSPLITTER_CHANGE: "windowsplitter:change",
	TAB_BEFORE_ACTIVATE: "tab-before-activate",
	TAB_ACTIVATE: "tab-activate",
	TAB_DELETE: "tab-delete",
	CART_BEFORE_ADD: "cart-before-add",
	CART_BEFORE_UPDATE: "cart-before-update",
	CART_UPDATE: "cart-update",
	VARIANT_CHANGE: "variant-change"
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
r.hasAttribute("data-debug");
var a = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", n(({ x: e, y: t }) => {
	a.x = e, a.y = t;
}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/disclosure-button.ts
var { DISCLOSURE_BUTTON_OPEN: o, DISCLOSURE_BUTTON_CLOSE: s } = e, c = class extends HTMLElement {
	$button = null;
	elements = [];
	connectedCallback() {
		if (this.$button = this.querySelector("button"), !this.$button) throw Error("DisclosureButton: button element not found");
		this.elements = this.$button.ariaControlsElements ?? [], this.$button.addEventListener("click", this.handleClick), this.$button.addEventListener("focus", this.handleFocus), this.$button.addEventListener("blur", this.handleBlur);
	}
	disconnectedCallback() {
		this.destroy(), this.$button = null, this.elements = [];
	}
	get expanded() {
		return this.$button?.getAttribute("aria-expanded") === "true";
	}
	get visibleElements() {
		return this.elements.filter((e) => !e.hidden);
	}
	get allVisibleElements() {
		return this.elements.length > 0 && this.visibleElements.length === this.elements.length;
	}
	toggle() {
		return this.$button ? this.visibleElements.length > 0 ? t(this.$button, s, this.detail(!1)) ? (this.close(!1), !0) : !1 : t(this.$button, o, this.detail(!0)) ? (this.open(!1), !0) : !1 : !1;
	}
	close(e = !0) {
		this.$button && (e && this.visibleElements.length > 0 && !t(this.$button, s, this.detail(!1)) || (this.elements.forEach((e) => {
			e.hidden = !0;
		}), this.update()));
	}
	open(e = !0) {
		this.$button && (e && !this.allVisibleElements && !t(this.$button, o, this.detail(!0)) || (this.elements.forEach((e) => {
			e.hidden = !1;
		}), this.update()));
	}
	update() {
		this.$button && this.$button.setAttribute("aria-expanded", this.visibleElements.length > 0 ? "true" : "false");
	}
	destroy() {
		this.$button && (this.$button.removeEventListener("click", this.handleClick), this.$button.removeEventListener("focus", this.handleFocus), this.$button.removeEventListener("blur", this.handleBlur));
	}
	handleClick = () => {
		this.toggle();
	};
	handleFocus = () => {
		this.$button?.classList.add("focus");
	};
	handleBlur = () => {
		this.$button?.classList.remove("focus");
	};
	detail(e) {
		return {
			ids: this.elements.map((e) => e.id),
			elements: this.elements,
			el: this.$button,
			open: e
		};
	}
};
customElements.get("cinq-disclosure-button") || customElements.define("cinq-disclosure-button", c);
//#endregion
export { c as DisclosureButton };
