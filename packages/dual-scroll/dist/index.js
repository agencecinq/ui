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
	#r = 0;
	#i = !1;
	#a = !1;
	#o = !1;
	#s = 0;
	#c = 0;
	#l = 0;
	#u = 0;
	#d = (e) => {
		this.#y(e.clientX, e.clientY) && (e.preventDefault(), this.#v(e.deltaY));
	};
	#f = (e) => {
		e.touches.length === 1 && (this.#a = !0, this.#s = e.touches[0].clientY, window.addEventListener("touchmove", this.#p, { passive: !1 }), window.addEventListener("touchend", this.#m, { passive: !0 }), window.addEventListener("touchcancel", this.#m, { passive: !0 }));
	};
	#p = (e) => {
		if (!this.#a || e.touches.length !== 1) return;
		let t = this.#s - e.touches[0].clientY;
		this.#s = e.touches[0].clientY, e.preventDefault(), this.#v(t);
	};
	#m = () => {
		this.#a = !1, window.removeEventListener("touchmove", this.#p), window.removeEventListener("touchend", this.#m), window.removeEventListener("touchcancel", this.#m);
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
			this.#i = !0, window.addEventListener("wheel", this.#d, { passive: !1 }), this.addEventListener("touchstart", this.#f, { passive: !0 }), this.#n = new ResizeObserver(() => this.sync()), this.#n.observe(this), this.sync(), this.#r = requestAnimationFrame(this.#h);
		}
	}
	destroy() {
		this.#n &&= (this.#i = !1, this.#a = !1, this.#o = !1, this.#r &&= (cancelAnimationFrame(this.#r), 0), window.removeEventListener("wheel", this.#d), this.removeEventListener("touchstart", this.#f), this.#m(), this.#n.disconnect(), null);
	}
	sync() {
		let e = this.clientHeight;
		if (e === 0) return;
		this.style.setProperty("--dual-scroll-pane-height", `${e}px`);
		let t = Math.max(this.#e?.children.length ?? 0, this.#t?.children.length ?? 0);
		this.#u = e + e * t, this.#l = i(this.#l, 0, this.#u), this.#o ||= (this.#l = e, this.#c = e, !0), this.#g();
	}
	#h = () => {
		if (!this.#i) return;
		let e = this.#_();
		this.#c += (this.#l - this.#c) * e, this.#c = Math.round(i(this.#c, -1, this.#u + 1)), this.#g(), this.#r = requestAnimationFrame(this.#h);
	};
	#g() {
		this.#t && (this.#t.style.transform = `translate3d(0, ${this.#c}px, 0)`), this.#e && (this.#e.style.transform = `translate3d(0, ${-this.#c}px, 0)`);
	}
	#_() {
		return i(e(this.getAttribute("spring"), s), a, 1);
	}
	#v(e) {
		e !== 0 && this.#u !== 0 && (this.#l = Math.round(i(this.#l + e * -1, 0, this.#u)));
	}
	#y(e, t) {
		let n = this.getBoundingClientRect();
		return e >= n.left && e <= n.right && t >= n.top && t <= n.bottom;
	}
};
customElements.get("cinq-dual-scroll") || customElements.define("cinq-dual-scroll", u);
//#endregion
export { u as DualScroll, s as SPRING_DEFAULT, o as SPRING_MAX, a as SPRING_MIN };
