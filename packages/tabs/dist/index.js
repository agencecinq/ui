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
//#endregion
//#region src/utils/getHash.ts
function a(e) {
	let t = e.indexOf("#");
	return t === -1 ? "" : e.substring(t + 1);
}
//#endregion
//#region src/TabPanel.ts
var o = class {
	el;
	id;
	constructor(e) {
		this.el = e, this.id = e.id;
	}
	deactivate() {
		console.log("TabPanel.deactivate", this.id), this.el.setAttribute("hidden", "true"), this.el.classList.remove("is-active");
	}
	activate() {
		this.el.removeAttribute("hidden"), this.el.classList.add("is-active");
	}
	delete = () => this.el.parentElement?.removeChild(this.el);
	destroy() {
		this.el.removeAttribute("hidden"), this.el.classList.remove("is-active");
	}
};
//#endregion
//#region src/utils/dispatchEvent.ts
function s(e, t, n) {
	let r = new CustomEvent(n, {
		bubbles: !0,
		cancelable: !1,
		detail: t
	});
	return e.dispatchEvent(r);
}
//#endregion
//#region src/Tab.ts
var c = class {
	el;
	active = !1;
	id = "";
	index;
	controls;
	constructor(e, t) {
		this.el = e, this.index = t, this.id = e.id, this.controls = e.getAttribute("aria-controls")?.trim().split(" ")[0] || "";
		let n = e.getAttribute("aria-selected");
		this.active = n === "true";
	}
	init = () => this.initEvents();
	initEvents = () => this.el.addEventListener("click", this.handleClick);
	handleClick = () => this.toggle();
	toggle(t = !0) {
		if (this.active) return;
		let n = new CustomEvent(e.TAB_BEFORE_ACTIVATE, {
			bubbles: !0,
			cancelable: !0,
			detail: {
				index: this.index,
				controls: this.controls,
				element: this.el
			}
		});
		this.el.dispatchEvent(n), !n.defaultPrevented && (s(this.el, {
			controls: this.controls,
			element: this.el
		}, e.TAB_ACTIVATE), this.activate(t));
	}
	activate(e = !0) {
		this.active = !0, this.el.setAttribute("tabindex", "0"), this.el.setAttribute("aria-selected", "true"), this.el.classList.add("is-active"), e && this.focus();
	}
	deactivate() {
		this.active = !1, this.el.setAttribute("tabindex", "-1"), this.el.setAttribute("aria-selected", "false"), this.el.classList.remove("is-active");
	}
	focus = () => this.el.focus();
	delete = () => {
		s(this.el, {
			controls: this.controls,
			element: this.el
		}, e.TAB_DELETE), this.el.parentElement?.removeChild(this.el);
	};
	destroy() {
		this.el.removeAttribute("tabindex"), this.el.removeAttribute("aria-selected"), this.el.classList.remove("is-active"), this.el.removeEventListener("click", this.handleClick);
	}
}, l = class extends HTMLElement {
	$tabList;
	current = 0;
	tabPanels = [];
	tabs = [];
	href = "";
	hash = !1;
	delay = 0;
	constructor() {
		super(), this.$tabList = null;
	}
	connectedCallback() {
		this.$tabList = this.querySelector("[role=\"tablist\"]");
		let e = this.getAttribute("data-tabs-hash"), t = this.getAttribute("data-tabs-delay");
		if (this.hash = e === null ? this.hash : e !== "false" && e !== "0", t !== null) {
			let e = parseInt(t, 10);
			this.delay = Number.isNaN(e) ? 0 : e;
		}
		this.href = this.hash && a(window.location.hash) || "", this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		if (!this.$tabList) return;
		if (this.tabs = [...this.$tabList.querySelectorAll("[role=\"tab\"]")].map((e, t) => new c(e, t)), this.tabs.forEach((t, n) => {
			this.tabPanels.push(new o(this.querySelector(`#${t.controls}[role="tabpanel"]`))), t.init(), t.el.addEventListener(e.TAB_ACTIVATE, () => {
				this.current = n, this.deactivateTabs(), this.deactivateTabPanels(), t.activate(!1), this.tabPanels.find((e) => e.id === t.controls)?.activate(), this.hash && (this.href = t.id, window.location.hash = t.id);
			});
		}), this.href) {
			let e = this.tabs.findIndex((e) => e.id === this.href);
			e >= 0 && (this.current = e);
		}
		if (!this.href || this.current === 0) {
			let e = this.tabs.findIndex((e) => e.active);
			e >= 0 && (this.current = e);
		}
		let t = this.tabs[this.current];
		t && (this.deactivateTabs(), this.deactivateTabPanels(), t.activate(!1), this.tabPanels.find((e) => e.id === t.controls)?.activate()), this.initEvents();
	}
	initEvents() {
		this.$tabList?.addEventListener("keydown", this.handleKeydown);
	}
	get isRtl() {
		let e = this.$tabList ?? this;
		return e ? getComputedStyle(e).direction === "rtl" : !1;
	}
	handleKeydown = (e) => {
		let { key: t, code: n, target: r } = e, i = JSON.parse(r.getAttribute("aria-selected")), a = () => {
			this.current = 0 > this.current - 1 ? this.tabs.length - 1 : this.current - 1, this.tabs[this.current].focus(), this.delay && setTimeout(() => {
				this.tabs[this.current].toggle(!1);
			}, this.delay);
		}, o = () => {
			this.current = this.current + 1 > this.tabs.length - 1 ? 0 : this.current + 1, this.tabs[this.current].focus(), this.delay && setTimeout(() => {
				this.tabs[this.current].toggle(!1);
			}, this.delay);
		}, s = () => {
			e.preventDefault(), this.current = 0, this.tabs[this.current].toggle();
		}, c = () => {
			e.preventDefault(), this.current = this.tabs.length - 1, this.tabs[this.current].toggle();
		}, l = this.isRtl, u = {
			ArrowUp: a,
			ArrowDown: o,
			ArrowLeft: l ? o : a,
			ArrowRight: l ? a : o,
			End: c,
			Home: s,
			PageUp: s,
			PageDown: c,
			Delete: () => i && this.delete(e),
			Backspace: () => i && this.delete(e),
			default: () => !1
		};
		return (u[t || n] || u.default)();
	};
	deactivateTabs = () => this.tabs.forEach((e) => e.deactivate());
	deactivateTabPanels = () => this.tabPanels.forEach((e) => e.deactivate());
	delete({ target: e }) {
		return e.getAttribute("data-deletable") === null ? !1 : (this.tabs[this.current].delete(), this.tabPanels[this.current].delete(), this.tabs.splice(this.current, 1), this.tabPanels.splice(this.current, 1), this.current = 0 > this.current - 1 ? 0 : this.current - 1, this.tabs[this.current].toggle(), !0);
	}
	destroy() {
		this.$tabList?.removeEventListener("keydown", this.handleKeydown), this.tabs.forEach((e) => e.destroy()), this.tabPanels.forEach((e) => e.destroy()), this.tabs = [], this.tabPanels = [];
	}
};
customElements.get("cinq-tabs") || customElements.define("cinq-tabs", l);
//#endregion
export { l as Tabs };
