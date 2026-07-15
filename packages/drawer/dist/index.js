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
	y: 0,
	x: 0
}, a = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", t(({ x: e, y: t }) => {
	a.x = e, a.y = t;
}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var o = (e, t) => {
	e !== void 0 && (i.x = e), t !== void 0 && (i.y = t), window.scrollTo(i.x, i.y);
};
function s() {
	let e = n.scrollLeft, t = n.scrollTop, a = r.scrollLeft, s = r.scrollTop;
	i.x = window.scrollX || e || a, i.y = window.scrollY || t || s || 0, n.style.setProperty("overflow", "hidden"), n.style.setProperty("height", "100%"), n.style.setProperty("scroll-padding-top", "0px"), o(i.x, i.y);
}
function c(e = 0) {
	let t = !0, r = i.y;
	typeof e == "number" ? r = e : typeof e == "boolean" && e === !1 && (t = !1), n.style.removeProperty("overflow"), n.style.removeProperty("height"), n.style.removeProperty("scroll-padding-top"), t && o(i.x, r);
}
var l = {};
function u(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function d(e) {
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
	return Array.from(e.querySelectorAll(t)).filter((e) => u(e) && e.getAttribute("tabindex") !== "-1");
}
function f(e, t = e) {
	let n = d(e);
	if (n.length === 0) return;
	let r = n[0], i = n[n.length - 1];
	p(), l.keydown = (t) => {
		t.key === "Tab" && (t.shiftKey ? (document.activeElement === r || document.activeElement === e) && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus()));
	}, document.addEventListener("keydown", l.keydown), t.focus(), t instanceof HTMLInputElement && [
		"search",
		"text",
		"email",
		"url"
	].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function p(e = null) {
	l.keydown && document.removeEventListener("keydown", l.keydown), e && e.focus();
}
var m = {
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
}, h = class extends HTMLElement {
	trigger = null;
	trap = null;
	constructor() {
		super(), this.trap = this;
	}
	get cid() {
		return this.getAttribute("cid") || this.id;
	}
	static get observedAttributes() {
		return ["open"];
	}
	connectedCallback() {
		let t = this.querySelector("[data-dom=\"overlay\"]") || this.querySelector("[overlay]");
		t && t.addEventListener("click", this.handleClick), document.documentElement.addEventListener("keyup", this.handleKeyUp), document.documentElement.addEventListener(e.DRAWER_OPEN, this.handleDrawerOpen), document.documentElement.addEventListener(e.DRAWER_TOGGLE, this.handleDrawerToggle);
	}
	handleClick = () => this.toggle({
		trigger: null,
		trap: null
	});
	handleKeyUp = (e) => {
		(e.which || e.keyCode) === m.ESCAPE && this.hasAttribute("open") && this.removeAttribute("open");
	};
	handleDrawerOpen = (e) => {
		e.detail.drawer !== this.cid && this.hasAttribute("open") && (this.trigger = e.detail.trigger, this.removeAttribute("open")), e.detail.drawer === this.cid && !this.hasAttribute("open") && (this.trigger = e.detail.trigger, this.setAttribute("open", ""));
	};
	handleDrawerToggle = (e) => {
		let { trigger: t, trap: n, drawer: r } = e.detail;
		r === this.cid && this.toggle({
			trigger: t,
			trap: n
		});
	};
	toggle({ trigger: e, trap: t }) {
		return e && (this.trigger = e), this.trap = t || this, this.toggleAttribute("open");
	}
	open() {
		this.style.setProperty("opacity", "1"), this.style.setProperty("visibility", "visible"), document.documentElement.dispatchEvent(new CustomEvent(e.DRAWER_OPEN, { detail: { drawer: this.cid } })), this.addEventListener("transitionend", () => {
			let e = d(this.trap);
			e.length > 0 && f(this.trap, e[0]), s();
		}, { once: !0 });
	}
	close() {
		p(this.trigger), this.addEventListener("transitionend", () => {
			this.hasAttribute("open") || (this.style.setProperty("opacity", "0"), this.style.setProperty("visibility", "hidden"), document.documentElement.dispatchEvent(new CustomEvent(e.DRAWER_CLOSE, { detail: { drawer: this.cid } })), c(!1));
		}, { once: !0 });
	}
	disconnectedCallback() {
		let t = this.querySelector("[data-dom=\"overlay\"]") || this.querySelector("[overlay]");
		t && t.removeEventListener("click", this.handleClick), document.documentElement.removeEventListener("keyup", this.handleKeyUp), document.documentElement.removeEventListener(e.DRAWER_OPEN, this.handleDrawerOpen);
	}
	attributeChangedCallback(e, t, n) {
		e === "open" && (n === null ? this.close() : this.open());
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
		if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button) throw Error("DrawerButton: button element not found");
		this.controls = this.$button.getAttribute("aria-controls")?.trim().split(" ") || [], this.$button.addEventListener("click", this.handleClick), document.documentElement.addEventListener(e.DRAWER_CLOSE, this.handleDrawerClose), document.documentElement.addEventListener(e.DRAWER_OPEN, this.handleDrawerOpen);
	}
	handleClick = () => {
		this.$button.setAttribute("aria-expanded", this.$button.getAttribute("aria-expanded") === "true" ? "false" : "true"), this.controls.forEach((t) => {
			let n = {
				trigger: this.$button,
				trap: document.getElementById(`${this.$button?.getAttribute("data-trap")}`),
				drawer: t
			};
			document.documentElement.dispatchEvent(new CustomEvent(e.DRAWER_TOGGLE, { detail: n }));
		});
	};
	disconnectedCallback() {
		this.$button.removeEventListener("click", this.handleClick), document.documentElement.removeEventListener(e.DRAWER_CLOSE, this.handleDrawerClose), document.documentElement.removeEventListener(e.DRAWER_OPEN, this.handleDrawerOpen);
	}
};
customElements.get("cinq-drawer-button") || customElements.define("cinq-drawer-button", g);
//#endregion
export { h as Drawer, g as DrawerButton };
