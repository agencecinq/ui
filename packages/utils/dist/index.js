const _ = {
  DRAWER_CLOSE: "drawer-close",
  DRAWER_OPEN: "drawer-open",
  DRAWER_TOGGLE: "drawer-toggle",
  MODAL_CLOSE: "modal-close",
  MODAL_OPEN: "modal-open",
  MODAL_TOGGLE: "modal-toggle",
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
}, l = document.documentElement, { body: i } = document, W = l.hasAttribute("data-debug"), n = {
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
const k = {
  lg: window.matchMedia("(width >= 64rem)"),
  xl: window.matchMedia("(min-width: 1280px)"),
  "2xl": window.matchMedia("(min-width: 1440px)"),
  "3xl": window.matchMedia("(min-width: 1920px)")
}, C = !0, u = (e, t) => {
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
const p = 8, w = 9, h = 13, A = 16, b = 27, g = 32, x = 33, R = 34, v = 35, L = 36, P = 37, O = 38, S = 39, T = 40, D = 46, H = {
  BACKSPACE: p,
  TAB: w,
  ENTER: h,
  SHIFT: A,
  ESCAPE: b,
  SPACE: g,
  PAGE_UP: x,
  PAGE_DOWN: R,
  END: v,
  HOME: L,
  ARROW_LEFT: P,
  ARROW_UP: O,
  ARROW_RIGHT: S,
  ARROW_DOWN: T,
  DELETE: D
};
export {
  _ as EVENTS,
  G as addTrapFocus,
  i as body,
  k as breakpoints,
  M as disableScroll,
  N as enableScroll,
  y as getFocusableElements,
  l as html,
  W as isDebug,
  H as keycode,
  a as mouse,
  C as production,
  E as removeTrapFocus,
  n as scroll,
  f as throttle
};
