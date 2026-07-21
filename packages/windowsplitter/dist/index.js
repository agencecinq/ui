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
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, r = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", i = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, a = document.documentElement, { body: o } = document;
a.hasAttribute("data-debug");
var s = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", i(({ x: e, y: t }) => {
	s.x = e, s.y = t;
}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var c = (e, t, n) => Math.min(Math.max(e, t), n), l = class {
	host;
	constructor(e) {
		this.host = e;
	}
	handle = (e) => {
		let { host: t } = this;
		if (t.disabled) return;
		let { key: n, shiftKey: r } = e, i = r ? t.page : t.step, a = t.value, o = t.orientation === "vertical", s = (n) => {
			t.setValue(n), e.preventDefault();
		};
		if (n === "Enter") {
			t.toggle(), e.preventDefault();
			return;
		}
		if (!t.fixed) {
			if (n === "Home") {
				s(t.min);
				return;
			}
			if (n === "End") {
				s(t.max);
				return;
			}
			if (n === "PageUp") {
				s(a + t.page);
				return;
			}
			if (n === "PageDown") {
				s(a - t.page);
				return;
			}
			if (o) {
				if (n === "ArrowLeft") {
					s(a - i);
					return;
				}
				if (n === "ArrowRight") {
					s(a + i);
					return;
				}
				return;
			}
			if (n === "ArrowUp") {
				s(a - i);
				return;
			}
			n === "ArrowDown" && s(a + i);
		}
	};
}, u = ({ value: e }) => `${e}%`, d = (e) => String(e), f = (e) => e === "clip" || e === "none" || e === "resize" ? e : "resize", p = class extends HTMLElement {
	static observedAttributes = [
		"data-windowsplitter-mode",
		"data-windowsplitter-step",
		"data-windowsplitter-page",
		"data-windowsplitter-fixed"
	];
	$separator = null;
	mode = "resize";
	step = 1;
	page = 10;
	fixed = !1;
	formatSize = u;
	formatValue = d;
	history = null;
	resizeObserver = null;
	keyboard = null;
	bound = !1;
	drag = null;
	connectedCallback() {
		if (this.$separator = this.querySelector("[role=\"separator\"], [role=\"slider\"]"), !this.$separator) throw Error("cinq-windowsplitter: nested [role=\"separator\"] or [role=\"slider\"] not found");
		this.read(), this.$separator.style.touchAction = "none", this.keyboard = new l(this), this.$separator.addEventListener("keydown", this.keyboard.handle), this.$separator.addEventListener("pointerdown", this.handlePointerdown), this.$separator.addEventListener("pointermove", this.handlePointermove), this.$separator.addEventListener("pointerup", this.handlePointerup), this.$separator.addEventListener("pointercancel", this.handlePointerup), this.$separator.addEventListener("lostpointercapture", this.handlePointerup), this.bound = !0, this.observe(), this.sync();
	}
	disconnectedCallback() {
		this.destroy();
	}
	destroy() {
		this.bound && this.$separator && (this.keyboard && this.$separator.removeEventListener("keydown", this.keyboard.handle), this.$separator.removeEventListener("pointerdown", this.handlePointerdown), this.$separator.removeEventListener("pointermove", this.handlePointermove), this.$separator.removeEventListener("pointerup", this.handlePointerup), this.$separator.removeEventListener("pointercancel", this.handlePointerup), this.$separator.removeEventListener("lostpointercapture", this.handlePointerup), this.$separator.style.removeProperty("touch-action"), this.bound = !1), this.resizeObserver?.disconnect(), this.resizeObserver = null, this.keyboard = null, this.removeAttribute("dragging"), this.$separator = null;
	}
	attributeChangedCallback(e, t, i) {
		if (this.bound) {
			if (e === "data-windowsplitter-mode") {
				this.mode = f(i), this.sync();
				return;
			}
			if (e === "data-windowsplitter-step") {
				this.step = n(i, 1);
				return;
			}
			if (e === "data-windowsplitter-page") {
				this.page = n(i, 10);
				return;
			}
			e === "data-windowsplitter-fixed" && (this.fixed = r(i));
		}
	}
	get orientation() {
		return this.$separator?.getAttribute("aria-orientation") ?? null;
	}
	get $primary() {
		return (this.$separator?.ariaControlsElements ?? [])[0] ?? null;
	}
	get min() {
		return n(this.$separator?.getAttribute("aria-valuemin"), 0);
	}
	get max() {
		return n(this.$separator?.getAttribute("aria-valuemax"), 100);
	}
	get value() {
		return n(this.$separator?.getAttribute("aria-valuenow"), this.min);
	}
	set value(e) {
		this.setValue(e, !1);
	}
	get ratio() {
		let { min: e, max: t, value: n } = this, r = t - e;
		return r > 0 ? (n - e) / r : 0;
	}
	get disabled() {
		return this.hasAttribute("disabled") || this.getAttribute("aria-disabled") === "true" || this.$separator?.getAttribute("aria-disabled") === "true";
	}
	set disabled(e) {
		if (e) {
			this.setAttribute("disabled", ""), this.setAttribute("aria-disabled", "true"), this.$separator?.setAttribute("aria-disabled", "true");
			return;
		}
		this.removeAttribute("disabled"), this.removeAttribute("aria-disabled"), this.$separator?.removeAttribute("aria-disabled");
	}
	get collapsed() {
		return this.value === this.min;
	}
	sync() {
		this.$separator && (this.$separator.setAttribute("aria-valuetext", this.formatValue(this.value)), this.apply(this.value, !1));
	}
	setValue(e, t = !0) {
		if (!this.$separator || this.disabled) return !1;
		let n = this.value, r = c(Math.round(e), this.min, this.max), i = r !== n || !this.$separator.hasAttribute("aria-valuenow");
		return this.$separator.setAttribute("aria-valuenow", String(r)), this.$separator.setAttribute("aria-valuetext", this.formatValue(r)), this.apply(r, t && i), i;
	}
	collapse(e = !0) {
		return this.disabled || this.collapsed ? !1 : (this.history = this.value, this.setValue(this.min, e));
	}
	restore(e = !0) {
		if (this.disabled || !this.collapsed) return !1;
		let t = Math.round((this.min + this.max) / 2), n = this.history ?? t;
		return this.history = null, this.setValue(n, e);
	}
	toggle(e = !0) {
		return this.collapsed ? this.restore(e) : this.collapse(e);
	}
	read() {
		this.mode = f(this.getAttribute("data-windowsplitter-mode")), this.step = n(this.getAttribute("data-windowsplitter-step"), 1), this.page = n(this.getAttribute("data-windowsplitter-page"), 10), this.fixed = r(this.getAttribute("data-windowsplitter-fixed"));
	}
	observe() {
		this.resizeObserver?.disconnect(), this.resizeObserver = new ResizeObserver(() => this.apply(this.value, !1)), this.resizeObserver.observe(this);
	}
	apply(e, t) {
		if (!this.$separator) return;
		let { min: n, max: r } = this, i = Math.max(1, r - n), a = 0;
		if (this.drag && (a = this.drag.length), !this.drag) {
			let { width: e, height: t } = this.getBoundingClientRect();
			a = this.orientation === "vertical" ? e : t;
		}
		let o = Math.round((e - n) / i * a), s = (e - n) / i;
		this.style.setProperty("--windowsplitter-value", String(e)), this.style.setProperty("--windowsplitter-ratio", String(s)), this.style.setProperty("--windowsplitter-offset", `${o}px`), this.orientation === "vertical" ? this.$separator.style.setProperty("transform", `translate3d(${o}px, 0, 0)`) : this.$separator.style.setProperty("transform", `translate3d(0, ${o}px, 0)`), this.collapsed ? this.setAttribute("collapsed", "") : this.removeAttribute("collapsed"), this.update(e, s, a, o), this.emit(t, e, s);
	}
	update(e, t, n, r) {
		if (!this.$primary || this.mode === "none") return;
		if (this.mode === "clip") {
			let e = Math.max(0, n - r);
			this.orientation === "vertical" ? this.$primary.style.clipPath = `inset(0px ${e}px 0px 0px)` : this.$primary.style.clipPath = `inset(0px 0px ${e}px 0px)`;
			return;
		}
		let i = this.formatSize({
			value: e,
			ratio: t,
			offset: r,
			length: n
		});
		this.orientation === "vertical" ? this.$primary.style.width = i : this.$primary.style.height = i;
	}
	emit(n, r, i) {
		if (!n) return;
		let a = {
			value: r,
			min: this.min,
			max: this.max,
			ratio: i,
			collapsed: r === this.min
		};
		t(this, e.WINDOWSPLITTER_CHANGE, a, { cancelable: !1 });
	}
	valueFromPointer(e) {
		let { min: t, max: n, drag: r } = this;
		if (!r) return this.value;
		let i = n - t, a = this.orientation === "vertical" ? e.clientX : e.clientY, o = r.length > 0 ? (a - r.origin - r.offset) / r.length : 0;
		return c(Math.round(t + i * o), t, n);
	}
	handlePointerdown = (e) => {
		if (!this.$separator || this.disabled || e.button !== 0) return;
		if (this.$separator.focus({ preventScroll: !0 }), e.preventDefault(), this.fixed) {
			this.toggle();
			return;
		}
		let { left: t, top: n, width: r, height: i } = this.getBoundingClientRect(), a = this.orientation === "vertical", o = a ? r : i, s = a ? t : n, c = a ? e.clientX : e.clientY;
		this.drag = {
			length: o,
			origin: s,
			offset: c - s - this.ratio * o,
			id: e.pointerId
		}, this.setAttribute("dragging", ""), this.$separator.setPointerCapture(e.pointerId);
	};
	handlePointermove = (e) => {
		!this.drag || e.pointerId !== this.drag.id || (this.setValue(this.valueFromPointer(e)), e.preventDefault());
	};
	handlePointerup = (e) => {
		if (!this.drag || e.pointerId !== this.drag.id) return;
		let { id: t } = this.drag;
		this.drag = null, this.removeAttribute("dragging"), this.$separator?.hasPointerCapture?.(t) && this.$separator.releasePointerCapture(t);
	};
};
customElements.get("cinq-windowsplitter") || customElements.define("cinq-windowsplitter", p);
//#endregion
export { p as WindowSplitter };
