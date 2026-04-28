const S = {
  DRAWER_CLOSE: "drawer-close",
  DRAWER_OPEN: "drawer-open",
  DRAWER_TOGGLE: "drawer-toggle",
  MODAL_CLOSE: "modal-close",
  MODAL_OPEN: "modal-open",
  MODAL_TOGGLE: "modal-toggle",
  SPINBUTTON_CHANGE: "spinbutton-change",
  TAB_BEFORE_ACTIVATE: "tab-before-activate",
  TAB_ACTIVATE: "tab-activate",
  TAB_DELETE: "tab-delete",
  CART_BEFORE_ADD: "cart-before-add",
  CART_BEFORE_UPDATE: "cart-before-update",
  CART_UPDATE: "cart-update",
  VARIANT_CHANGE: "variant-change"
}, f = (e, t) => {
  let o = null, c = null;
  const s = () => {
    c && e(...c), o = null;
  };
  return (...r) => {
    c = r, o || (o = setTimeout(s, t));
  };
}, l = document.documentElement, { body: d } = document, C = l.hasAttribute("data-debug"), n = {
  y: 0,
  x: 0
}, i = {
  x: 0,
  y: 0
};
window.addEventListener(
  "pointermove",
  f(({ x: e, y: t }) => {
    i.x = e, i.y = t;
  }, 100),
  { passive: !0 }
);
const N = {
  lg: window.matchMedia("(width >= 64rem)"),
  xl: window.matchMedia("(min-width: 1280px)"),
  "2xl": window.matchMedia("(min-width: 1440px)"),
  "3xl": window.matchMedia("(min-width: 1920px)")
}, M = !0, u = (e, t) => {
  typeof e < "u" && (n.x = e), typeof t < "u" && (n.y = t), window.scrollTo(n.x, n.y);
};
function W() {
  const e = l.scrollLeft, t = l.scrollTop, o = d.scrollLeft, c = d.scrollTop;
  n.x = window.scrollX || e || o, n.y = window.scrollY || t || c || 0, l.style.setProperty("overflow", "hidden"), l.style.setProperty("height", "100%"), l.style.setProperty("scroll-padding-top", "0px"), u(n.x, n.y);
}
function k(e = 0) {
  let t = !0, o = n.y;
  typeof e == "number" ? o = e : typeof e == "boolean" && e === !1 && (t = !1), l.style.removeProperty("overflow"), l.style.removeProperty("height"), l.style.removeProperty("scroll-padding-top"), t && u(n.x, o);
}
const a = {};
function E(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function m(e) {
  if (!e) return [];
  const t = [
    "summary",
    "a[href]",
    "button:enabled",
    '[tabindex]:not([tabindex^="-"])',
    "input:not([type=hidden]):enabled",
    "select:enabled",
    "textarea:enabled",
    "object",
    "iframe",
    "[contenteditable]"
  ].join(",");
  return Array.from(e.querySelectorAll(t)).filter((o) => E(o) && o.getAttribute("tabindex") !== "-1");
}
function B(e, t = e) {
  const o = m(e);
  if (o.length === 0) return;
  const c = o[0], s = o[o.length - 1];
  y(), a.keydown = (r) => {
    r.key === "Tab" && (r.shiftKey ? (document.activeElement === c || document.activeElement === e) && (r.preventDefault(), s.focus()) : document.activeElement === s && (r.preventDefault(), c.focus()));
  }, document.addEventListener("keydown", a.keydown), t.focus(), t instanceof HTMLInputElement && ["search", "text", "email", "url"].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function y(e = null) {
  a.keydown && document.removeEventListener("keydown", a.keydown), e && e.focus();
}
const A = 8, p = 9, b = 13, w = 16, h = 27, T = 32, R = 33, g = 34, _ = 35, x = 36, O = 37, v = 38, P = 39, D = 40, L = 46, G = {
  BACKSPACE: A,
  TAB: p,
  ENTER: b,
  SHIFT: w,
  ESCAPE: h,
  SPACE: T,
  PAGE_UP: R,
  PAGE_DOWN: g,
  END: _,
  HOME: x,
  ARROW_LEFT: O,
  ARROW_UP: v,
  ARROW_RIGHT: P,
  ARROW_DOWN: D,
  DELETE: L
}, H = (e, t, o) => Math.min(Math.max(e, t), o);
export {
  S as EVENTS,
  B as addTrapFocus,
  d as body,
  N as breakpoints,
  H as clamp,
  W as disableScroll,
  k as enableScroll,
  m as getFocusableElements,
  l as html,
  C as isDebug,
  G as keycode,
  i as mouse,
  M as production,
  y as removeTrapFocus,
  n as scroll,
  f as throttle
};
