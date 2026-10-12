//#region ../utils/dist/index.js
var e = {
	DRAWER_BEFORE_CLOSE: "drawer:before-close",
	DRAWER_BEFORE_OPEN: "drawer:before-open",
	DRAWER_CLOSE: "drawer:close",
	DRAWER_OPEN: "drawer:open",
	DRAWER_TOGGLE: "drawer:toggle",
	SHEET_BEFORE_CLOSE: "sheet:before-close",
	SHEET_BEFORE_OPEN: "sheet:before-open",
	SHEET_CLOSE: "sheet:close",
	SHEET_OPEN: "sheet:open",
	SHEET_TOGGLE: "sheet:toggle",
	MODAL_BEFORE_CLOSE: "modal:before-close",
	MODAL_BEFORE_OPEN: "modal:before-open",
	MODAL_CLOSE: "modal:close",
	MODAL_OPEN: "modal:open",
	MODAL_TOGGLE: "modal:toggle",
	SPINBUTTON_CHANGE: "spinbutton:change",
	TOAST_OPEN: "toast:open",
	TOAST_CLOSE: "toast:close",
	DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
	DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close",
	DRILLDOWN_OPEN: "drilldown:open",
	DRILLDOWN_CLOSE: "drilldown:close",
	SWITCH_ACTIVATE: "switch:activate",
	SWITCH_DEACTIVATE: "switch:deactivate",
	ACCORDION_OPEN: "accordion:open",
	ACCORDION_CLOSE: "accordion:close",
	COMBOBOX_LOADING: "combobox:loading",
	COMBOBOX_LOADED: "combobox:loaded",
	COMBOBOX_UPDATE: "combobox:update",
	COMBOBOX_SUBMIT: "combobox:submit",
	COMBOBOX_EMPTY: "combobox:empty",
	WINDOWSPLITTER_CHANGE: "windowsplitter:change",
	SLIDER_CHANGE: "slider:change",
	SNAKE_EAT: "snake:eat",
	SNAKE_OVER: "snake:over",
	SNAKE_REPLAY: "snake:replay",
	CALENDAR_CHANGE: "calendar:change",
	TABS_BEFORE_ACTIVATE: "tabs:before-activate",
	TABS_ACTIVATE: "tabs:activate",
	TABS_DELETE: "tabs:delete",
	CART_BEFORE_ADD: "cart:before-add",
	CART_BEFORE_UPDATE: "cart:before-update",
	CART_UPDATE: "cart:update",
	VARIANT_CHANGE: "variant:change"
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
r.hasAttribute("data-debug"), window.addEventListener("pointermove", n(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
function a(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function o(e) {
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
	return Array.from(e.querySelectorAll(t)).filter((e) => a(e) && e.getAttribute("tabindex") !== "-1");
}
//#endregion
//#region src/drilldown.ts
var { DRILLDOWN_OPEN: s, DRILLDOWN_CLOSE: c } = e, l = class extends HTMLElement {
	panels = [];
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.panels = [];
	}
	init() {
		this.panels = Array.from(this.children).filter((e) => e instanceof HTMLElement), this.addEventListener("click", this.#n);
	}
	destroy() {
		this.removeEventListener("click", this.#n);
	}
	get current() {
		return this.panels.find((e) => !e.hidden) ?? null;
	}
	open(e, n = null) {
		let r = this.current, i = this.panels.find((t) => t.id === e);
		if (!r || !i || i === r) return !1;
		let a = n ?? r.querySelector(`button[aria-controls="${CSS.escape(e)}"]`);
		return !a || !t(this, s, {
			panel: i,
			previous: r,
			$button: a,
			open: !0
		}) ? !1 : (a.setAttribute("aria-expanded", "true"), r.hidden = !0, i.hidden = !1, o(i)[0]?.focus(), !0);
	}
	close(e = !0) {
		let n = this.current, r = n ? this.#e(n) : null, i = r ? this.#t(r) : null;
		return !n || !r || !i || !t(this, c, {
			panel: i,
			previous: n,
			$button: r,
			open: !1
		}) ? !1 : (r.setAttribute("aria-expanded", "false"), n.hidden = !0, i.hidden = !1, e && r.focus(), !0);
	}
	closeAll() {
		for (; this.close(!1););
	}
	#e(e) {
		return this.querySelector(`button[aria-controls="${CSS.escape(e.id)}"][aria-expanded="true"]`);
	}
	#t(e) {
		return this.panels.find((t) => t.contains(e)) ?? null;
	}
	#n = (e) => {
		let t = e.target, n = t.closest("[data-close]");
		if (n && this.contains(n)) {
			this.close();
			return;
		}
		let r = t.closest("button[aria-controls]"), i = r?.getAttribute("aria-controls");
		r && i && this.contains(r) && this.open(i, r);
	};
};
customElements.get("cinq-drilldown") || customElements.define("cinq-drilldown", l);
//#endregion
export { l as Drilldown };
