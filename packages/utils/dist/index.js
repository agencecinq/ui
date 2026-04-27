const D = {
  DRAWER_CLOSE: "drawer-close",
  DRAWER_OPEN: "drawer-open",
  DRAWER_TOGGLE: "drawer-toggle",
  MODAL_CLOSE: "modal-close",
  MODAL_OPEN: "modal-open",
  MODAL_TOGGLE: "modal-toggle",
  CART_BEFORE_UPDATE: "cart-before-update",
  CART_UPDATE: "cart-update",
  VARIANT_CHANGE: "variant-change"
}, f = (e, t) => {
  let o = null, r = null;
  const s = () => {
    r && e(...r), o = null;
  };
  return (...c) => {
    r = c, o || (o = setTimeout(s, t));
  };
}, l = document.documentElement, { body: i } = document, C = l.hasAttribute("data-debug"), n = {
  y: 0,
  x: 0
}, a = {
  x: 0,
  y: 0
};
window.addEventListener(
  "pointermove",
  f(({ x: e, y: t }) => {
    a.x = e, a.y = t;
  }, 100),
  { passive: !0 }
);
const W = {
  lg: window.matchMedia("(width >= 64rem)"),
  xl: window.matchMedia("(min-width: 1280px)"),
  "2xl": window.matchMedia("(min-width: 1440px)"),
  "3xl": window.matchMedia("(min-width: 1920px)")
}, k = !0, u = (e, t) => {
  typeof e < "u" && (n.x = e), typeof t < "u" && (n.y = t), window.scrollTo(n.x, n.y);
};
function M() {
  const e = l.scrollLeft, t = l.scrollTop, o = i.scrollLeft, r = i.scrollTop;
  n.x = window.scrollX || e || o, n.y = window.scrollY || t || r || 0, l.style.setProperty("overflow", "hidden"), l.style.setProperty("height", "100%"), l.style.setProperty("scroll-padding-top", "0px"), u(n.x, n.y);
}
function N(e = 0) {
  let t = !0, o = n.y;
  typeof e == "number" ? o = e : typeof e == "boolean" && e === !1 && (t = !1), l.style.removeProperty("overflow"), l.style.removeProperty("height"), l.style.removeProperty("scroll-padding-top"), t && u(n.x, o);
}
const d = {};
function m(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function y(e) {
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
  return Array.from(e.querySelectorAll(t)).filter((o) => m(o) && o.getAttribute("tabindex") !== "-1");
}
function G(e, t = e) {
  const o = y(e);
  if (o.length === 0) return;
  const r = o[0], s = o[o.length - 1];
  E(), d.keydown = (c) => {
    c.key === "Tab" && (c.shiftKey ? (document.activeElement === r || document.activeElement === e) && (c.preventDefault(), s.focus()) : document.activeElement === s && (c.preventDefault(), r.focus()));
  }, document.addEventListener("keydown", d.keydown), t.focus(), t instanceof HTMLInputElement && ["search", "text", "email", "url"].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function E(e = null) {
  d.keydown && document.removeEventListener("keydown", d.keydown), e && e.focus();
}
const p = 8, w = 9, A = 13, h = 16, b = 27, g = 32, R = 33, x = 34, P = 35, T = 36, v = 37, L = 38, O = 39, S = 40, _ = 46, H = {
  BACKSPACE: p,
  TAB: w,
  ENTER: A,
  SHIFT: h,
  ESCAPE: b,
  SPACE: g,
  PAGE_UP: R,
  PAGE_DOWN: x,
  END: P,
  HOME: T,
  ARROW_LEFT: v,
  ARROW_UP: L,
  ARROW_RIGHT: O,
  ARROW_DOWN: S,
  DELETE: _
};
export {
  D as EVENTS,
  G as addTrapFocus,
  i as body,
  W as breakpoints,
  M as disableScroll,
  N as enableScroll,
  y as getFocusableElements,
  l as html,
  C as isDebug,
  H as keycode,
  a as mouse,
  k as production,
  E as removeTrapFocus,
  n as scroll,
  f as throttle
};
