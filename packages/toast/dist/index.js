import { EVENTS as e, dispatchEvent as t } from "@agencecinq/utils";
//#region src/toast.ts
var n = class extends HTMLElement {
	static observedAttributes = ["open"];
	$content = null;
	$dismiss = null;
	#e = "";
	#t = 0;
	#n = 0;
	#r = 0;
	#i = 0;
	#a = !1;
	#o = 0;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$content = null, this.$dismiss = null;
	}
	init() {
		this.$content = this.querySelector("[data-content]"), this.$dismiss = this.querySelector("button[data-dismiss], [data-dismiss]"), this.$dismiss && this.$dismiss.addEventListener("click", this.#u), this.open && this.#d();
	}
	destroy() {
		this.#f(), window.clearTimeout(this.#n), this.#n = 0, this.$dismiss && this.$dismiss.removeEventListener("click", this.#u);
	}
	attributeChangedCallback(e, t, n) {
		if (e === "open") {
			if (n !== null) {
				this.#s();
				return;
			}
			this.#c();
		}
	}
	get open() {
		return this.hasAttribute("open");
	}
	get message() {
		return this.#e;
	}
	set message(e) {
		this.#e = e, this.$content && (this.$content.textContent = e);
	}
	get duration() {
		let e = this.getAttribute("data-duration");
		if (e == null || e === "") return 0;
		let t = Number(e);
		return Number.isFinite(t) && t > 0 ? t : 0;
	}
	get paused() {
		return this.#a;
	}
	show(e) {
		return !this.open && (typeof e == "string" && (this.message = e), this.setAttribute("open", ""), !0);
	}
	close() {
		return this.open ? (this.removeAttribute("open"), !0) : !1;
	}
	toggle(e) {
		return this.open ? this.close() : this.show(e);
	}
	pause() {
		this.#a = !0;
	}
	resume() {
		this.#a = !1;
	}
	#s() {
		window.clearTimeout(this.#n), this.#n = 0, this.removeEventListener("transitionend", this.#l), this.$content && this.#e && (this.$content.textContent = this.#e), this.#a = !1, this.#o = this.duration, this.style.setProperty("--toast-progress", "0%"), this.#d(), t(this, e.TOAST_OPEN, this.#m, { cancelable: !1 });
	}
	#c() {
		this.#f(), this.#a = !1, this.contains(document.activeElement) && document.activeElement.blur(), window.clearTimeout(this.#n), this.removeEventListener("transitionend", this.#l), this.addEventListener("transitionend", this.#l, { once: !0 }), this.#n = window.setTimeout(() => this.#l(), 400), t(this, e.TOAST_CLOSE, this.#m, { cancelable: !1 });
	}
	#l = () => {
		window.clearTimeout(this.#n), this.#n = 0, this.removeEventListener("transitionend", this.#l), !this.open && (this.$content && (this.$content.textContent = ""), this.#e = "", this.style.setProperty("--toast-progress", "0%"));
	};
	#u = (e) => {
		e.preventDefault(), this.close();
	};
	#d() {
		this.#f(), !(this.#o <= 0) && (this.#r = performance.now(), this.#i = 0, this.#t = requestAnimationFrame(this.#p));
	}
	#f() {
		cancelAnimationFrame(this.#t), this.#t = 0;
	}
	#p = (e) => {
		if (this.#a) {
			this.#i ||= e, this.#t = requestAnimationFrame(this.#p);
			return;
		}
		this.#i &&= (this.#r += e - this.#i, 0);
		let t = e - this.#r, n = Math.min(100, t / this.#o * 100);
		if (this.style.setProperty("--toast-progress", `${n}%`), n >= 100) {
			this.close();
			return;
		}
		this.#t = requestAnimationFrame(this.#p);
	};
	get #m() {
		return {
			el: this,
			message: this.#e
		};
	}
};
customElements.get("cinq-toast") || customElements.define("cinq-toast", n);
//#endregion
export { n as Toast };
