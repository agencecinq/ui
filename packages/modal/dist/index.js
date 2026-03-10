const o = {
  MODAL_CLOSE: "modal-close",
  MODAL_OPEN: "modal-open",
  MODAL_TOGGLE: "modal-toggle"
}, d = (n, t) => {
  let e = null, l = null;
  const i = () => {
    l && n(...l), e = null;
  };
  return (...s) => {
    l = s, e || (e = setTimeout(i, t));
  };
}, a = document.documentElement;
a.hasAttribute("data-debug");
window.addEventListener(
  "pointermove",
  d(({ x: n, y: t }) => {
  }, 100),
  { passive: !0 }
);
window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
class c extends HTMLElement {
  $modal = null;
  handleClick = (t) => {
    t.target === t.currentTarget && this.close();
  };
  constructor() {
    super();
  }
  connectedCallback() {
    if (this.$modal = this.querySelector("[data-dialog]") || this.querySelector("dialog"), !this.$modal)
      throw new Error("Modal: No dialog found");
    this.$modal.addEventListener("click", this.handleClick);
  }
  disconnectedCallback() {
    this.$modal && this.$modal.removeEventListener("click", this.handleClick), this.$modal = null;
  }
  close = () => {
    this.$modal && (this.$modal.close(), document.documentElement.dispatchEvent(new CustomEvent(o.MODAL_CLOSE)));
  };
  show = () => {
    this.$modal && (this.$modal.showModal(), document.documentElement.dispatchEvent(new CustomEvent(o.MODAL_OPEN)));
  };
}
customElements.get("cinq-modal") || customElements.define("cinq-modal", c);
class r extends HTMLElement {
  $button = null;
  controls = [];
  handleModalClose = () => this.$button?.setAttribute("aria-pressed", "false");
  constructor() {
    super();
  }
  connectedCallback() {
    if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button)
      throw new Error("ModalButton: No button found");
    this.controls = this.$button.getAttribute("aria-controls")?.trim().split(" ") || [], this.$button.addEventListener("click", this.show), document.documentElement.addEventListener(o.MODAL_CLOSE, this.handleModalClose);
  }
  disconnectedCallback() {
    this.$button && this.$button.removeEventListener("click", this.show), document.documentElement.removeEventListener(o.MODAL_CLOSE, this.handleModalClose), this.$button = null, this.controls = [];
  }
  show = () => {
    this.$button && (this.$button.setAttribute("aria-pressed", "true"), this.controls.forEach((t) => {
      const e = {
        trigger: this.$button,
        trap: document.getElementById(`${this.$button?.getAttribute("data-trap")}`),
        modal: t
      };
      document.documentElement.dispatchEvent(new CustomEvent(o.MODAL_TOGGLE, { detail: e }));
    }));
  };
}
customElements.get("cinq-modal-button") || customElements.define("cinq-modal-button", r);
export {
  c as Modal,
  r as ModalButton
};
