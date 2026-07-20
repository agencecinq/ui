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
var o = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	ESCAPE: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	ARROW_LEFT: 37,
	ARROW_UP: 38,
	ARROW_RIGHT: 39,
	ARROW_DOWN: 40,
	DELETE: 46
}, s = class extends HTMLElement {
	static observedAttributes = ["checked", "disabled"];
	$input = null;
	reflectingAttribute = !1;
	connectedCallback() {
		this.$input = this.querySelector("[data-switch-input]") || this.querySelector("input[type=\"checkbox\"]"), this.addEventListener("click", this.handleClick), this.addEventListener("keydown", this.handleKeydown), this.addEventListener("focus", this.handleFocus), this.addEventListener("blur", this.handleBlur);
	}
	disconnectedCallback() {
		this.destroy(), this.$input = null;
	}
	attributeChangedCallback(e, t, n) {
		if (e === "disabled") {
			this.syncInput(), n !== null && this.matches(":focus") && this.blur();
			return;
		}
		if (e !== "checked" || this.reflectingAttribute) return;
		let r = this.getAttribute("aria-checked") === "true";
		if (n !== null && !r) {
			this.activate();
			return;
		}
		n === null && r && this.deactivate();
	}
	get checked() {
		return this.getAttribute("aria-checked") === "true";
	}
	get disabled() {
		return this.hasAttribute("disabled") || this.getAttribute("aria-disabled") === "true";
	}
	toggle() {
		return this.disabled ? !1 : this.checked ? this.deactivate() : this.activate();
	}
	activate(n = !0) {
		return this.disabled || this.checked || n && !t(this, e.SWITCH_ACTIVATE, this.detail) ? !1 : (this.setAttribute("aria-checked", "true"), this.syncInput(), this.reflectCheckedAttribute(), !0);
	}
	deactivate(n = !0) {
		return this.disabled || !this.checked || n && !t(this, e.SWITCH_DEACTIVATE, this.detail) ? !1 : (this.setAttribute("aria-checked", "false"), this.syncInput(), this.reflectCheckedAttribute(), !0);
	}
	destroy() {
		this.removeEventListener("click", this.handleClick), this.removeEventListener("keydown", this.handleKeydown), this.removeEventListener("focus", this.handleFocus), this.removeEventListener("blur", this.handleBlur);
	}
	handleClick = (e) => {
		this.disabled || e.detail !== 0 && this.toggle();
	};
	handleKeydown = (e) => {
		this.disabled || e.keyCode !== o.SPACE && e.keyCode !== o.ENTER || (e.preventDefault(), this.toggle());
	};
	handleFocus = () => {
		this.classList.add("focus");
	};
	handleBlur = () => {
		this.classList.remove("focus");
	};
	get detail() {
		return { el: this };
	}
	syncInput() {
		if (!this.$input) return;
		let e = this.checked;
		this.$input.checked = e, e ? this.$input.setAttribute("checked", "") : this.$input.removeAttribute("checked"), this.$input.disabled = this.disabled, this.disabled ? this.$input.setAttribute("disabled", "") : this.$input.removeAttribute("disabled");
	}
	reflectCheckedAttribute() {
		this.reflectingAttribute = !0, this.getAttribute("aria-checked") === "true" ? this.setAttribute("checked", "") : this.removeAttribute("checked"), this.reflectingAttribute = !1;
	}
};
customElements.get("cinq-switch") || customElements.define("cinq-switch", s);
//#endregion
export { s as Switch };
