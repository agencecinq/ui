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
	WINDOWSPLITTER_CHANGE: "windowsplitter:change",
	CALENDAR_CHANGE: "calendar:change",
	TAB_BEFORE_ACTIVATE: "tab-before-activate",
	TAB_ACTIVATE: "tab-activate",
	TAB_DELETE: "tab-delete",
	CART_BEFORE_ADD: "cart-before-add",
	CART_BEFORE_UPDATE: "cart-before-update",
	CART_UPDATE: "cart-update",
	VARIANT_CHANGE: "variant-change"
}, t = (e, t, n, r = {}) => {
	let { bubbles: i = !0, cancelable: a = !0 } = r;
	return e.dispatchEvent(new CustomEvent(t, {
		bubbles: i,
		cancelable: a,
		detail: n
	}));
}, n = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", r = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, i = document.documentElement, { body: a } = document;
i.hasAttribute("data-debug"), window.addEventListener("pointermove", r(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/utils.ts
var o = (e) => {
	e.classList.remove("is-active");
}, s = (e) => {
	e.classList.add("is-active");
}, c = () => decodeURIComponent(document.location.hash.replace(/^#\/?/, "")), l = class {
	el;
	$body = null;
	$button = null;
	$inner = null;
	index;
	isDeselect = !1;
	isOpen = !1;
	height = 0;
	transitionDuration = 0;
	rafId = 0;
	timeoutId = 0;
	constructor(e, t) {
		this.el = e, this.index = t;
	}
	init() {
		if (this.$button = this.el.querySelector("[data-accordion-header]") || this.el.querySelector("button"), !this.$button) throw Error("Accordion panel: header button not found");
		if (this.$body = (this.$button.ariaControlsElements ?? [])[0] ?? document.getElementById(this.$button.getAttribute("aria-controls") || ""), !this.$body) throw Error("Accordion panel: aria-controls target not found");
		this.$inner = this.$body.querySelector("[data-accordion-inner]") || this.$body.firstElementChild, this.isDeselect = n(this.el.getAttribute("data-accordion-deselect")), this.isOpen = this.$button.getAttribute("aria-expanded") === "true", this.resize(), this.$button.addEventListener("click", this.handleClick), this.$button.addEventListener("focus", this.handleFocus), this.$button.addEventListener("blur", this.handleBlur), window.addEventListener("resize", this.resize);
	}
	get open() {
		return this.$button?.getAttribute("aria-expanded") === "true";
	}
	openPanel(n = !0) {
		return !this.$button || !this.$body || this.open || n && !t(this.el, e.ACCORDION_PANEL_OPEN, this.detail) ? !1 : (this.$button.setAttribute("aria-expanded", "true"), this.el.setAttribute("data-accordion-open", "true"), this.$body.removeAttribute("hidden"), this.resize(), this.$body.style.setProperty("max-height", "0"), this.clearAnimation(), this.rafId = requestAnimationFrame(() => {
			this.rafId = 0, this.$body && (this.$body.style.setProperty("max-height", `${this.height}px`), this.timeoutId = window.setTimeout(() => {
				this.timeoutId = 0, this.$body?.style.removeProperty("max-height");
			}, this.transitionDuration));
		}), s(this.el), this.isOpen = !0, !0);
	}
	close(n = !0) {
		return !this.$button || !this.$body || !this.open || n && !t(this.el, e.ACCORDION_PANEL_CLOSE, this.detail) ? !1 : (this.$button.setAttribute("aria-expanded", "false"), this.el.setAttribute("data-accordion-open", "false"), this.resize(), this.$body.style.setProperty("max-height", `${this.height}px`), this.clearAnimation(), this.rafId = requestAnimationFrame(() => {
			this.rafId = 0, this.$body?.style.setProperty("max-height", "0");
		}), this.timeoutId = window.setTimeout(() => {
			this.timeoutId = 0, this.$body?.setAttribute("hidden", "");
		}, this.transitionDuration), o(this.el), this.isOpen = !1, !0);
	}
	toggle() {
		return !this.isDeselect && this.open ? !1 : this.open ? this.close() : this.openPanel();
	}
	focus() {
		this.$button?.focus();
	}
	destroy() {
		this.clearAnimation(), this.$button?.removeEventListener("click", this.handleClick), this.$button?.removeEventListener("focus", this.handleFocus), this.$button?.removeEventListener("blur", this.handleBlur), window.removeEventListener("resize", this.resize), this.$body && (this.$body.style.removeProperty("max-height"), this.$body.style.removeProperty("overflow")), o(this.el), this.$body = null, this.$button = null, this.$inner = null;
	}
	clearAnimation() {
		this.rafId &&= (cancelAnimationFrame(this.rafId), 0), this.timeoutId &&= (clearTimeout(this.timeoutId), 0);
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
	resize = () => {
		if (!this.$body) return;
		this.$body.removeAttribute("hidden"), this.height = this.$inner?.offsetHeight || this.$body.scrollHeight || 0, this.$body.style.setProperty("overflow", "hidden");
		let e = parseFloat(getComputedStyle(this.$body).transitionDuration);
		this.transitionDuration = Number.isNaN(e) ? 0 : e * 1e3, this.open ? this.$body.style.removeProperty("max-height") : (this.$body.setAttribute("hidden", ""), this.$body.style.setProperty("max-height", "0"));
	};
	get detail() {
		return {
			el: this.el,
			index: this.index
		};
	}
}, u = {
	multiselectable: !1,
	hash: !0
}, d = class extends HTMLElement {
	panels = [];
	current = 0;
	options = { ...u };
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		this.options = {
			multiselectable: n(this.getAttribute("data-accordion-multiselectable")),
			hash: n(this.getAttribute("data-accordion-hash"), u.hash)
		}, this.panels = [...this.querySelectorAll("[data-accordion-panel]")].filter((e) => e.closest("cinq-accordion") === this).map((e, t) => {
			let n = new l(e, t);
			return n.init(), n;
		}), this.addEventListener(e.ACCORDION_PANEL_OPEN, this.handlePanelOpen), this.addEventListener("keydown", this.handleKeydown), this.options.hash && (window.addEventListener("hashchange", this.handleHashChange), this.handleHashChange());
	}
	closeAll() {
		this.panels.forEach((e) => e.close(!1));
	}
	destroy() {
		this.removeEventListener(e.ACCORDION_PANEL_OPEN, this.handlePanelOpen), this.removeEventListener("keydown", this.handleKeydown), window.removeEventListener("hashchange", this.handleHashChange), this.panels.forEach((e) => e.destroy()), this.panels = [];
	}
	handlePanelOpen = (e) => {
		let { el: t, index: n } = e.detail;
		t.closest("cinq-accordion") === this && (this.current = n, !this.options.multiselectable && this.panels.forEach((e, t) => {
			t !== n && e.close(!1);
		}));
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
		let t = e.target, n = this.panels.findIndex((e) => e.$button != null && e.$button.contains(t));
		if (n < 0) return;
		this.current = n;
		let r = () => {
			this.current = this.current - 1 < 0 ? this.panels.length - 1 : this.current - 1, this.panels[this.current]?.focus(), e.preventDefault();
		}, i = () => {
			this.current = this.current + 1 > this.panels.length - 1 ? 0 : this.current + 1, this.panels[this.current]?.focus(), e.preventDefault();
		};
		({
			ArrowUp: r,
			ArrowDown: i,
			ArrowLeft: r,
			ArrowRight: i,
			Home: () => {
				this.current = 0, this.panels[0]?.focus(), e.preventDefault();
			},
			End: () => {
				this.current = this.panels.length - 1, this.panels[this.current]?.focus(), e.preventDefault();
			}
		})[e.key]?.();
	};
};
customElements.get("cinq-accordion") || customElements.define("cinq-accordion", d);
//#endregion
export { d as Accordion, l as Panel };
