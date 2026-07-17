//#region ../utils/dist/index.js
var e = {
	DRAWER_CLOSE: "drawer-close",
	DRAWER_OPEN: "drawer-open",
	DRAWER_TOGGLE: "drawer-toggle",
	MODAL_CLOSE: "modal-close",
	MODAL_OPEN: "modal-open",
	MODAL_TOGGLE: "modal-toggle",
	SPINBUTTON_CHANGE: "spinbutton-change",
	DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
	DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close",
	SWITCH_ACTIVATE: "switch:activate",
	SWITCH_DEACTIVATE: "switch:deactivate",
	ACCORDION_PANEL_OPEN: "accordion-panel:open",
	ACCORDION_PANEL_CLOSE: "accordion-panel:close",
	COMBOBOX_LOADING: "combobox:loading",
	COMBOBOX_LOADED: "combobox:loaded",
	COMBOBOX_UPDATE: "combobox:update",
	COMBOBOX_SUBMIT: "combobox:submit",
	COMBOBOX_EMPTY: "combobox:empty",
	TAB_BEFORE_ACTIVATE: "tab-before-activate",
	TAB_ACTIVATE: "tab-activate",
	TAB_DELETE: "tab-delete",
	CART_BEFORE_ADD: "cart-before-add",
	CART_BEFORE_UPDATE: "cart-before-update",
	CART_UPDATE: "cart-update",
	VARIANT_CHANGE: "variant-change"
}, t = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, n = document.documentElement, { body: r } = document;
n.hasAttribute("data-debug");
var i = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", t(({ x: e, y: t }) => {
	i.x = e, i.y = t;
}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var a = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	ESCAPE: 27,
	SPACE: 32,
	PAGE_UP: 33,
	PAGE_DOWN: 34,
	END: 35,
	HOME: 36,
	ARROW_LEFT: 37,
	ARROW_UP: 38,
	ARROW_RIGHT: 39,
	ARROW_DOWN: 40,
	DELETE: 46
}, o = (e) => {
	e.classList.remove("is-active");
}, s = (e) => {
	e.classList.add("is-active");
}, c = () => document.location.hash.replace(/^#\//, ""), l = (e, t = !1) => e === null ? t : e !== "false" && e !== "0", u = (e) => [...e.querySelectorAll("[data-accordion-panel]")].filter((t) => t.closest("cinq-accordion") === e), d = (e, t, n) => e.dispatchEvent(new CustomEvent(t, {
	bubbles: !0,
	cancelable: !0,
	detail: n
})), f = class {
	el;
	$body = null;
	$button = null;
	$inner = null;
	index;
	isDeselect = !1;
	isOpen = !1;
	height = 0;
	transitionDuration = 0;
	constructor(e, t) {
		this.el = e, this.index = t;
	}
	init() {
		if (this.$button = this.el.querySelector("[data-accordion-header]") || this.el.querySelector("button"), !this.$button) return;
		let e = this.$button.getAttribute("aria-controls")?.trim().split(/\s+/)[0] || "";
		this.$body = e ? document.getElementById(e) : null, this.$body && (this.$inner = this.$body.querySelector("[data-accordion-inner]") || this.$body.firstElementChild, this.isDeselect = l(this.el.getAttribute("data-accordion-deselect")), this.isOpen = this.$button.getAttribute("aria-expanded") === "true", this.measure(), this.$button.addEventListener("click", this.handleClick), this.$button.addEventListener("focus", this.handleFocus), this.$button.addEventListener("blur", this.handleBlur), window.addEventListener("resize", this.handleResize));
	}
	get open() {
		return this.$button?.getAttribute("aria-expanded") === "true";
	}
	openPanel(t = !0) {
		return !this.$button || !this.$body || this.open || t && !d(this.el, e.ACCORDION_PANEL_OPEN, this.detail) ? !1 : (this.$button.setAttribute("aria-expanded", "true"), this.el.setAttribute("data-accordion-open", "true"), this.$body.removeAttribute("hidden"), this.measure(), this.$body.style.setProperty("max-height", "0"), requestAnimationFrame(() => {
			this.$body.style.setProperty("max-height", `${this.height}px`), window.setTimeout(() => {
				this.$body.style.removeProperty("max-height");
			}, this.transitionDuration);
		}), s(this.el), this.isOpen = !0, !0);
	}
	close(t = !0) {
		return !this.$button || !this.$body || !this.open || t && !d(this.el, e.ACCORDION_PANEL_CLOSE, this.detail) ? !1 : (this.$button.setAttribute("aria-expanded", "false"), this.el.setAttribute("data-accordion-open", "false"), this.measure(), this.$body.style.setProperty("max-height", `${this.height}px`), requestAnimationFrame(() => {
			this.$body.style.setProperty("max-height", "0");
		}), window.setTimeout(() => {
			this.$body.setAttribute("hidden", "");
		}, this.transitionDuration), o(this.el), this.isOpen = !1, !0);
	}
	toggle() {
		return !this.isDeselect && this.open ? !1 : this.open ? this.close() : this.openPanel();
	}
	focus() {
		this.$button?.focus();
	}
	destroy() {
		this.$button?.removeEventListener("click", this.handleClick), this.$button?.removeEventListener("focus", this.handleFocus), this.$button?.removeEventListener("blur", this.handleBlur), window.removeEventListener("resize", this.handleResize), this.$body && (this.$body.style.removeProperty("max-height"), this.$body.style.removeProperty("overflow")), o(this.el), this.$body = null, this.$button = null, this.$inner = null;
	}
	handleClick = () => {
		this.toggle();
	};
	handleFocus = () => {
		this.$button?.classList.add("focus");
	};
	handleBlur = () => {
		this.$button?.classList.remove("focus");
	};
	handleResize = () => {
		this.measure();
	};
	measure() {
		if (!this.$body) return;
		this.$body.removeAttribute("hidden"), this.height = this.$inner?.offsetHeight || this.$body.scrollHeight || 0, this.$body.style.setProperty("overflow", "hidden");
		let e = parseFloat(getComputedStyle(this.$body).transitionDuration);
		this.transitionDuration = Number.isNaN(e) ? 0 : e * 1e3, this.open ? this.$body.style.removeProperty("max-height") : (this.$body.setAttribute("hidden", ""), this.$body.style.setProperty("max-height", "0"));
	}
	get detail() {
		return {
			el: this.el,
			index: this.index
		};
	}
}, p = {
	multiselectable: !1,
	hash: !0
}, m = class extends HTMLElement {
	panels = [];
	current = 0;
	options = { ...p };
	connectedCallback() {
		let t = this.getAttribute("data-accordion-multiselectable"), n = this.getAttribute("data-accordion-hash");
		this.options = {
			multiselectable: l(t, !1),
			hash: n === null ? p.hash : l(n, !0)
		};
		let r = u(this);
		this.panels = r.map((e, t) => {
			let n = new f(e, t);
			return n.init(), n;
		}), this.panels.forEach((t, n) => {
			t.el.addEventListener(e.ACCORDION_PANEL_OPEN, () => this.handlePanelOpen(n));
		}), this.addEventListener("keydown", this.handleKeydown), this.options.hash && (window.addEventListener("hashchange", this.handleHashChange), this.handleHashChange());
	}
	disconnectedCallback() {
		this.destroy();
	}
	closeAll() {
		this.panels.forEach((e) => e.close(!1));
	}
	destroy() {
		this.removeEventListener("keydown", this.handleKeydown), window.removeEventListener("hashchange", this.handleHashChange), this.panels.forEach((e) => e.destroy()), this.panels = [];
	}
	handlePanelOpen = (e) => {
		this.current = e, !this.options.multiselectable && this.panels.forEach((t, n) => {
			n !== e && t.close(!1);
		});
	};
	handleHashChange = () => {
		let e = c();
		e && this.panels.forEach((t, n) => {
			t.$body && t.$body.id === e && (this.current = n, this.panels.forEach((e, t) => {
				t !== n && e.close(!1);
			}), t.openPanel(!1));
		});
	};
	handleKeydown = (e) => {
		let t = e.target, n = t.matches("[data-accordion-header]") ? t : null;
		if (!n) return;
		let r = this.panels.findIndex((e) => e.$button === n);
		if (r < 0) return;
		this.current = r;
		let i = () => {
			this.current = this.current - 1 < 0 ? this.panels.length - 1 : this.current - 1, this.panels[this.current]?.focus(), e.preventDefault();
		}, o = () => {
			this.current = this.current + 1 > this.panels.length - 1 ? 0 : this.current + 1, this.panels[this.current]?.focus(), e.preventDefault();
		}, s = () => {
			this.current = 0, this.panels[0]?.focus(), e.preventDefault();
		}, c = () => {
			this.current = this.panels.length - 1, this.panels[this.current]?.focus(), e.preventDefault();
		};
		({
			[a.ARROW_UP]: i,
			[a.ARROW_DOWN]: o,
			[a.ARROW_LEFT]: i,
			[a.ARROW_RIGHT]: o,
			[a.HOME]: s,
			[a.END]: c
		})[e.keyCode]?.();
	};
};
customElements.get("cinq-accordion") || customElements.define("cinq-accordion", m);
//#endregion
export { m as Accordion };
