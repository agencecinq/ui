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
		let { clientWidth: e, clientHeight: t } = this.$canvas;
		return {
			width: e,
			height: t
		};
	}
	#s(e, t) {
		let n = this.$img.naturalWidth, r = this.$img.naturalHeight, i = Math.max(e / n, t / r), a = n * i, o = r * i, s = (e - a) / 2, c = (t - o) / 2;
		return {
			sx: Math.max(0, -s / i),
			sy: Math.max(0, -c / i),
			sw: e / i,
			sh: t / i
		};
	}
	#c(e, t, n, r, i, a) {
		let o = window.devicePixelRatio || 1, s = Math.round(e * o), c = Math.round(t * o);
		(this.$canvas.width !== s || this.$canvas.height !== c) && (this.$canvas.width = s, this.$canvas.height = c), this.#e.setTransform(o, 0, 0, o, 0, 0), this.#e.clearRect(0, 0, e, t), this.#e.imageSmoothingEnabled = !0, this.#e.drawImage(this.$img, n, r, i, a, 0, 0, e, t);
	}
	#l() {
		if (!this.$canvas || !this.$img || !this.#e || !this.$img.complete) return;
		let { width: e, height: t } = this.#o();
		if (e === 0 || t === 0) return;
		let n = this.#a(), { sx: r, sy: i, sw: a, sh: o } = this.#s(e, t);
		if (n <= 1) {
			this.#c(e, t, r, i, a, o);
			return;
		}
		let s = Math.max(1, Math.ceil(e / n)), c = Math.max(1, Math.ceil(t / n));
		(this.$canvas.width !== s || this.$canvas.height !== c) && (this.$canvas.width = s, this.$canvas.height = c), this.#e.setTransform(1, 0, 0, 1, 0, 0), this.#e.clearRect(0, 0, s, c), this.#e.imageSmoothingEnabled = !1, this.#e.drawImage(this.$img, r, i, a, o, 0, 0, s, c);
	}
};
customElements.get("cinq-pixelate") || customElements.define("cinq-pixelate", s);
//#endregion
export { o as PIXEL_MAX, a as PIXEL_MIN, s as Pixelate };
