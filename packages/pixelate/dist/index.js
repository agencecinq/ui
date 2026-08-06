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
	#r = this.sync.bind(this);
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
			this.#e = this.$canvas.getContext("2d"), this.$img.addEventListener("load", this.#r), this.$img.complete && this.sync(), this.#t = new ResizeObserver(() => this.sync()), this.#t.observe(this.$canvas), this.sync();
		}
	}
	destroy() {
		this.#t && (this.$img?.removeEventListener("load", this.#r), this.#t.disconnect(), this.#t = null, this.#i(), this.#e = null);
	}
	sync() {
		this.#n ||= requestAnimationFrame(() => {
			this.#n = 0, this.#l();
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
	#s(e, t) {
		let n = this.$img, r = n.naturalWidth, i = n.naturalHeight, a = Math.max(e / r, t / i), o = r * a, s = i * a, c = (e - o) / 2, l = (t - s) / 2;
		return {
			sx: Math.max(0, -c / a),
			sy: Math.max(0, -l / a),
			sw: e / a,
			sh: t / a
		};
	}
	#c(e, t, n, r, i, a) {
		let o = this.$canvas, s = this.$img, c = this.#e, l = window.devicePixelRatio || 1, u = Math.round(e * l), d = Math.round(t * l);
		(o.width !== u || o.height !== d) && (o.width = u, o.height = d), c.setTransform(l, 0, 0, l, 0, 0), c.clearRect(0, 0, e, t), c.imageSmoothingEnabled = !0, c.drawImage(s, n, r, i, a, 0, 0, e, t);
	}
	#l() {
		let e = this.$canvas, t = this.$img, n = this.#e;
		if (!e || !t || !n || !t.complete) return;
		let { width: r, height: i } = this.#o();
		if (r === 0 || i === 0) return;
		let a = this.#a(), { sx: o, sy: s, sw: c, sh: l } = this.#s(r, i);
		if (a <= 1) {
			this.#c(r, i, o, s, c, l);
			return;
		}
		let u = Math.max(1, Math.ceil(r / a)), d = Math.max(1, Math.ceil(i / a));
		(e.width !== u || e.height !== d) && (e.width = u, e.height = d), n.setTransform(1, 0, 0, 1, 0, 0), n.clearRect(0, 0, u, d), n.imageSmoothingEnabled = !1, n.drawImage(t, o, s, c, l, 0, 0, u, d);
	}
};
customElements.get("cinq-pixelate") || customElements.define("cinq-pixelate", s);
//#endregion
export { o as PIXEL_MAX, a as PIXEL_MIN, s as Pixelate };
