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
	CALENDAR_CHANGE: "calendar:change",
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
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, r = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, i = document.documentElement, { body: a } = document;
i.hasAttribute("data-debug"), window.addEventListener("pointermove", r(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var o = (e, t, n) => Math.min(Math.max(e, t), n), s = {
	step: 1,
	delay: 100
}, c = class extends HTMLElement {
	$input = null;
	$increase = null;
	$decrease = null;
	$live = null;
	options = { ...s };
	value = {
		min: !1,
		max: !1,
		now: 0
	};
	#e;
	#t = () => {};
	get formatValue() {
		return this.#e;
	}
	set formatValue(e) {
		if (this.#e = e, !this.$input || !e) return;
		let t = e(this.value.now);
		this.$input.setAttribute("aria-valuetext", t), this.$live && (this.$live.textContent = t);
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$input = null, this.$increase = null, this.$decrease = null, this.$live = null;
	}
	init() {
		if (this.$input = this.querySelector("input"), !this.$input) throw Error("Spinbutton must have an input element");
		this.$increase = this.querySelector("button[name=\"increase\"]"), this.$decrease = this.querySelector("button[name=\"decrease\"]"), this.$live = this.querySelector("[aria-live]"), this.options.step = n(this.getAttribute("data-spinbutton-step"), s.step), this.options.delay = n(this.getAttribute("data-spinbutton-delay"), s.delay);
		let i = this.$input.getAttribute("aria-valuemin"), a = this.$input.getAttribute("aria-valuemax"), o = n(this.$input.getAttribute("aria-valuenow"), 0);
		this.value = {
			min: i !== null && n(i, 0),
			max: a !== null && n(a, 0),
			now: o
		}, this.$input.addEventListener("keydown", this.#r), this.$input.addEventListener("change", this.#n), this.$increase?.addEventListener("click", this.increase), this.$decrease?.addEventListener("click", this.decrease), this.#t = r(() => {
			t(this, e.SPINBUTTON_CHANGE, { value: this.value.now });
		}, this.options.delay);
	}
	#n = (e) => {
		let t = e.target;
		this.setValue(n(t.value, this.value.now));
	};
	#r = (e) => {
		let { step: t } = this.options, n = {
			ArrowUp: () => this.setValue(this.value.now + t),
			ArrowDown: () => this.setValue(this.value.now - t),
			PageUp: () => this.setValue(this.value.now + t * 5),
			PageDown: () => this.setValue(this.value.now - t * 5),
			Home: () => this.value.min !== !1 && this.setValue(this.value.min),
			End: () => this.value.max !== !1 && this.setValue(this.value.max)
		}[e.key];
		n && (e.preventDefault(), n());
	};
	decrease = () => {
		this.setValue(this.value.now - this.options.step);
	};
	increase = () => {
		this.setValue(this.value.now + this.options.step);
	};
	setMin(e, t = !0) {
		this.value.min = e, this.$input?.setAttribute("aria-valuemin", e.toString()), this.setValue(this.value.now, t);
	}
	setMax(e, t = !0) {
		this.value.max = e, this.$input?.setAttribute("aria-valuemax", e.toString()), this.setValue(this.value.now, t);
	}
	setValue(e, t = !0) {
		if (!this.$input) return;
		let n = this.value.min === !1 ? -(2 ** 53 - 1) : this.value.min, r = this.value.max === !1 ? 2 ** 53 - 1 : this.value.max;
		if (e < n || e > r ? this.$input.setAttribute("aria-invalid", "true") : this.$input.removeAttribute("aria-invalid"), this.value.now = o(e, n, r), this.$increase?.toggleAttribute("disabled", this.value.max !== !1 && this.value.now === this.value.max), this.$decrease?.toggleAttribute("disabled", this.value.min !== !1 && this.value.min === this.value.now), this.$input.setAttribute("aria-valuenow", this.value.now.toString()), this.$input.value = this.value.now.toString(), this.$input.setAttribute("value", this.value.now.toString()), this.#e) {
			let e = this.#e(this.value.now);
			this.$input.setAttribute("aria-valuetext", e), this.$live && (this.$live.textContent = e);
		}
		t && this.#t();
	}
	destroy() {
		this.$input?.removeEventListener("keydown", this.#r), this.$input?.removeEventListener("change", this.#n), this.$increase?.removeEventListener("click", this.increase), this.$decrease?.removeEventListener("click", this.decrease), this.#t = () => {};
	}
};
customElements.get("cinq-spinbutton") || customElements.define("cinq-spinbutton", c);
//#endregion
export { c as Spinbutton };
