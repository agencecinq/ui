//#region src/events.ts
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
}, n = (e) => e ? e.trim().split(/\s+/).filter(Boolean) : [], r = (e, t) => {
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, i = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", a = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, o = document.documentElement, { body: s } = document, c = o.hasAttribute("data-debug"), l = {
	y: 0,
	x: 0
}, u = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", a(({ x: e, y: t }) => {
	u.x = e, u.y = t;
}, 100), { passive: !0 });
var d = {
	lg: window.matchMedia("(width >= 64rem)"),
	xl: window.matchMedia("(min-width: 1280px)"),
	"2xl": window.matchMedia("(min-width: 1440px)"),
	"3xl": window.matchMedia("(min-width: 1920px)")
}, f = !0, p = (e, t) => {
	e !== void 0 && (l.x = e), t !== void 0 && (l.y = t), window.scrollTo(l.x, l.y);
};
function m() {
	let e = o.scrollLeft, t = o.scrollTop, n = s.scrollLeft, r = s.scrollTop;
	l.x = window.scrollX || e || n, l.y = window.scrollY || t || r || 0, o.style.setProperty("overflow", "hidden"), o.style.setProperty("height", "100%"), o.style.setProperty("scroll-padding-top", "0px"), p(l.x, l.y);
}
function h(e = 0) {
	let t = !0, n = l.y;
	typeof e == "number" ? n = e : typeof e == "boolean" && e === !1 && (t = !1), o.style.removeProperty("overflow"), o.style.removeProperty("height"), o.style.removeProperty("scroll-padding-top"), t && p(l.x, n);
}
//#endregion
//#region src/focus-trap.ts
var g = {};
function _(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function v(e) {
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
	return Array.from(e.querySelectorAll(t)).filter((e) => _(e) && e.getAttribute("tabindex") !== "-1");
}
function y(e, t = e) {
	let n = v(e);
	if (n.length === 0) return;
	let r = n[0], i = n[n.length - 1];
	b(), g.keydown = (t) => {
		t.key === "Tab" && (t.shiftKey ? (document.activeElement === r || document.activeElement === e) && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus()));
	}, document.addEventListener("keydown", g.keydown), t.focus(), t instanceof HTMLInputElement && [
		"search",
		"text",
		"email",
		"url"
	].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function b(e = null) {
	g.keydown && document.removeEventListener("keydown", g.keydown), e && e.focus();
}
var x = {
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
}, S = (e, t, n) => Math.min(Math.max(e, t), n);
//#endregion
export { e as EVENTS, y as addTrapFocus, s as body, d as breakpoints, S as clamp, m as disableScroll, t as dispatchEvent, h as enableScroll, v as getFocusableElements, o as html, c as isDebug, x as keycode, u as mouse, i as parseBoolean, n as parseList, r as parseNumber, f as production, b as removeTrapFocus, l as scroll, a as throttle };
