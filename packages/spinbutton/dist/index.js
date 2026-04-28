const d = {
  SPINBUTTON_CHANGE: "spinbutton-change"
}, o = (s, t) => {
  let e = null, i = null;
  const n = () => {
    i && s(...i), e = null;
  };
  return (...a) => {
    i = a, e || (e = setTimeout(n, t));
  };
}, c = document.documentElement;
c.hasAttribute("data-debug");
window.addEventListener(
  "pointermove",
  o(({ x: s, y: t }) => {
  }, 100),
  { passive: !0 }
);
window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
const p = (s, t, e) => Math.min(Math.max(s, t), e), l = {
  step: 1,
  delay: 20
}, v = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: "0"
}, h = (s, t) => t ? `${s} ${s <= 1 ? t.single : t.plural}` : s.toString(), r = (s, t, e) => {
  !s || e === !1 || (t === e ? s.setAttribute("disabled", "true") : s.removeAttribute("disabled"));
}, u = (s, t, e) => {
  const i = s.getAttribute(t);
  if (i === null) return e;
  const n = parseInt(i, 10);
  return Number.isNaN(n) ? e : n;
};
class m extends HTMLElement {
  $input = null;
  $increase = null;
  $decrease = null;
  $liveRegion = null;
  options = { ...l };
  value = { min: !1, max: !1, now: 0, text: "0" };
  text;
  throttledEmit = null;
  connectedCallback() {
    if (this.$input = this.querySelector("[data-spinbutton-input]") || this.querySelector("input"), !this.$input) return;
    this.$increase = this.querySelector(
      '[data-spinbutton-action="increase"]'
    ), this.$decrease = this.querySelector(
      '[data-spinbutton-action="decrease"]'
    ), this.$liveRegion = document.createElement("div"), this.$liveRegion.setAttribute("aria-live", "polite"), this.$liveRegion.setAttribute("aria-atomic", "true"), Object.assign(this.$liveRegion.style, v), this.appendChild(this.$liveRegion), this.text = this.parseText(), this.options.step = u(this, "data-spinbutton-step", l.step), this.options.delay = u(this, "data-spinbutton-delay", l.delay);
    const t = this.$input.getAttribute("aria-valuemin"), e = this.$input.getAttribute("aria-valuemax"), i = u(this.$input, "aria-valuenow", 0);
    this.value = {
      min: t === null ? !1 : parseInt(t, 10),
      max: e === null ? !1 : parseInt(e, 10),
      now: i,
      text: h(i, this.text)
    }, this.init();
  }
  disconnectedCallback() {
    this.destroy();
  }
  parseText() {
    const t = this.getAttribute("data-spinbutton-text");
    if (t)
      try {
        const e = JSON.parse(t);
        if (typeof e.single == "string" && typeof e.plural == "string")
          return { single: e.single, plural: e.plural };
      } catch {
      }
  }
  init() {
    this.setValue(this.value.now, !1), this.initEvents();
  }
  initEvents() {
    this.$input?.addEventListener("keydown", this.handleKeydown), this.$input?.addEventListener("change", this.handleInputChange), this.$increase?.addEventListener("click", this.increase), this.$decrease?.addEventListener("click", this.decrease);
  }
  handleInputChange = (t) => {
    const e = t.target, i = parseInt(e.value, 10);
    this.setValue(Number.isNaN(i) ? this.value.now : i);
  };
  handleKeydown = (t) => {
    const e = t.key || t.code, { step: i } = this.options, a = {
      ArrowUp: () => this.setValue(this.value.now + i),
      ArrowDown: () => this.setValue(this.value.now - i),
      PageUp: () => this.setValue(this.value.now + i * 5),
      PageDown: () => this.setValue(this.value.now - i * 5),
      Home: () => {
        this.value.min !== !1 && this.setValue(this.value.min);
      },
      End: () => {
        this.value.max !== !1 && this.setValue(this.value.max);
      }
    }[e];
    a && (t.preventDefault(), a());
  };
  decrease = () => {
    this.setValue(this.value.now - this.options.step);
  };
  increase = () => {
    this.setValue(this.value.now + this.options.step);
  };
  setMin(t, e = !0) {
    this.value.min = t, this.$input?.setAttribute("aria-valuemin", t.toString()), this.setValue(this.value.now, e);
  }
  setMax(t, e = !0) {
    this.value.max = t, this.$input?.setAttribute("aria-valuemax", t.toString()), this.setValue(this.value.now, e);
  }
  setValue(t, e = !0) {
    if (!this.$input) return;
    const i = Number.isNaN(t) ? this.value.now : t, n = this.value.min !== !1 ? this.value.min : Number.MIN_SAFE_INTEGER, a = this.value.max !== !1 ? this.value.max : Number.MAX_SAFE_INTEGER;
    i < n || i > a ? this.$input.setAttribute("aria-invalid", "true") : this.$input.removeAttribute("aria-invalid"), this.value.now = p(i, n, a), this.value.text = h(this.value.now, this.text), r(this.$increase, this.value.now, this.value.max), r(this.$decrease, this.value.now, this.value.min), this.$input.setAttribute("aria-valuenow", this.value.now.toString()), this.$input.setAttribute("aria-valuetext", this.value.text), this.$input.value = this.value.now.toString(), this.$input.setAttribute("value", this.value.now.toString()), this.$liveRegion && (this.$liveRegion.textContent = this.value.text), e && this.emitChange();
  }
  emitChange() {
    (this.throttledEmit ?? (this.throttledEmit = o(() => {
      const e = { value: this.value.now };
      this.dispatchEvent(
        new CustomEvent(d.SPINBUTTON_CHANGE, {
          bubbles: !0,
          cancelable: !0,
          detail: e
        })
      );
    }, this.options.delay)))();
  }
  destroy() {
    this.$input?.removeEventListener("keydown", this.handleKeydown), this.$input?.removeEventListener("change", this.handleInputChange), this.$increase?.removeEventListener("click", this.increase), this.$decrease?.removeEventListener("click", this.decrease), this.$liveRegion && this.contains(this.$liveRegion) && this.removeChild(this.$liveRegion), this.$liveRegion = null, this.throttledEmit = null;
  }
}
customElements.get("cinq-spinbutton") || customElements.define("cinq-spinbutton", m);
export {
  m as Spinbutton
};
