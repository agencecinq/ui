//#region ../utils/dist/index.js
var e = (e, t) => {
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, t = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, n = document.documentElement, { body: r } = document;
n.hasAttribute("data-debug"), window.addEventListener("pointermove", t(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var i = (e, t, n) => Math.min(Math.max(e, t), n), a = .01, o = 1, s = .1, c = "[data-scroll-column=\"left\"]", l = "[data-scroll-column=\"right\"]", u = class extends HTMLElement {
	static observedAttributes = ["spring"];
	#e = null;
	#t = null;
	#n = null;
	#r = null;
	#i = 0;
	#a = !1;
	#o = !1;
	#s = !1;
	#c = 0;
	#l = 0;
	#u = 0;
	#d = 0;
	#f = (e) => {
		this.#S(e.clientX, e.clientY) && (e.preventDefault(), this.#x(e.deltaY));
	};
	#p = (e) => {
		e.touches.length === 1 && (this.#o = !0, this.#c = e.touches[0].clientY, window.addEventListener("touchmove", this.#m, { passive: !1 }), window.addEventListener("touchend", this.#h, { passive: !0 }), window.addEventListener("touchcancel", this.#h, { passive: !0 }));
	};
	#m = (e) => {
		if (!this.#o || e.touches.length !== 1) return;
		let t = this.#c - e.touches[0].clientY;
		this.#c = e.touches[0].clientY, e.preventDefault(), this.#x(t);
	};
	#h = () => {
		this.#o = !1, window.removeEventListener("touchmove", this.#m), window.removeEventListener("touchend", this.#h), window.removeEventListener("touchcancel", this.#h);
	};
	#g = () => {
		this.sync();
	};
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.#e = null, this.#t = null;
	}
	attributeChangedCallback(e, t, n) {
		e === "spring" && this.#n && this.sync();
	}
	init() {
		if (!this.#n) {
			if (this.#e = this.querySelector(c), this.#t = this.querySelector(l), !this.#e || !this.#t) throw Error("DualScroll requires [data-scroll-column=\"left\"] and [data-scroll-column=\"right\"]");
			this.#a = !0, window.addEventListener("wheel", this.#f, { passive: !1 }), this.addEventListener("touchstart", this.#p, { passive: !0 }), this.#r = window.matchMedia("(prefers-reduced-motion: reduce)"), this.#r.addEventListener("change", this.#g), this.#n = new ResizeObserver(() => this.sync()), this.#n.observe(this), this.sync(), this.#i = requestAnimationFrame(this.#_);
		}
	}
	destroy() {
		this.#n &&= (this.#a = !1, this.#o = !1, this.#s = !1, this.#i &&= (cancelAnimationFrame(this.#i), 0), window.removeEventListener("wheel", this.#f), this.removeEventListener("touchstart", this.#p), this.#h(), this.#r?.removeEventListener("change", this.#g), this.#r = null, this.#n.disconnect(), null);
	}
	sync() {
		let e = this.clientHeight;
		if (e === 0) return;
		this.style.setProperty("--dual-scroll-pane-height", `${e}px`);
		let t = Math.max(this.#e?.children.length ?? 0, this.#t?.children.length ?? 0);
		this.#d = e + e * t, this.#u = i(this.#u, 0, this.#d), this.#s ||= (this.#u = e, this.#l = e, !0), this.#b() && (this.#l = this.#u), this.#v();
	}
	#_ = () => {
		if (!this.#a) return;
		let e = this.#y();
		this.#l += (this.#u - this.#l) * e, this.#l = Math.round(i(this.#l, -1, this.#d + 1)), this.#v(), this.#i = requestAnimationFrame(this.#_);
	};
	#v() {
		this.#t && (this.#t.style.transform = `translate3d(0, ${this.#l}px, 0)`), this.#e && (this.#e.style.transform = `translate3d(0, ${-this.#l}px, 0)`);
	}
	#y() {
		return this.#b() ? 1 : i(e(this.getAttribute("spring"), s), a, 1);
	}
	#b() {
		return this.#r?.matches ?? !1;
	}
	#x(e) {
		e !== 0 && this.#d !== 0 && (this.#u = Math.round(i(this.#u + e * -1, 0, this.#d)), this.#b() && (this.#l = this.#u, this.#v()));
	}
	#S(e, t) {
		let n = this.getBoundingClientRect();
		return e >= n.left && e <= n.right && t >= n.top && t <= n.bottom;
	}
};
customElements.get("cinq-dual-scroll") || customElements.define("cinq-dual-scroll", u);
//#endregion
export { u as DualScroll, s as SPRING_DEFAULT, o as SPRING_MAX, a as SPRING_MIN };
