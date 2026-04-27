const S = {
  DRAWER_CLOSE: "drawer-close",
  DRAWER_OPEN: "drawer-open",
  DRAWER_TOGGLE: "drawer-toggle",
  MODAL_CLOSE: "modal-close",
  MODAL_OPEN: "modal-open",
  MODAL_TOGGLE: "modal-toggle",
  CART_BEFORE_ADD: "cart-before-add",
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
function G(e, t = e) {
  const o = m(e);
  if (o.length === 0) return;
  const r = o[0], s = o[o.length - 1];
  y(), d.keydown = (c) => {
    c.key === "Tab" && (c.shiftKey ? (document.activeElement === r || document.activeElement === e) && (c.preventDefault(), s.focus()) : document.activeElement === s && (c.preventDefault(), r.focus()));
  }, document.addEventListener("keydown", d.keydown), t.focus(), t instanceof HTMLInputElement && ["search", "text", "email", "url"].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function y(e = null) {
  d.keydown && document.removeEventListener("keydown", d.keydown), e && e.focus();
}
const p = 8, w = 9, A = 13, b = 16, h = 27, R = 32, g = 33, x = 34, T = 35, O = 36, P = 37, _ = 38, v = 39, D = 40, L = 46, H = {
  BACKSPACE: p,
  TAB: w,
  ENTER: A,
  SHIFT: b,
  ESCAPE: h,
  SPACE: R,
  PAGE_UP: g,
  PAGE_DOWN: x,
  END: T,
  HOME: O,
  ARROW_LEFT: P,
  ARROW_UP: _,
  ARROW_RIGHT: v,
  ARROW_DOWN: D,
  DELETE: L
};
export {
  S as EVENTS,
  G as addTrapFocus,
  i as body,
  W as breakpoints,
  M as disableScroll,
  N as enableScroll,
  m as getFocusableElements,
  l as html,
  C as isDebug,
  H as keycode,
  a as mouse,
  k as production,
  y as removeTrapFocus,
  n as scroll,
  f as throttle
};
