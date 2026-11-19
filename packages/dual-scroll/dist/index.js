import { clamp as e, parseNumber as t } from "@agencecinq/utils";
//#region src/types.ts
var n = .01, r = 1, i = .1, a = "[data-scroll-column=\"left\"]", o = "[data-scroll-column=\"right\"]", s = class extends HTMLElement {
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
		if (e.touches.length !== 1) return;
		let t = e.touches[0];
		this.#y(t.clientX, t.clientY) && (this.#a = !0, this.#s = t.clientY, e.preventDefault());
	};
	#p = (e) => {
		if (!this.#a || e.touches.length !== 1) return;
		let t = this.#s - e.touches[0].clientY;
		this.#s = e.touches[0].clientY, e.preventDefault(), this.#v(t);
	};
	#m = () => {
		this.#a = !1;
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
			if (this.#e = this.querySelector(a), this.#t = this.querySelector(o), !this.#e || !this.#t) throw Error("DualScroll requires [data-scroll-column=\"left\"] and [data-scroll-column=\"right\"]");
			this.#i = !0, window.addEventListener("wheel", this.#d, { passive: !1 }), this.addEventListener("touchstart", this.#f, { passive: !1 }), document.addEventListener("touchmove", this.#p, {
				passive: !1,
				capture: !0
			}), document.addEventListener("touchend", this.#m, {
				passive: !0,
				capture: !0
			}), document.addEventListener("touchcancel", this.#m, {
				passive: !0,
				capture: !0
			}), this.#n = new ResizeObserver(() => this.sync()), this.#n.observe(this), this.sync(), this.#r = requestAnimationFrame(this.#h);
		}
	}
	destroy() {
		this.#n &&= (this.#i = !1, this.#a = !1, this.#o = !1, this.#r &&= (cancelAnimationFrame(this.#r), 0), window.removeEventListener("wheel", this.#d), this.removeEventListener("touchstart", this.#f), document.removeEventListener("touchmove", this.#p, { capture: !0 }), document.removeEventListener("touchend", this.#m, { capture: !0 }), document.removeEventListener("touchcancel", this.#m, { capture: !0 }), this.#a = !1, this.#n.disconnect(), null);
	}
	sync() {
		let t = this.clientHeight;
		if (t === 0) return;
		this.style.setProperty("--dual-scroll-pane-height", `${t}px`);
		let n = Math.max(this.#e?.children.length ?? 0, this.#t?.children.length ?? 0);
		this.#u = t + t * n, this.#l = e(this.#l, 0, this.#u), this.#o ||= (this.#l = t, this.#c = t, !0), this.#g();
	}
	#h = () => {
		if (!this.#i) return;
		let t = this.#_();
		this.#c += (this.#l - this.#c) * t, this.#c = Math.round(e(this.#c, -1, this.#u + 1)), this.#g(), this.#r = requestAnimationFrame(this.#h);
	};
	#g() {
		this.#t && (this.#t.style.transform = `translate3d(0, ${this.#c}px, 0)`), this.#e && (this.#e.style.transform = `translate3d(0, ${-this.#c}px, 0)`);
	}
	#_() {
		return e(t(this.getAttribute("spring"), i), n, 1);
	}
	#v(t) {
		t !== 0 && this.#u !== 0 && (this.#l = Math.round(e(this.#l + t * -1, 0, this.#u)));
	}
	#y(e, t) {
		let n = this.getBoundingClientRect();
		return e >= n.left && e <= n.right && t >= n.top && t <= n.bottom;
	}
};
customElements.get("cinq-dual-scroll") || customElements.define("cinq-dual-scroll", s);
//#endregion
export { s as DualScroll, i as SPRING_DEFAULT, r as SPRING_MAX, n as SPRING_MIN };
