import { EVENTS as e, dispatchEvent as t, focusByKey as n, parseBoolean as r } from "@agencecinq/utils";
//#region src/utils.ts
var i = (e) => {
	e.classList.remove("is-active");
}, a = (e) => {
	e.classList.add("is-active");
}, o = () => decodeURIComponent(document.location.hash.replace(/^#\/?/, "")), s = class {
	el;
	$body = null;
	$button = null;
	$inner = null;
	index;
	isDeselectable = !1;
	isOpen = !1;
	height = 0;
	transitionDuration = 0;
	#e = 0;
	#t = 0;
	constructor(e, t) {
		this.el = e, this.index = t;
	}
	init() {
		if (this.$button = this.el.querySelector("[data-header]") || this.el.querySelector("button"), !this.$button) throw Error("Accordion panel: header button not found");
		if (this.$body = (this.$button.ariaControlsElements ?? [])[0] ?? null, !this.$body) throw Error("Accordion panel: aria-controls target not found");
		this.$inner = this.$body.querySelector("[data-inner]") || this.$body.firstElementChild, this.isDeselectable = r(this.el.getAttribute("data-deselectable")), this.isOpen = this.$button.getAttribute("aria-expanded") === "true", this.#o(), this.$button.addEventListener("click", this.#r), this.$button.addEventListener("focus", this.#i), this.$button.addEventListener("blur", this.#a), window.addEventListener("resize", this.#o);
	}
	get open() {
		return this.$button?.getAttribute("aria-expanded") === "true";
	}
	openPanel(n = !0) {
		return !this.$button || !this.$body || this.open || n && !t(this.el, e.ACCORDION_OPEN, this.#s) ? !1 : (this.$button.setAttribute("aria-expanded", "true"), this.el.setAttribute("data-open", "true"), this.$body.removeAttribute("hidden"), this.#o(), this.$body.style.setProperty("max-height", "0"), this.#n(), this.#e = requestAnimationFrame(() => {
			this.#e = 0, this.$body && (this.$body.style.setProperty("max-height", `${this.height}px`), this.#t = window.setTimeout(() => {
				this.#t = 0, this.$body?.style.removeProperty("max-height");
			}, this.transitionDuration));
		}), a(this.el), this.isOpen = !0, !0);
	}
	close(n = !0) {
		return !this.$button || !this.$body || !this.open || n && !t(this.el, e.ACCORDION_CLOSE, this.#s) ? !1 : (this.$button.setAttribute("aria-expanded", "false"), this.el.setAttribute("data-open", "false"), this.#o(), this.$body.style.setProperty("max-height", `${this.height}px`), this.#n(), this.#e = requestAnimationFrame(() => {
			this.#e = 0, this.$body?.style.setProperty("max-height", "0");
		}), this.#t = window.setTimeout(() => {
			this.#t = 0, this.$body?.setAttribute("hidden", "");
		}, this.transitionDuration), i(this.el), this.isOpen = !1, !0);
	}
	toggle() {
		return !this.isDeselectable && this.open ? !1 : this.open ? this.close() : this.openPanel();
	}
	focus() {
		this.$button?.focus();
	}
	destroy() {
		this.#n(), this.$button?.removeEventListener("click", this.#r), this.$button?.removeEventListener("focus", this.#i), this.$button?.removeEventListener("blur", this.#a), window.removeEventListener("resize", this.#o), this.$body && (this.$body.style.removeProperty("max-height"), this.$body.style.removeProperty("overflow")), i(this.el), this.$body = null, this.$button = null, this.$inner = null;
	}
	#n() {
		this.#e &&= (cancelAnimationFrame(this.#e), 0), this.#t &&= (clearTimeout(this.#t), 0);
	}
	#r = () => {
		this.toggle();
	};
	#i = () => {
		this.$button?.classList.add("focus");
	};
	#a = () => {
		this.$button?.classList.remove("focus");
	};
	#o = () => {
		if (!this.$body) return;
		this.$body.removeAttribute("hidden"), this.height = this.$inner?.offsetHeight || this.$body.scrollHeight || 0, this.$body.style.setProperty("overflow", "hidden");
		let e = parseFloat(getComputedStyle(this.$body).transitionDuration);
		this.transitionDuration = Number.isNaN(e) ? 0 : e * 1e3, this.open ? this.$body.style.removeProperty("max-height") : (this.$body.setAttribute("hidden", ""), this.$body.style.setProperty("max-height", "0"));
	};
	get #s() {
		return {
			el: this.el,
			index: this.index
		};
	}
}, c = {
	multiselectable: !1,
	hash: !0
}, l = class extends HTMLElement {
	panels = [];
	current = 0;
	options = { ...c };
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		this.options = {
			multiselectable: r(this.getAttribute("data-multiselectable")),
			hash: r(this.getAttribute("data-hash"), c.hash)
		}, this.panels = [...this.querySelectorAll("[data-panel]")].filter((e) => e.closest("cinq-accordion") === this).map((e, t) => {
			let n = new s(e, t);
			return n.init(), n;
		}), this.addEventListener(e.ACCORDION_OPEN, this.#e), this.addEventListener("keydown", this.#n), this.options.hash && (window.addEventListener("hashchange", this.#t), this.#t());
	}
	closeAll() {
		this.panels.forEach((e) => e.close(!1));
	}
	destroy() {
		this.removeEventListener(e.ACCORDION_OPEN, this.#e), this.removeEventListener("keydown", this.#n), window.removeEventListener("hashchange", this.#t), this.panels.forEach((e) => e.destroy()), this.panels = [];
	}
	#e = (e) => {
		let { el: t, index: n } = e.detail;
		t.closest("cinq-accordion") === this && (this.current = n, !this.options.multiselectable && this.panels.forEach((e, t) => {
			t !== n && e.close(!1);
		}));
	};
	#t = () => {
		let e = o();
		e && this.panels.forEach((t, n) => {
			t.$body && t.$body.id === e && (this.current = n, this.panels.forEach((e, t) => {
				t !== n && e.close(!1);
			}), t.openPanel(!1));
		});
	};
	#n = (e) => {
		let t = e.target, r = this.panels.flatMap(({ $button: e }) => e ? [e] : []), i = r.findIndex((e) => e.contains(t));
		i < 0 || (this.current = n(e, r, i) ?? i);
	};
};
customElements.get("cinq-accordion") || customElements.define("cinq-accordion", l);
//#endregion
export { l as Accordion, s as Panel };
