import { clamp as e, parseNumber as t } from "@agencecinq/utils";
//#region src/types.ts
var n = 0, r = 256, i = class extends HTMLElement {
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
		return e(t(this.getAttribute("pixel"), 256), 0, 256);
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
customElements.get("cinq-pixelate") || customElements.define("cinq-pixelate", i);
//#endregion
export { r as PIXEL_MAX, n as PIXEL_MIN, i as Pixelate };
