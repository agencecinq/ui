import { EVENTS as e, clamp as t, dispatchEvent as n, parseNumber as r, trackDrag as i } from "@agencecinq/utils";
//#region src/geometry.ts
var a = (e, t, n) => {
	let r = n - t;
	return r > 0 ? (e - t) / r : 0;
}, o = (e, t, n) => t + e * (n - t), s = (e) => e.toString().split(".")[1]?.length ?? 0, c = (e, n, r, i) => {
	if (i <= 0) return t(e, n, r);
	let a = n + Math.round((e - n) / i) * i, o = Math.max(s(n), s(i));
	return t(Number(a.toFixed(o)), n, r);
}, l = (e, t) => Math.max(0, e - t), u = (e, t) => Math.max(0, e - 2 * t), d = (e, t, n, r) => r || n ? e === "min" ? t : 0 : e === "max" ? t : 0, f = (e, n, r, i, a) => {
	let o = a ? n.height : n.width, s = a ? n.top : n.left, c = l(o, r);
	if (c <= 0) return 0;
	let u = e - s - r / 2, d = t(u / c, 0, 1);
	return a || i ? 1 - d : d;
}, p = (e, n, r, i, a, o, s, c, l) => {
	let u = d(r, s, c, l), f = e - (l ? n.top : n.left) - u, p = t(f, 0, o), m = o > 0 ? p / o : 0, h = a - i;
	return l || c ? a - h * m : i + h * m;
}, m = class {
	#e;
	#t;
	#n;
	#r;
	constructor(e, t, n, r = !1) {
		this.#e = e, this.#t = t, this.#n = n, this.#r = r;
	}
	delta(e) {
		let t = this.#e, n = -this.#e, r = this.#t, i = -this.#t;
		if (this.#r) {
			let r = {
				ArrowUp: t,
				ArrowDown: n,
				ArrowRight: t,
				ArrowLeft: n
			};
			if (e in r) return {
				delta: r[e],
				preventDefault: !0
			};
		} else {
			let r = this.#n ? {
				ArrowLeft: t,
				ArrowRight: n,
				ArrowUp: t,
				ArrowDown: n
			} : {
				ArrowRight: t,
				ArrowLeft: n,
				ArrowUp: t,
				ArrowDown: n
			};
			if (e in r) return {
				delta: r[e],
				preventDefault: !0
			};
		}
		return e === "PageUp" ? {
			delta: r,
			preventDefault: !0
		} : e === "PageDown" ? {
			delta: i,
			preventDefault: !0
		} : e === "Home" || e === "End" ? {
			delta: 0,
			preventDefault: !0
		} : null;
	}
	static isHome(e) {
		return e === "Home";
	}
	static isEnd(e) {
		return e === "End";
	}
}, h = class extends HTMLElement {
	static observedAttributes = ["data-step", "data-page"];
	step = 1;
	page = 10;
	#e;
	#t = null;
	#n = /* @__PURE__ */ new Map();
	#r = null;
	onThumbFocus(e) {}
	get formatValue() {
		return this.#e;
	}
	set formatValue(e) {
		this.#e = e, this.syncValuetext();
	}
	get isRtl() {
		return getComputedStyle(this).direction === "rtl";
	}
	get isVertical() {
		return this.orientation === "vertical";
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	attributeChangedCallback(e, t, n) {
		e === "data-step" ? this.step = r(n, 1) : e === "data-page" && (this.page = r(n, 10));
	}
	rect() {
		return this.getBoundingClientRect();
	}
	observeResize() {
		this.#t?.disconnect(), this.#t = new ResizeObserver(() => {
			this.sync();
		}), this.#t.observe(this);
	}
	disconnectResize() {
		this.#t?.disconnect(), this.#t = null;
	}
	setValuetext(e, t) {
		let n = this.formatValue ? this.formatValue(t) : String(t);
		e.setAttribute("aria-valuetext", n);
	}
	bindThumb(e) {
		e.tabIndex < 0 && !e.hasAttribute("tabindex") && (e.tabIndex = 0), e.style.touchAction = "none", e.addEventListener("keydown", this.#i), this.#n.set(e, i(e, {
			host: this,
			start: this.#o,
			move: this.#s,
			end: this.#c
		})), e.addEventListener("focus", this.#a);
	}
	unbindThumb(e) {
		e.removeEventListener("keydown", this.#i), this.#n.get(e)?.destroy(), this.#n.delete(e), e.removeEventListener("focus", this.#a), e.style.removeProperty("touch-action");
	}
	clearDragState() {
		this.#n.forEach((e) => e.cancel()), this.#r = null;
	}
	#i = (e) => {
		this.onKeydown(e);
	};
	#a = (e) => {
		this.onThumbFocus(e);
	};
	#o = (e) => {
		let t = e.currentTarget, { clientY: n, clientX: r } = e;
		t.focus({ preventScroll: !0 }), e.preventDefault();
		let { top: i, left: a, width: o, height: s } = t.getBoundingClientRect(), c = a + o / 2 - r;
		this.isVertical && (c = i + s / 2 - n), this.#r = {
			offset: c,
			$thumb: t
		}, this.commitPointerValue(e, t);
	};
	#s = (e) => {
		this.#r && (this.commitPointerValue(e, this.#r.$thumb), e.preventDefault());
	};
	#c = () => {
		this.#r = null;
	};
	get offset() {
		return this.#r?.offset ?? 0;
	}
}, g = class extends h {
	$thumb = null;
	get orientation() {
		return this.$thumb?.getAttribute("aria-orientation") ?? null;
	}
	get min() {
		return r(this.$thumb?.getAttribute("aria-valuemin"), 0);
	}
	get max() {
		return r(this.$thumb?.getAttribute("aria-valuemax"), 100);
	}
	get value() {
		return r(this.$thumb?.getAttribute("aria-valuenow"), this.min);
	}
	get ratio() {
		return a(this.value, this.min, this.max);
	}
	init() {
		let e = this.querySelectorAll("[role=\"slider\"]");
		if (e.length !== 1) throw Error("cinq-slider: exactly one [role=\"slider\"] thumb is required");
		this.$thumb = e[0], this.step = r(this.getAttribute("data-step"), 1), this.page = r(this.getAttribute("data-page"), 10), this.bindThumb(this.$thumb), this.observeResize(), this.sync();
	}
	destroy() {
		this.$thumb && this.unbindThumb(this.$thumb), this.disconnectResize(), this.clearDragState(), this.$thumb = null;
	}
	syncValuetext() {
		this.$thumb && this.setValuetext(this.$thumb, this.value);
	}
	sync() {
		this.#e(this.value, !1);
	}
	setValue(e, t = {}) {
		let { emit: n = !0 } = t, r = c(e, this.min, this.max, this.step);
		this.#e(r, n);
	}
	valueFromPointer(e, t) {
		let { clientY: n, clientX: r } = e, i = this.getBoundingClientRect(), { min: a, max: s } = this, { offsetHeight: c, offsetWidth: l } = t, u = this.isVertical;
		return o(f((u ? n : r) + this.offset, i, u ? c : l, this.isRtl, u), a, s);
	}
	commitPointerValue(e, t) {
		this.setValue(this.valueFromPointer(e, t));
	}
	onKeydown(e) {
		if (!this.$thumb) return;
		let { key: t } = e;
		if (m.isHome(t)) {
			e.preventDefault(), this.setValue(this.min);
			return;
		}
		if (m.isEnd(t)) {
			e.preventDefault(), this.setValue(this.max);
			return;
		}
		let n = new m(this.step, this.page, this.isRtl, this.isVertical).delta(t);
		if (!n) return;
		let { preventDefault: r, delta: i } = n;
		r && e.preventDefault(), i !== 0 && this.setValue(this.value + i);
	}
	#e(t, r) {
		if (!this.$thumb) return;
		let { min: i, max: o } = this, s = a(t, i, o);
		this.$thumb.setAttribute("aria-valuenow", String(t)), this.setValuetext(this.$thumb, t), this.style.setProperty("--value", String(t)), this.style.setProperty("--ratio", String(s)), r && n(this, e.SLIDER_CHANGE, {
			min: t,
			max: t,
			$thumb: this.$thumb
		}, { cancelable: !1 });
	}
};
customElements.get("cinq-slider") || customElements.define("cinq-slider", g);
//#endregion
//#region src/slider-range.ts
var _ = class extends h {
	$max = null;
	$min = null;
	#e = "min";
	#t = 0;
	#n = 100;
	get boundsMin() {
		return this.#t;
	}
	get boundsMax() {
		return this.#n;
	}
	get min() {
		return r(this.$min?.getAttribute("aria-valuenow"), this.#t);
	}
	get max() {
		return r(this.$max?.getAttribute("aria-valuenow"), this.#n);
	}
	get orientation() {
		return this.$max?.getAttribute("aria-orientation") ?? null;
	}
	init() {
		let e = [...this.querySelectorAll("[role=\"slider\"]")];
		if (e.length !== 2) throw Error("cinq-slider-range: exactly two [role=\"slider\"] thumbs are required");
		let [t, n] = e;
		this.$max = t, this.$min = n, this.step = r(this.getAttribute("data-step"), 1), this.page = r(this.getAttribute("data-page"), 10), this.#t = r(this.$max.getAttribute("aria-valuemin"), 0), this.#n = r(this.$max.getAttribute("aria-valuemax"), 100), this.bindThumb(this.$max), this.bindThumb(this.$min), this.observeResize(), this.sync();
	}
	destroy() {
		for (let e of [this.$max, this.$min]) e && this.unbindThumb(e);
		this.disconnectResize(), this.clearDragState(), this.removeAttribute("data-active"), this.removeAttribute("data-collapsed"), this.$max = null, this.$min = null;
	}
	syncValuetext() {
		this.$min && this.setValuetext(this.$min, this.min), this.$max && this.setValuetext(this.$max, this.max);
	}
	sync() {
		this.#a(this.min, this.max, this.#e, !1);
	}
	setValues(e, t, n = {}) {
		let { active: r = this.#e, emit: i = !0 } = n;
		this.#a(e, t, r, i);
	}
	onThumbFocus(e) {
		let t = this.#r(e.currentTarget);
		t && (this.#e = t, this.setAttribute("data-active", t));
	}
	valueFromPointer(e, t) {
		let { clientY: n, clientX: r } = e, { offsetHeight: i, offsetWidth: a } = t, o = t === this.$min ? "min" : "max", s = this.isVertical ? i : a;
		return p((this.isVertical ? n : r) + this.offset - s / 2, this.getBoundingClientRect(), o, this.#t, this.#n, this.#i(s), s, this.isRtl, this.isVertical);
	}
	commitPointerValue(e, t) {
		let n = this.valueFromPointer(e, t);
		(t === this.$min ? "min" : "max") == "min" ? this.setValues(n, this.max, { active: "min" }) : this.setValues(this.min, n, { active: "max" });
	}
	onKeydown(e) {
		let t = this.#r(e.currentTarget);
		if (!t) return;
		this.#e = t;
		let { key: n } = e, r = t === "min" ? this.min : this.max;
		if (m.isHome(n)) {
			e.preventDefault();
			let n = t === "min" ? this.#t : this.min;
			t === "min" ? this.setValues(n, this.max, { active: "min" }) : this.setValues(this.min, n, { active: "max" });
			return;
		}
		if (m.isEnd(n)) {
			e.preventDefault();
			let n = t === "max" ? this.#n : this.max;
			t === "min" ? this.setValues(n, this.max, { active: "min" }) : this.setValues(this.min, n, { active: "max" });
			return;
		}
		let i = new m(this.step, this.page, this.isRtl, this.isVertical).delta(n);
		if (!i) return;
		let { delta: a } = i;
		a !== 0 && (e.preventDefault(), t === "min" ? this.setValues(r + a, this.max, { active: "min" }) : this.setValues(this.min, r + a, { active: "max" }));
	}
	#r(e) {
		return e === this.$min ? "min" : e === this.$max ? "max" : null;
	}
	#i(e) {
		return u(this.isVertical ? this.clientHeight : this.clientWidth, e);
	}
	#a(t, r, i, o) {
		if (!this.$min || !this.$max) return;
		let s = this.#t, l = this.#n, u = c(t, s, l, this.step), d = c(r, s, l, this.step);
		i === "min" ? u = Math.min(u, d) : d = Math.max(d, u), this.#e = i, this.setAttribute("data-active", i), this.$min.setAttribute("aria-valuenow", String(u)), this.$max.setAttribute("aria-valuenow", String(d)), this.$min.setAttribute("aria-valuemax", String(d)), this.$max.setAttribute("aria-valuemin", String(u)), this.setValuetext(this.$min, u), this.setValuetext(this.$max, d);
		let f = a(u, s, l), p = a(d, s, l);
		if (this.style.setProperty("--min", String(u)), this.style.setProperty("--max", String(d)), this.style.setProperty("--min-ratio", String(f)), this.style.setProperty("--max-ratio", String(p)), u === d ? this.setAttribute("data-collapsed", "") : this.removeAttribute("data-collapsed"), o) {
			let t = i === "min" ? this.$min : this.$max;
			n(this, e.SLIDER_CHANGE, {
				min: u,
				max: d,
				$thumb: t
			}, { cancelable: !1 });
		}
	}
};
customElements.get("cinq-slider-range") || customElements.define("cinq-slider-range", _);
//#endregion
export { g as Slider, _ as SliderRange };
