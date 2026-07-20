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
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, i = document.documentElement, { body: a } = document, o = i.hasAttribute("data-debug"), s = {
	y: 0,
	x: 0
}, c = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", r(({ x: e, y: t }) => {
	c.x = e, c.y = t;
}, 100), { passive: !0 });
var l = {
	lg: window.matchMedia("(width >= 64rem)"),
	xl: window.matchMedia("(min-width: 1280px)"),
	"2xl": window.matchMedia("(min-width: 1440px)"),
	"3xl": window.matchMedia("(min-width: 1920px)")
}, u = !0, d = (e, t) => {
	e !== void 0 && (s.x = e), t !== void 0 && (s.y = t), window.scrollTo(s.x, s.y);
};
function f() {
	let e = i.scrollLeft, t = i.scrollTop, n = a.scrollLeft, r = a.scrollTop;
	s.x = window.scrollX || e || n, s.y = window.scrollY || t || r || 0, i.style.setProperty("overflow", "hidden"), i.style.setProperty("height", "100%"), i.style.setProperty("scroll-padding-top", "0px"), d(s.x, s.y);
}
function p(e = 0) {
	let t = !0, n = s.y;
	typeof e == "number" ? n = e : typeof e == "boolean" && e === !1 && (t = !1), i.style.removeProperty("overflow"), i.style.removeProperty("height"), i.style.removeProperty("scroll-padding-top"), t && d(s.x, n);
}
//#endregion
//#region src/focus-trap.ts
var m = {};
function h(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function g(e) {
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
	return Array.from(e.querySelectorAll(t)).filter((e) => h(e) && e.getAttribute("tabindex") !== "-1");
}
function _(e, t = e) {
	let n = g(e);
	if (n.length === 0) return;
	let r = n[0], i = n[n.length - 1];
	v(), m.keydown = (t) => {
		t.key === "Tab" && (t.shiftKey ? (document.activeElement === r || document.activeElement === e) && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus()));
	}, document.addEventListener("keydown", m.keydown), t.focus(), t instanceof HTMLInputElement && [
		"search",
		"text",
		"email",
		"url"
	].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function v(e = null) {
	m.keydown && document.removeEventListener("keydown", m.keydown), e && e.focus();
}
var y = {
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
}, b = (e, t, n) => Math.min(Math.max(e, t), n);
//#endregion
export { e as EVENTS, _ as addTrapFocus, a as body, l as breakpoints, b as clamp, f as disableScroll, t as dispatchEvent, p as enableScroll, g as getFocusableElements, i as html, o as isDebug, y as keycode, c as mouse, n as parseList, u as production, v as removeTrapFocus, s as scroll, r as throttle };
