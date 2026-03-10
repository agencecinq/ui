function u(s) {
  const t = s.indexOf("#");
  return t === -1 ? "" : s.substring(t + 1);
}
const b = !0, v = 0;
class f {
  el;
  id;
  constructor(t) {
    this.el = t, this.id = t.id;
  }
  deactivate() {
    this.el.setAttribute("hidden", "true"), this.el.classList.remove("is-active");
  }
  activate() {
    this.el.removeAttribute("hidden"), this.el.classList.add("is-active");
  }
  delete = () => this.el.parentElement?.removeChild(this.el);
  destroy() {
    this.el.removeAttribute("hidden"), this.el.classList.remove("is-active");
  }
}
function o(s, t = {}, e = "") {
  const i = new CustomEvent(`Tab.${e}`, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  return s.dispatchEvent(i);
}
class g {
  el;
  active = !1;
  id = "";
  callback;
  controls;
  constructor(t, e) {
    this.el = t, this.id = t.id, this.controls = t.getAttribute("aria-controls")?.trim().split(" ")[0] || "", this.active = JSON.parse(t.getAttribute("aria-selected")), this.callback = e;
  }
  init = () => this.initEvents();
  initEvents = () => this.el.addEventListener("click", this.handleClick);
  /**
   * Handle click
   */
  handleClick = () => this.toggle();
  /**
   * Toggle
   *
   * @param {boolean} focus
   */
  async toggle(t = !0) {
    this.active || (await this.callback(), o(this.el, { controls: this.controls, element: this.el }, "activate"), this.activate(t));
  }
  /**
   * Activate tab
   *
   * @param {boolean} focus
   * @return void
   */
  activate(t = !0) {
    this.active = !0, this.el.setAttribute("tabindex", "0"), this.el.setAttribute("aria-selected", "true"), this.el.classList.add("is-active"), t && this.focus();
  }
  /**
   * Deactivate tab
   *
   * @return void
   */
  deactivate() {
    this.active = !1, this.el.setAttribute("tabindex", "-1"), this.el.setAttribute("aria-selected", "false"), this.el.classList.remove("is-active");
  }
  /**
   * Focus tab
   *
   * @return void
   */
  focus = () => this.el.focus();
  /**
   * Delete tab
   *
   * @return void
   */
  delete = () => {
    o(this.el, { controls: this.controls, element: this.el }, "delete"), this.el.parentElement?.removeChild(this.el);
  };
  destroy() {
    this.el.removeAttribute("tabindex"), this.el.removeAttribute("aria-selected"), this.el.classList.remove("is-active"), this.el.removeEventListener("click", this.handleClick);
  }
}
const p = {
  delay: v,
  callback() {
  }
};
class m extends HTMLElement {
  $tabList;
  current = 0;
  tabPanels = [];
  tabs = [];
  href = "";
  options;
  hash = b;
  constructor() {
    super(), this.$tabList = null, this.options = p;
  }
  connectedCallback() {
    this.$tabList = this.querySelector('[role="tablist"]');
    const t = this.getAttribute("data-tabs-hash");
    this.hash = t === null ? this.hash : t !== "false" && t !== "0", this.href = this.hash && u(window.location.hash) || "", this.init();
  }
  disconnectedCallback() {
    this.destroy();
  }
  init() {
    this.$tabList && (this.tabs = [...this.$tabList.querySelectorAll('[role="tab"]')].map(
      (t) => new g(t, this.options.callback)
    ), this.tabs.forEach((t, e) => {
      this.tabPanels.push(
        new f(this.querySelector(`#${t.controls}[role="tabpanel"]`))
      ), t.init(), t.el.addEventListener("Tab.activate", () => {
        this.current = e, this.deactivateTabs(), this.deactivateTabPanels(), this.tabPanels.find((i) => i.id === t.controls).activate(), this.hash && (this.href = t.id, window.location.hash = t.id);
      }), (t.active || t.id === this.href || this.current === e) && (this.deactivateTabs(), this.deactivateTabPanels(), t.activate(!1), this.tabPanels.find((i) => i.id === t.controls).activate());
    }), this.initEvents());
  }
  initEvents() {
    this.$tabList?.addEventListener("keydown", this.handleKeydown);
  }
  handleKeydown = (t) => {
    const { key: e, code: i, target: d } = t, a = JSON.parse(
      d.getAttribute("aria-selected")
    ), h = () => {
      this.current = 0 > this.current - 1 ? this.tabs.length - 1 : this.current - 1, this.tabs[this.current].focus(), this.options.delay && setTimeout(() => {
        this.tabs[this.current].toggle(!1);
      }, this.options.delay);
    }, r = () => {
      this.current = this.current + 1 > this.tabs.length - 1 ? 0 : this.current + 1, this.tabs[this.current].focus(), this.options.delay && setTimeout(() => {
        this.tabs[this.current].toggle(!1);
      }, this.options.delay);
    }, l = () => {
      t.preventDefault(), this.current = 0, this.tabs[this.current].toggle();
    }, n = () => {
      t.preventDefault(), this.current = this.tabs.length - 1, this.tabs[this.current].toggle();
    }, c = {
      ArrowUp: h,
      ArrowLeft: h,
      ArrowDown: r,
      ArrowRight: r,
      End: n,
      Home: l,
      PageUp: l,
      PageDown: n,
      Delete: () => a && this.delete(t),
      Backspace: () => a && this.delete(t),
      default: () => !1
    };
    return (c[e || i] || c.default)();
  };
  deactivateTabs = () => this.tabs.forEach((t) => t.deactivate());
  deactivateTabPanels = () => this.tabPanels.forEach((t) => t.deactivate());
  delete({ target: t }) {
    return t.getAttribute("data-deletable") === null ? !1 : (this.tabs[this.current].delete(), this.tabPanels[this.current].delete(), this.tabs.splice(this.current, 1), this.tabPanels.splice(this.current, 1), this.current = 0 > this.current - 1 ? 0 : this.current - 1, this.tabs[this.current].toggle(), !0);
  }
  destroy() {
    this.$tabList?.removeEventListener("keydown", this.handleKeydown), this.tabs.forEach((t) => t.destroy()), this.tabPanels.forEach((t) => t.destroy()), this.tabs = [], this.tabPanels = [];
  }
}
customElements.get("cinq-tabs") || customElements.define("cinq-tabs", m);
export {
  m as Tabs
};
