import { EVENTS as e, clamp as t, dispatchEvent as n, parseBoolean as r, parseNumber as i, trackDrag as a } from "@agencecinq/utils";
//#region src/keyboard.ts
var o = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	handle = (e) => {
		let t = this.#e;
		if (t.disabled) return;
		let { key: n, shiftKey: r } = e, i = r ? t.page : t.step, a = t.value, o = t.orientation === "vertical", s = (n) => {
			t.setValue(n), e.preventDefault();
		};
		if (n === "Enter") t.toggle(), e.preventDefault();
		else if (!t.fixed) {
			if (n === "Home") s(t.min);
			else if (n === "End") s(t.max);
			else if (n === "PageUp") s(a + t.page);
			else if (n === "PageDown") s(a - t.page);
			else if (o) {
				if (n === "ArrowLeft") {
					s(a - i);
					return;
				}
				if (n === "ArrowRight") {
					s(a + i);
					return;
				}
			} else n === "ArrowUp" ? s(a - i) : n === "ArrowDown" && s(a + i);
		}
	};
}, s = ({ ratio: e }) => `${e * 100}%`, c = (e) => String(e), l = (e) => e === "clip" || e === "none" || e === "resize" ? e : "resize", u = class extends HTMLElement {
	static observedAttributes = [
		"data-mode",
		"data-step",
		"data-page",
		"data-fixed"
	];
	$separator = null;
	mode = "resize";
	step = 1;
	page = 10;
	fixed = !1;
	formatSize = s;
	formatValue = c;
	#e = null;
	#t = null;
	#n = null;
	#r = !1;
	#i = null;
	#a = null;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		if (this.$separator = this.querySelector("[role=\"separator\"], [role=\"slider\"]"), !this.$separator) throw Error("cinq-windowsplitter: nested [role=\"separator\"] or [role=\"slider\"] not found");
		this.#o(), this.$separator.style.touchAction = "none", this.#n = new o(this), this.$separator.addEventListener("keydown", this.#n.handle), this.$separator.addEventListener("pointerdown", this.#p), this.#i = a(this.$separator, {
			host: this,
			target: this.#f,
			start: this.#m,
			move: this.#h,
			end: this.#g
		}), this.#r = !0, this.#s(), this.sync();
	}
	destroy() {
		this.#r && this.$separator && (this.#n && this.$separator.removeEventListener("keydown", this.#n.handle), this.$separator.removeEventListener("pointerdown", this.#p), this.$separator.style.removeProperty("touch-action"), this.#r = !1), this.#i?.destroy(), this.#i = null, this.#a = null, this.#t?.disconnect(), this.#t = null, this.#n = null, this.$separator = null;
	}
	attributeChangedCallback(e, t, n) {
		this.#r && (e === "data-mode" ? (this.mode = l(n), this.sync()) : e === "data-step" ? this.step = i(n, 1) : e === "data-page" ? this.page = i(n, 10) : e === "data-fixed" && (this.fixed = r(n)));
	}
	get orientation() {
		return this.$separator?.getAttribute("aria-orientation") ?? null;
	}
	get $primary() {
		return (this.$separator?.ariaControlsElements ?? [])[0] ?? null;
	}
	get min() {
		return i(this.$separator?.getAttribute("aria-valuemin"), 0);
	}
	get max() {
		return i(this.$separator?.getAttribute("aria-valuemax"), 100);
	}
	get value() {
		return i(this.$separator?.getAttribute("aria-valuenow"), this.min);
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
		e ? (this.setAttribute("disabled", ""), this.setAttribute("aria-disabled", "true"), this.$separator?.setAttribute("aria-disabled", "true")) : (this.removeAttribute("disabled"), this.removeAttribute("aria-disabled"), this.$separator?.removeAttribute("aria-disabled"));
	}
	get collapsed() {
		return this.value === this.min;
	}
	sync() {
		this.$separator && (this.$separator.setAttribute("aria-valuetext", this.formatValue(this.value)), this.#c(this.value, !1));
	}
	setValue(e, n = !0) {
		if (!this.$separator || this.disabled) return !1;
		let r = this.value, i = t(Math.round(e), this.min, this.max), a = i !== r || !this.$separator.hasAttribute("aria-valuenow");
		return this.$separator.setAttribute("aria-valuenow", String(i)), this.$separator.setAttribute("aria-valuetext", this.formatValue(i)), this.#c(i, n && a), a;
	}
	collapse(e = !0) {
		return this.disabled || this.collapsed ? !1 : (this.#e = this.value, this.setValue(this.min, e));
	}
	restore(e = !0) {
		if (this.disabled || !this.collapsed) return !1;
		let t = Math.round((this.min + this.max) / 2), n = this.#e ?? t;
		return this.#e = null, this.setValue(n, e);
	}
	toggle(e = !0) {
		return this.collapsed ? this.restore(e) : this.collapse(e);
	}
	#o() {
		this.mode = l(this.getAttribute("data-mode")), this.step = i(this.getAttribute("data-step"), 1), this.page = i(this.getAttribute("data-page"), 10), this.fixed = r(this.getAttribute("data-fixed"));
	}
	#s() {
		this.#t?.disconnect(), this.#t = new ResizeObserver(() => this.#c(this.value, !1)), this.#t.observe(this);
	}
	#c(e, t) {
		if (!this.$separator) return;
		let { min: n, max: r } = this, i = Math.max(1, r - n), a = 0;
		if (this.#a && (a = this.#a.length), !this.#a) {
			let { width: e, height: t } = this.getBoundingClientRect();
			a = this.orientation === "vertical" ? e : t;
		}
		let o = Math.round((e - n) / i * a), s = (e - n) / i;
		this.style.setProperty("--value", String(e)), this.style.setProperty("--ratio", String(s)), this.style.setProperty("--offset", `${o}px`), this.orientation === "vertical" ? this.$separator.style.setProperty("transform", `translate3d(${o}px, 0, 0)`) : this.$separator.style.setProperty("transform", `translate3d(0, ${o}px, 0)`), this.collapsed ? this.setAttribute("collapsed", "") : this.removeAttribute("collapsed"), this.#l(e, s, a, o), this.#u(t, e, s);
	}
	#l(e, t, n, r) {
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
	#u(t, r, i) {
		if (!t) return;
		let a = {
			value: r,
			min: this.min,
			max: this.max,
			ratio: i,
			collapsed: r === this.min
		};
		n(this, e.WINDOWSPLITTER_CHANGE, a, { cancelable: !1 });
	}
	#d({ dx: e, dy: n }) {
		let { min: r, max: i } = this, a = this.#a;
		if (!a) return this.value;
		let o = this.orientation === "vertical" ? e : n, s = a.length > 0 ? a.ratio + o / a.length : 0;
		return t(Math.round(r + (i - r) * s), r, i);
	}
	#f = () => this.disabled || this.fixed ? null : this.$separator;
	#p = (e) => {
		this.$separator && this.fixed && !this.disabled && e.button === 0 && (this.$separator.focus({ preventScroll: !0 }), e.preventDefault(), this.toggle());
	};
	#m = (e) => {
		let { width: t, height: n } = this.getBoundingClientRect();
		this.$separator?.focus({ preventScroll: !0 }), e.preventDefault(), this.#a = {
			ratio: this.ratio,
			length: this.orientation === "vertical" ? t : n
		};
	};
	#h = (e, t) => {
		this.setValue(this.#d(t)), e.preventDefault();
	};
	#g = () => {
		this.#a = null;
	};
};
customElements.get("cinq-windowsplitter") || customElements.define("cinq-windowsplitter", u);
//#endregion
export { u as WindowSplitter };
