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
var o = (e, t, n) => Math.min(Math.max(e, t), n), s = {
	step: 1,
	delay: 20
}, c = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	border: "0"
}, l = (e, t) => t ? `${e} ${e <= 1 ? t.single : t.plural}` : e.toString(), u = (e, t, n) => {
	!e || n === !1 || (t === n ? e.setAttribute("disabled", "true") : e.removeAttribute("disabled"));
}, d = (e, t, n) => {
	let r = e.getAttribute(t);
	if (r === null) return n;
	let i = parseInt(r, 10);
	return Number.isNaN(i) ? n : i;
}, f = class extends HTMLElement {
	$input = null;
	$increase = null;
	$decrease = null;
	$liveRegion = null;
	options = { ...s };
	value = {
		min: !1,
		max: !1,
		now: 0,
		text: "0"
	};
	text;
	throttledEmit = null;
	connectedCallback() {
		if (this.$input = this.querySelector("[data-spinbutton-input]") || this.querySelector("input"), !this.$input) return;
		this.$increase = this.querySelector("[data-spinbutton-action=\"increase\"]"), this.$decrease = this.querySelector("[data-spinbutton-action=\"decrease\"]"), this.$liveRegion = document.createElement("div"), this.$liveRegion.setAttribute("aria-live", "polite"), this.$liveRegion.setAttribute("aria-atomic", "true"), Object.assign(this.$liveRegion.style, c), this.appendChild(this.$liveRegion), this.text = this.parseText(), this.options.step = d(this, "data-spinbutton-step", s.step), this.options.delay = d(this, "data-spinbutton-delay", s.delay);
		let e = this.$input.getAttribute("aria-valuemin"), t = this.$input.getAttribute("aria-valuemax"), n = d(this.$input, "aria-valuenow", 0);
		this.value = {
			min: e !== null && parseInt(e, 10),
			max: t !== null && parseInt(t, 10),
			now: n,
			text: l(n, this.text)
		}, this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	parseText() {
		let e = this.getAttribute("data-spinbutton-text");
		if (e) try {
			let t = JSON.parse(e);
			if (typeof t.single == "string" && typeof t.plural == "string") return {
				single: t.single,
				plural: t.plural
			};
		} catch {}
	}
	init() {
		this.setValue(this.value.now, !1), this.initEvents();
	}
	initEvents() {
		this.$input?.addEventListener("keydown", this.handleKeydown), this.$input?.addEventListener("change", this.handleInputChange), this.$increase?.addEventListener("click", this.increase), this.$decrease?.addEventListener("click", this.decrease);
	}
	handleInputChange = (e) => {
		let t = e.target, n = parseInt(t.value, 10);
		this.setValue(Number.isNaN(n) ? this.value.now : n);
	};
	handleKeydown = (e) => {
		let t = e.key || e.code, { step: n } = this.options, r = {
			ArrowUp: () => this.setValue(this.value.now + n),
			ArrowDown: () => this.setValue(this.value.now - n),
			PageUp: () => this.setValue(this.value.now + n * 5),
			PageDown: () => this.setValue(this.value.now - n * 5),
			Home: () => {
				this.value.min !== !1 && this.setValue(this.value.min);
			},
			End: () => {
				this.value.max !== !1 && this.setValue(this.value.max);
			}
		}[t];
		r && (e.preventDefault(), r());
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
		let n = Number.isNaN(e) ? this.value.now : e, r = this.value.min === !1 ? -(2 ** 53 - 1) : this.value.min, i = this.value.max === !1 ? 2 ** 53 - 1 : this.value.max;
		n < r || n > i ? this.$input.setAttribute("aria-invalid", "true") : this.$input.removeAttribute("aria-invalid"), this.value.now = o(n, r, i), this.value.text = l(this.value.now, this.text), u(this.$increase, this.value.now, this.value.max), u(this.$decrease, this.value.now, this.value.min), this.$input.setAttribute("aria-valuenow", this.value.now.toString()), this.$input.setAttribute("aria-valuetext", this.value.text), this.$input.value = this.value.now.toString(), this.$input.setAttribute("value", this.value.now.toString()), this.$liveRegion && (this.$liveRegion.textContent = this.value.text), t && this.emitChange();
	}
	emitChange() {
		(this.throttledEmit ??= n(() => {
			let n = { value: this.value.now };
			t(this, e.SPINBUTTON_CHANGE, n);
		}, this.options.delay))();
	}
	destroy() {
		this.$input?.removeEventListener("keydown", this.handleKeydown), this.$input?.removeEventListener("change", this.handleInputChange), this.$increase?.removeEventListener("click", this.increase), this.$decrease?.removeEventListener("click", this.decrease), this.$liveRegion && this.contains(this.$liveRegion) && this.removeChild(this.$liveRegion), this.$liveRegion = null, this.throttledEmit = null;
	}
};
customElements.get("cinq-spinbutton") || customElements.define("cinq-spinbutton", f);
//#endregion
export { f as Spinbutton };
