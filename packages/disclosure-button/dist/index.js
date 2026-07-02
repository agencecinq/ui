var n = {
  DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
  DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close"
}, d = (t, e) => {
  let i = null, s = null, o = () => {
    s && t(...s), i = null;
  };
  return (...a) => {
    s = a, i ||= setTimeout(o, e);
  };
}, u = document.documentElement;
u.hasAttribute("data-debug");
window.addEventListener("pointermove", d(({ x: t, y: e }) => {
}, 100), { passive: !0 });
window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
const r = (t, e, i) => t.dispatchEvent(
  new CustomEvent(i, {
    bubbles: !1,
    cancelable: !0,
    detail: e
  })
), l = (t) => {
  const e = t.getAttribute("style");
  if (e && e.includes("display")) {
    if (t.style.display === "block") {
      t.style.setProperty("display", "none");
      return;
    }
    t.style.display === "none" && t.style.setProperty("display", "block");
  }
}, c = (t) => {
  t.hasAttribute("aria-hidden") && (t.setAttribute("aria-hidden", "true"), t.classList.remove("is-active"), t.style.setProperty("pointer-events", "none"));
}, h = (t) => {
  t.hasAttribute("aria-hidden") && (t.setAttribute("aria-hidden", "false"), t.classList.add("is-active"), t.style.setProperty("pointer-events", "auto"));
};
class m {
  el;
  elements = [];
  ids = [];
  constructor(e) {
    this.el = e;
  }
  init() {
    const e = this.el.getAttribute("aria-controls");
    e && (this.ids = e.trim().split(" ").map((i) => `#${i.trim()}`), this.elements = [...document.querySelectorAll(this.ids.join(","))], this.initEvents());
  }
  initEvents() {
    this.el.addEventListener("click", this.onClick), this.el.addEventListener("focus", this.onFocus), this.el.addEventListener("blur", this.onBlur);
  }
  onClick = () => {
    this.toggle();
  };
  onFocus = () => {
    this.el.classList.add("focus");
  };
  onBlur = () => {
    this.el.classList.remove("focus");
  };
  get detail() {
    return { ids: this.ids, elements: this.elements, el: this.el };
  }
  toggle() {
    return this.el.getAttribute("aria-expanded") === "true" ? (this.close(), r(this.el, this.detail, n.DISCLOSURE_BUTTON_CLOSE)) : (this.open(), r(this.el, this.detail, n.DISCLOSURE_BUTTON_OPEN));
  }
  close() {
    this.el.setAttribute("aria-expanded", "false"), this.elements.forEach((e) => {
      l(e), c(e);
    });
  }
  open() {
    this.el.setAttribute("aria-expanded", "true"), this.elements.forEach((e) => {
      l(e), h(e);
    });
  }
  destroy() {
    this.el.removeEventListener("click", this.onClick), this.el.removeEventListener("focus", this.onFocus), this.el.removeEventListener("blur", this.onBlur);
  }
}
export {
  m as DisclosureButton
};
