//#region ../utils/dist/index.js
var e = {
	DRAWER_BEFORE_CLOSE: "drawer:before-close",
	DRAWER_BEFORE_OPEN: "drawer:before-open",
	SHEET_BEFORE_CLOSE: "sheet:before-close",
	SHEET_BEFORE_OPEN: "sheet:before-open",
	MODAL_BEFORE_CLOSE: "modal:before-close",
	MODAL_BEFORE_OPEN: "modal:before-open",
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
a.hasAttribute("data-debug"), window.addEventListener("pointermove", i(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var s = (e, t, n) => Math.min(Math.max(e, t), n), c = 50, l = (e, t = {}) => {
	let { host: n, target: r, start: i, move: a, end: o } = t, s = null, l = ({ startX: e, startY: t, samples: n }) => {
		let r = n[0], i = n[n.length - 1], a = i.time - r.time, o = {
			dx: i.x - e,
			dy: i.y - t,
			vx: 0,
			vy: 0
		};
		return a <= 0 ? o : {
			...o,
			vx: (i.x - r.x) / a,
			vy: (i.y - r.y) / a
		};
	}, u = ({ samples: e }, { clientX: t, clientY: n, timeStamp: r }) => {
		let i = r - c;
		for (e.push({
			x: t,
			y: n,
			time: r
		}); e.length > 1 && e[0].time < i;) e.shift();
	}, d = (e) => {
		let { pointerId: t, $target: r } = e;
		s = null, n?.removeAttribute("dragging"), r.hasPointerCapture(t) && r.releasePointerCapture(t);
	}, f = (e) => {
		let { button: t, pointerId: a, clientX: o, clientY: c, timeStamp: l } = e;
		if (s || t !== 0) return;
		let u = r ? r(e) : e.currentTarget;
		if (!u) return;
		let f = {
			pointerId: a,
			$target: u,
			startX: o,
			startY: c,
			samples: [{
				x: o,
				y: c,
				time: l
			}]
		};
		s = f, n?.setAttribute("dragging", ""), u.setPointerCapture(a), i?.(e) === !1 && d(f);
	}, p = (e) => {
		let t = s;
		t && e.pointerId === t.pointerId && (u(t, e), a?.(e, l(t)));
	}, m = (e) => {
		let t = s, { pointerId: n, type: r } = e;
		if (!t || n !== t.pointerId) return;
		let i = r !== "pointerup";
		i || u(t, e);
		let a = {
			...l(t),
			canceled: i
		};
		d(t), o?.(e, a);
	}, h = [
		["pointerdown", f],
		["pointermove", p],
		["pointerup", m],
		["pointercancel", m],
		["lostpointercapture", m]
	];
	h.forEach(([t, n]) => {
		e.addEventListener(t, n);
	});
	let g = () => {
		s && d(s);
	};
	return {
		cancel: g,
		destroy: () => {
			g(), h.forEach(([t, n]) => {
				e.removeEventListener(t, n);
			});
		}
	};
}, u = class {
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
}, d = ({ ratio: e }) => `${e * 100}%`, f = (e) => String(e), p = (e) => e === "clip" || e === "none" || e === "resize" ? e : "resize", m = class extends HTMLElement {
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
	formatSize = d;
	formatValue = f;
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
		this.#o(), this.$separator.style.touchAction = "none", this.#n = new u(this), this.$separator.addEventListener("keydown", this.#n.handle), this.$separator.addEventListener("pointerdown", this.#p), this.#i = l(this.$separator, {
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
	attributeChangedCallback(e, t, i) {
		this.#r && (e === "data-mode" ? (this.mode = p(i), this.sync()) : e === "data-step" ? this.step = n(i, 1) : e === "data-page" ? this.page = n(i, 10) : e === "data-fixed" && (this.fixed = r(i)));
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
		e ? (this.setAttribute("disabled", ""), this.setAttribute("aria-disabled", "true"), this.$separator?.setAttribute("aria-disabled", "true")) : (this.removeAttribute("disabled"), this.removeAttribute("aria-disabled"), this.$separator?.removeAttribute("aria-disabled"));
	}
	get collapsed() {
		return this.value === this.min;
	}
	sync() {
		this.$separator && (this.$separator.setAttribute("aria-valuetext", this.formatValue(this.value)), this.#c(this.value, !1));
	}
	setValue(e, t = !0) {
		if (!this.$separator || this.disabled) return !1;
		let n = this.value, r = s(Math.round(e), this.min, this.max), i = r !== n || !this.$separator.hasAttribute("aria-valuenow");
		return this.$separator.setAttribute("aria-valuenow", String(r)), this.$separator.setAttribute("aria-valuetext", this.formatValue(r)), this.#c(r, t && i), i;
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
		this.mode = p(this.getAttribute("data-mode")), this.step = n(this.getAttribute("data-step"), 1), this.page = n(this.getAttribute("data-page"), 10), this.fixed = r(this.getAttribute("data-fixed"));
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
	#u(n, r, i) {
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
	#d({ dx: e, dy: t }) {
		let { min: n, max: r } = this, i = this.#a;
		if (!i) return this.value;
		let a = this.orientation === "vertical" ? e : t, o = i.length > 0 ? i.ratio + a / i.length : 0;
		return s(Math.round(n + (r - n) * o), n, r);
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
customElements.get("cinq-windowsplitter") || customElements.define("cinq-windowsplitter", m);
//#endregion
export { m as WindowSplitter };
