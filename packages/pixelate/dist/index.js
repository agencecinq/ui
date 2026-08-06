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
var i = (e, t, n) => Math.min(Math.max(e, t), n), a = 0, o = 256, s = class extends HTMLElement {
	static observedAttributes = ["pixel"];
	$img = null;
	$canvas = null;
	#e = null;
	#t = null;
	#n = 0;
	#r = () => {
		this.#s(), this.sync();
	};
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$img = null, this.$canvas = null, this.#e = null;
	}
	attributeChangedCallback(e, t, n) {
		e === "pixel" && this.#t && this.sync();
	}
	init() {
		if (!this.#t) {
			if (this.$img = this.querySelector("img"), !this.$img) throw Error("Pixelate must contain an img element");
			if (this.$canvas = this.querySelector("canvas"), !this.$canvas) throw Error("Pixelate must contain a canvas element");
			this.#e = this.$canvas.getContext("2d"), this.$img.addEventListener("load", this.#r), this.$img.complete && this.#r(), this.#t = new ResizeObserver(() => {
				this.#s(), this.sync();
			}), this.#t.observe(this.$canvas), this.sync();
		}
	}
	destroy() {
		this.#t && (this.$img?.removeEventListener("load", this.#r), this.#t.disconnect(), this.#t = null, this.#i(), this.#e = null);
	}
	sync() {
		this.#n ||= requestAnimationFrame(() => {
			this.#n = 0, this.#u();
		});
	}
	#i() {
		this.#n &&= (cancelAnimationFrame(this.#n), 0);
	}
	#a() {
		return i(e(this.getAttribute("pixel"), 256), 0, 256);
	}
	#o() {
		let e = this.$canvas;
		return e ? {
			width: e.clientWidth,
			height: e.clientHeight
		} : {
			width: 0,
			height: 0
		};
	}
	#s() {
		if (!this.$canvas || !this.$img) return;
		let { width: e, height: t } = this.#o();
		if (e === 0 || t === 0) return;
		let n = this.#a(), r = this.#e;
		if (n <= 1) {
			let n = window.devicePixelRatio || 1, i = Math.round(e * n), a = Math.round(t * n);
			(this.$canvas.width !== i || this.$canvas.height !== a) && (this.$canvas.width = i, this.$canvas.height = a), r?.setTransform(n, 0, 0, n, 0, 0);
		} else {
			let i = Math.max(1, Math.ceil(e / n)), a = Math.max(1, Math.ceil(t / n));
			(this.$canvas.width !== i || this.$canvas.height !== a) && (this.$canvas.width = i, this.$canvas.height = a), r?.setTransform(1, 0, 0, 1, 0, 0);
		}
		this.#c(n);
	}
	#c(e) {
		if (e <= 1) {
			this.setAttribute("sharp", "");
			return;
		}
		this.removeAttribute("sharp");
	}
	#l(e, t) {
		let n = this.$img, r = n.naturalWidth, i = n.naturalHeight, a = Math.max(e / r, t / i), o = r * a, s = i * a, c = (e - o) / 2, l = (t - s) / 2;
		return {
			sx: Math.max(0, -c / a),
			sy: Math.max(0, -l / a),
			sw: e / a,
			sh: t / a
		};
	}
	#u() {
		if (!this.$canvas || !this.$img || !this.#e || !this.$img.complete) return;
		let { width: e, height: t } = this.#o();
		if (e === 0 || t === 0) return;
		this.#s();
		let n = this.#a(), r = this.#e, i = this.$img;
		if (n <= 1) {
			r.clearRect(0, 0, e, t);
			let { sx: n, sy: a, sw: o, sh: s } = this.#l(e, t);
			r.imageSmoothingEnabled = !0, r.drawImage(i, n, a, o, s, 0, 0, e, t);
			return;
		}
		let a = Math.max(1, Math.ceil(e / n)), o = Math.max(1, Math.ceil(t / n)), { sx: s, sy: c, sw: l, sh: u } = this.#l(e, t);
		r.clearRect(0, 0, a, o), r.imageSmoothingEnabled = !1, r.drawImage(i, s, c, l, u, 0, 0, a, o);
	}
};
customElements.get("cinq-pixelate") || customElements.define("cinq-pixelate", s);
//#endregion
export { o as PIXEL_MAX, a as PIXEL_MIN, s as Pixelate };
