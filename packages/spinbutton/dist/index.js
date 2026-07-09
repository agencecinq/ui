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
	TAB_BEFORE_ACTIVATE: "tab-before-activate",
	TAB_ACTIVATE: "tab-activate",
	TAB_DELETE: "tab-delete",
	CART_BEFORE_ADD: "cart-before-add",
	CART_BEFORE_UPDATE: "cart-before-update",
	CART_UPDATE: "cart-update",
	VARIANT_CHANGE: "variant-change"
}, t = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, n = document.documentElement, { body: r } = document;
n.hasAttribute("data-debug");
var i = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", t(({ x: e, y: t }) => {
	i.x = e, i.y = t;
}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var a = (e, t, n) => Math.min(Math.max(e, t), n), o = {
	step: 1,
	delay: 20
}, s = {
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	border: "0"
}, c = (e, t) => t ? `${e} ${e <= 1 ? t.single : t.plural}` : e.toString(), l = (e, t, n) => {
	!e || n === !1 || (t === n ? e.setAttribute("disabled", "true") : e.removeAttribute("disabled"));
}, u = (e, t, n) => {
	let r = e.getAttribute(t);
	if (r === null) return n;
	let i = parseInt(r, 10);
	return Number.isNaN(i) ? n : i;
}, d = class extends HTMLElement {
	$input = null;
	$increase = null;
	$decrease = null;
	$liveRegion = null;
	options = { ...o };
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
		this.$increase = this.querySelector("[data-spinbutton-action=\"increase\"]"), this.$decrease = this.querySelector("[data-spinbutton-action=\"decrease\"]"), this.$liveRegion = document.createElement("div"), this.$liveRegion.setAttribute("aria-live", "polite"), this.$liveRegion.setAttribute("aria-atomic", "true"), Object.assign(this.$liveRegion.style, s), this.appendChild(this.$liveRegion), this.text = this.parseText(), this.options.step = u(this, "data-spinbutton-step", o.step), this.options.delay = u(this, "data-spinbutton-delay", o.delay);
		let e = this.$input.getAttribute("aria-valuemin"), t = this.$input.getAttribute("aria-valuemax"), n = u(this.$input, "aria-valuenow", 0);
		this.value = {
			min: e !== null && parseInt(e, 10),
			max: t !== null && parseInt(t, 10),
			now: n,
			text: c(n, this.text)
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
		n < r || n > i ? this.$input.setAttribute("aria-invalid", "true") : this.$input.removeAttribute("aria-invalid"), this.value.now = a(n, r, i), this.value.text = c(this.value.now, this.text), l(this.$increase, this.value.now, this.value.max), l(this.$decrease, this.value.now, this.value.min), this.$input.setAttribute("aria-valuenow", this.value.now.toString()), this.$input.setAttribute("aria-valuetext", this.value.text), this.$input.value = this.value.now.toString(), this.$input.setAttribute("value", this.value.now.toString()), this.$liveRegion && (this.$liveRegion.textContent = this.value.text), t && this.emitChange();
	}
	emitChange() {
		(this.throttledEmit ??= t(() => {
			let t = { value: this.value.now };
			this.dispatchEvent(new CustomEvent(e.SPINBUTTON_CHANGE, {
				bubbles: !0,
				cancelable: !0,
				detail: t
			}));
		}, this.options.delay))();
	}
	destroy() {
		this.$input?.removeEventListener("keydown", this.handleKeydown), this.$input?.removeEventListener("change", this.handleInputChange), this.$increase?.removeEventListener("click", this.increase), this.$decrease?.removeEventListener("click", this.decrease), this.$liveRegion && this.contains(this.$liveRegion) && this.removeChild(this.$liveRegion), this.$liveRegion = null, this.throttledEmit = null;
	}
};
customElements.get("cinq-spinbutton") || customElements.define("cinq-spinbutton", d);
//#endregion
export { d as Spinbutton };
