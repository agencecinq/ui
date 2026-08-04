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
}, n = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, r = document.documentElement, { body: i } = document;
r.hasAttribute("data-debug");
var a = {
	y: 0,
	x: 0
}, o = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", n(({ x: e, y: t }) => {
	o.x = e, o.y = t;
}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var s = (e, t) => {
	e !== void 0 && (a.x = e), t !== void 0 && (a.y = t), window.scrollTo(a.x, a.y);
};
function c() {
	let e = r.scrollLeft, t = r.scrollTop, n = i.scrollLeft, o = i.scrollTop;
	a.x = window.scrollX || e || n, a.y = window.scrollY || t || o || 0, r.style.setProperty("overflow", "hidden"), r.style.setProperty("height", "100%"), r.style.setProperty("scroll-padding-top", "0px"), s(a.x, a.y);
}
function l(e = 0) {
	let t = !0, n = a.y;
	typeof e == "number" ? n = e : typeof e == "boolean" && e === !1 && (t = !1), r.style.removeProperty("overflow"), r.style.removeProperty("height"), r.style.removeProperty("scroll-padding-top"), t && s(a.x, n);
}
var u = {};
function d(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function f(e) {
	if (!e) return [];
	let t = [
		"summary",
		"a[href]",
		"button:enabled",
		"[tabindex]:not([tabindex^=\"-\"])",
		"input:not([type=hidden]):enabled",
		"select:enabled",
		"textarea:enabled",
		"object",
		"iframe",
		"[contenteditable]"
	].join(",");
	return Array.from(e.querySelectorAll(t)).filter((e) => d(e) && e.getAttribute("tabindex") !== "-1");
}
function p(e, t = e) {
	let n = f(e);
	if (n.length === 0) return;
	let r = n[0], i = n[n.length - 1];
	m(), u.keydown = (t) => {
		t.key === "Tab" && (t.shiftKey ? (document.activeElement === r || document.activeElement === e) && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus()));
	}, document.addEventListener("keydown", u.keydown), t.focus(), t instanceof HTMLInputElement && [
		"search",
		"text",
		"email",
		"url"
	].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function m(e = null) {
	u.keydown && document.removeEventListener("keydown", u.keydown), e && e.focus();
}
//#endregion
//#region src/drawer.ts
var h = class extends HTMLElement {
	trigger = null;
	trap = null;
	$overlay = null;
	$panel = null;
	constructor() {
		super(), this.trap = this;
	}
	static get observedAttributes() {
		return ["open"];
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		if (!this.id) throw Error("Drawer: id attribute is required");
		this.$panel = this.querySelector("[role=\"dialog\"]") || this, this.$overlay = this.querySelector("[data-dom=\"overlay\"]") || this.querySelector("[overlay]"), this.$overlay && this.$overlay.addEventListener("click", this.handleClick), document.documentElement.addEventListener("keyup", this.handleKeyUp), document.documentElement.addEventListener(e.DRAWER_OPEN, this.handleDrawerOpen), document.documentElement.addEventListener(e.DRAWER_TOGGLE, this.handleDrawerToggle);
	}
	destroy() {
		this.$panel?.removeEventListener("transitionend", this.onCloseTransitionEnd), this.$overlay && this.$overlay.removeEventListener("click", this.handleClick), document.documentElement.removeEventListener("keyup", this.handleKeyUp), document.documentElement.removeEventListener(e.DRAWER_OPEN, this.handleDrawerOpen), document.documentElement.removeEventListener(e.DRAWER_TOGGLE, this.handleDrawerToggle), this.hasAttribute("open") && (m(this.trigger), l(!1), this.style.setProperty("opacity", "0"), this.style.setProperty("visibility", "hidden")), this.$overlay = null, this.$panel = null;
	}
	handleClick = () => this.toggle({
		trigger: null,
		trap: null
	});
	handleKeyUp = (e) => {
		e.key === "Escape" && this.hasAttribute("open") && this.removeAttribute("open");
	};
	handleDrawerOpen = (e) => {
		if (e.detail.drawer !== this.id && this.hasAttribute("open")) {
			this.removeAttribute("open");
			return;
		}
		e.detail.drawer === this.id && !this.hasAttribute("open") && (e.detail.trigger && (this.trigger = e.detail.trigger), this.setAttribute("open", ""));
	};
	handleDrawerToggle = (e) => {
		let { trigger: t, trap: n, drawer: r } = e.detail;
		r === this.id && this.toggle({
			trigger: t,
			trap: n
		});
	};
	toggle({ trigger: e, trap: t }) {
		return !this.hasAttribute("open") && e && (this.trigger = e), this.trap = t || this, this.toggleAttribute("open");
	}
	onCloseTransitionEnd = (e) => {
		e.target === e.currentTarget && (this.$panel?.removeEventListener("transitionend", this.onCloseTransitionEnd), !this.hasAttribute("open") && (this.style.setProperty("opacity", "0"), this.style.setProperty("visibility", "hidden")));
	};
	open() {
		this.$panel?.removeEventListener("transitionend", this.onCloseTransitionEnd), this.style.setProperty("opacity", "1"), this.style.setProperty("visibility", "visible"), t(document.documentElement, e.DRAWER_OPEN, {
			drawer: this.id,
			trigger: this.trigger
		}, {
			bubbles: !1,
			cancelable: !1
		});
		let n = this.trap || this, r = f(n);
		r.length > 0 && p(n, r[0]), c();
	}
	close() {
		this.$panel?.removeEventListener("transitionend", this.onCloseTransitionEnd), m(this.trigger), l(!1), t(document.documentElement, e.DRAWER_CLOSE, { drawer: this.id }, {
			bubbles: !1,
			cancelable: !1
		}), this.$panel?.addEventListener("transitionend", this.onCloseTransitionEnd);
	}
	attributeChangedCallback(e, t, n) {
		!this.isConnected || e !== "open" || (n === null ? this.close() : this.open());
	}
};
customElements.get("cinq-drawer") || customElements.define("cinq-drawer", h);
//#endregion
//#region src/drawer-button.ts
var g = class extends HTMLElement {
	controls = [];
	$button = null;
	handleDrawerClose = (e) => {
		this.$button && this.controls.includes(e.detail.drawer) && this.$button.setAttribute("aria-expanded", "false");
	};
	handleDrawerOpen = (e) => {
		this.$button && this.controls.includes(e.detail.drawer) && this.$button.setAttribute("aria-expanded", "true");
	};
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$button = null, this.controls = [];
	}
	init() {
		if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button) throw Error("DrawerButton: button element not found");
		this.controls = (this.$button.ariaControlsElements ?? []).map((e) => e.id), this.$button.addEventListener("click", this.handleClick), document.documentElement.addEventListener(e.DRAWER_CLOSE, this.handleDrawerClose), document.documentElement.addEventListener(e.DRAWER_OPEN, this.handleDrawerOpen);
	}
	destroy() {
		this.$button && this.$button.removeEventListener("click", this.handleClick), document.documentElement.removeEventListener(e.DRAWER_CLOSE, this.handleDrawerClose), document.documentElement.removeEventListener(e.DRAWER_OPEN, this.handleDrawerOpen);
	}
	handleClick = () => {
		let n = this.$button?.getAttribute("data-trap");
		this.controls.forEach((r) => {
			let i = {
				trigger: this.$button,
				trap: n ? document.getElementById(n) : null,
				drawer: r
			};
			t(document.documentElement, e.DRAWER_TOGGLE, i, {
				bubbles: !1,
				cancelable: !1
			});
		});
	};
};
customElements.get("cinq-drawer-button") || customElements.define("cinq-drawer-button", g);
//#endregion
export { h as Drawer, g as DrawerButton };
