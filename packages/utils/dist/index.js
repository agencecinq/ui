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
}, n = document.documentElement, { body: r } = document, i = n.hasAttribute("data-debug"), a = {
	y: 0,
	x: 0
}, o = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", t(({ x: e, y: t }) => {
	o.x = e, o.y = t;
}, 100), { passive: !0 });
var s = {
	lg: window.matchMedia("(width >= 64rem)"),
	xl: window.matchMedia("(min-width: 1280px)"),
	"2xl": window.matchMedia("(min-width: 1440px)"),
	"3xl": window.matchMedia("(min-width: 1920px)")
}, c = !0, l = (e, t) => {
	e !== void 0 && (a.x = e), t !== void 0 && (a.y = t), window.scrollTo(a.x, a.y);
};
function u() {
	let e = n.scrollLeft, t = n.scrollTop, i = r.scrollLeft, o = r.scrollTop;
	a.x = window.scrollX || e || i, a.y = window.scrollY || t || o || 0, n.style.setProperty("overflow", "hidden"), n.style.setProperty("height", "100%"), n.style.setProperty("scroll-padding-top", "0px"), l(a.x, a.y);
}
function d(e = 0) {
	let t = !0, r = a.y;
	typeof e == "number" ? r = e : typeof e == "boolean" && e === !1 && (t = !1), n.style.removeProperty("overflow"), n.style.removeProperty("height"), n.style.removeProperty("scroll-padding-top"), t && l(a.x, r);
}
//#endregion
//#region src/focus-trap.ts
var f = {};
function p(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function m(e) {
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
	return Array.from(e.querySelectorAll(t)).filter((e) => p(e) && e.getAttribute("tabindex") !== "-1");
}
function h(e, t = e) {
	let n = m(e);
	if (n.length === 0) return;
	let r = n[0], i = n[n.length - 1];
	g(), f.keydown = (t) => {
		t.key === "Tab" && (t.shiftKey ? (document.activeElement === r || document.activeElement === e) && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus()));
	}, document.addEventListener("keydown", f.keydown), t.focus(), t instanceof HTMLInputElement && [
		"search",
		"text",
		"email",
		"url"
	].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function g(e = null) {
	f.keydown && document.removeEventListener("keydown", f.keydown), e && e.focus();
}
var _ = {
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
}, v = (e, t, n) => Math.min(Math.max(e, t), n);
//#endregion
export { e as EVENTS, h as addTrapFocus, r as body, s as breakpoints, v as clamp, u as disableScroll, d as enableScroll, m as getFocusableElements, n as html, i as isDebug, _ as keycode, o as mouse, c as production, g as removeTrapFocus, a as scroll, t as throttle };
