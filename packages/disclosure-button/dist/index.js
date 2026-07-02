var i = {
  DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
  DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close"
}, a = (t, e) => {
  let s = null, l = null, d = () => {
    l && t(...l), s = null;
  };
  return (...o) => {
    l = o, s ||= setTimeout(d, e);
  };
}, h = document.documentElement;
h.hasAttribute("data-debug");
window.addEventListener("pointermove", a(({ x: t, y: e }) => {
}, 100), { passive: !0 });
window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
const n = (t, e, s) => t.dispatchEvent(
  new CustomEvent(s, {
    bubbles: !0,
    cancelable: !0,
    detail: e
  })
), r = (t, e) => {
  t.hidden = !e;
}, u = (t) => {
  t.forEach((e) => {
    r(e, !0);
  });
}, c = (t) => {
  t.forEach((e) => {
    r(e, !1);
  });
}, E = (t) => !t.hidden, m = (t) => t ? t.trim().split(/\s+/).map((e) => e.trim()).filter(Boolean) : [], p = (t, e) => t.elements.some((s) => e.includes(s));
class L {
  el;
  elements = [];
  controlIds = [];
  constructor(e) {
    this.el = e;
  }
  init() {
    if (this.controlIds = m(this.el.getAttribute("aria-controls")), this.controlIds.length === 0) return;
    const e = this.controlIds.map((s) => `#${s}`).join(",");
    this.elements = [...document.querySelectorAll(e)], this.initEvents(), this.updateExpandedFromElements();
  }
  initEvents() {
    this.el.addEventListener("click", this.onClick), this.el.addEventListener("focus", this.onFocus), this.el.addEventListener("blur", this.onBlur), document.addEventListener(i.DISCLOSURE_BUTTON_OPEN, this.onLinkedChange), document.addEventListener(i.DISCLOSURE_BUTTON_CLOSE, this.onLinkedChange);
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
  onLinkedChange = (e) => {
    if (!(e instanceof CustomEvent)) return;
    const s = e.detail;
    s.el !== this.el && p(s, this.elements) && queueMicrotask(() => {
      this.updateExpandedFromElements();
    });
  };
  get detail() {
    return { ids: this.controlIds, elements: this.elements, el: this.el };
  }
  isExpanded() {
    return this.el.getAttribute("aria-expanded") === "true";
  }
  updateExpandedFromElements() {
    if (this.elements.length === 0) {
      this.el.setAttribute("aria-expanded", "false");
      return;
    }
    const e = this.elements.every((s) => E(s));
    this.el.setAttribute("aria-expanded", e ? "true" : "false");
  }
  toggle() {
    return this.isExpanded() ? n(this.el, this.detail, i.DISCLOSURE_BUTTON_CLOSE) ? (this.close(!1), !0) : !1 : n(this.el, this.detail, i.DISCLOSURE_BUTTON_OPEN) ? (this.open(!1), !0) : !1;
  }
  close(e = !0) {
    e && this.isExpanded() && !n(this.el, this.detail, i.DISCLOSURE_BUTTON_CLOSE) || (c(this.elements), this.updateExpandedFromElements());
  }
  open(e = !0) {
    e && !this.isExpanded() && !n(this.el, this.detail, i.DISCLOSURE_BUTTON_OPEN) || (u(this.elements), this.updateExpandedFromElements());
  }
  destroy() {
    this.el.removeEventListener("click", this.onClick), this.el.removeEventListener("focus", this.onFocus), this.el.removeEventListener("blur", this.onBlur), document.removeEventListener(i.DISCLOSURE_BUTTON_OPEN, this.onLinkedChange), document.removeEventListener(i.DISCLOSURE_BUTTON_CLOSE, this.onLinkedChange);
  }
}
export {
  L as DisclosureButton
};
