import { EVENTS as e, dispatchEvent as t, focusByKey as n } from "@agencecinq/utils";
//#region src/utils/getHash.ts
function r(e) {
	let t = e.indexOf("#");
	return t === -1 ? "" : e.substring(t + 1);
}
//#endregion
//#region src/TabPanel.ts
var i = class {
	el;
	id;
	constructor(e) {
		this.el = e, this.id = e.id;
	}
	deactivate() {
		console.log("TabPanel.deactivate", this.id), this.el.setAttribute("hidden", "true"), this.el.classList.remove("is-active");
	}
	activate() {
		this.el.removeAttribute("hidden"), this.el.classList.add("is-active");
	}
	delete = () => this.el.parentElement?.removeChild(this.el);
	destroy() {
		this.el.removeAttribute("hidden"), this.el.classList.remove("is-active");
	}
}, a = class {
	el;
	active = !1;
	id = "";
	index;
	controls;
	constructor(e, t) {
		this.el = e, this.index = t, this.id = e.id;
		let n = (e.ariaControlsElements ?? [])[0];
		this.controls = n?.id ?? "";
		let r = e.getAttribute("aria-selected");
		this.active = r === "true";
	}
	init = () => this.initEvents();
	initEvents = () => this.el.addEventListener("click", this.handleClick);
	handleClick = () => this.toggle();
	toggle(n = !0) {
		this.active || t(this.el, e.TABS_BEFORE_ACTIVATE, {
			index: this.index,
			controls: this.controls,
			element: this.el
		}) && (t(this.el, e.TABS_ACTIVATE, {
			controls: this.controls,
			element: this.el
		}, { cancelable: !1 }), this.activate(n));
	}
	activate(e = !0) {
		this.active = !0, this.el.setAttribute("tabindex", "0"), this.el.setAttribute("aria-selected", "true"), this.el.classList.add("is-active"), e && this.focus();
	}
	deactivate() {
		this.active = !1, this.el.setAttribute("tabindex", "-1"), this.el.setAttribute("aria-selected", "false"), this.el.classList.remove("is-active");
	}
	focus = () => this.el.focus();
	delete = () => {
		t(this.el, e.TABS_DELETE, {
			controls: this.controls,
			element: this.el
		}, { cancelable: !1 }), this.el.parentElement?.removeChild(this.el);
	};
	destroy() {
		this.el.removeAttribute("tabindex"), this.el.removeAttribute("aria-selected"), this.el.classList.remove("is-active"), this.el.removeEventListener("click", this.handleClick);
	}
}, o = class extends HTMLElement {
	$tabList;
	current = 0;
	tabPanels = [];
	tabs = [];
	href = "";
	hash = !1;
	delay = 0;
	constructor() {
		super(), this.$tabList = null;
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		this.$tabList = this.querySelector("[role=\"tablist\"]");
		let t = this.getAttribute("data-hash"), n = this.getAttribute("data-delay");
		if (this.hash = t === null ? this.hash : t !== "false" && t !== "0", n !== null) {
			let e = parseInt(n, 10);
			this.delay = Number.isNaN(e) ? 0 : e;
		}
		if (this.href = this.hash && r(window.location.hash) || "", !this.$tabList) return;
		if (this.tabs = [...this.$tabList.querySelectorAll("[role=\"tab\"]")].map((e, t) => new a(e, t)), this.tabs.forEach((t, n) => {
			this.tabPanels.push(new i(this.querySelector(`#${t.controls}[role="tabpanel"]`))), t.init(), t.el.addEventListener(e.TABS_ACTIVATE, () => {
				this.current = n, this.deactivateTabs(), this.deactivateTabPanels(), t.activate(!1), this.tabPanels.find((e) => e.id === t.controls)?.activate(), this.hash && (this.href = t.id, window.location.hash = t.id);
			});
		}), this.href) {
			let e = this.tabs.findIndex((e) => e.id === this.href);
			e >= 0 && (this.current = e);
		}
		if (!this.href || this.current === 0) {
			let e = this.tabs.findIndex((e) => e.active);
			e >= 0 && (this.current = e);
		}
		let o = this.tabs[this.current];
		o && (this.deactivateTabs(), this.deactivateTabPanels(), o.activate(!1), this.tabPanels.find((e) => e.id === o.controls)?.activate()), this.initEvents();
	}
	initEvents() {
		this.$tabList?.addEventListener("keydown", this.handleKeydown);
	}
	handleKeydown = (e) => {
		let { key: t } = e, r = e.target, i = this.tabs.map((e) => e.el), a = i.indexOf(r);
		if (a === -1) return;
		if (t === "Delete" || t === "Backspace") {
			r.getAttribute("aria-selected") === "true" && this.delete(e);
			return;
		}
		let o = n(e, i, a);
		o !== void 0 && (this.current = o, this.delay && setTimeout(() => {
			this.tabs[this.current].toggle(!1);
		}, this.delay));
	};
	deactivateTabs = () => this.tabs.forEach((e) => e.deactivate());
	deactivateTabPanels = () => this.tabPanels.forEach((e) => e.deactivate());
	delete({ target: e }) {
		return e.getAttribute("data-deletable") !== null && (this.tabs[this.current].delete(), this.tabPanels[this.current].delete(), this.tabs.splice(this.current, 1), this.tabPanels.splice(this.current, 1), this.current = 0 > this.current - 1 ? 0 : this.current - 1, this.tabs[this.current].toggle(), !0);
	}
	destroy() {
		this.$tabList?.removeEventListener("keydown", this.handleKeydown), this.tabs.forEach((e) => e.destroy()), this.tabPanels.forEach((e) => e.destroy()), this.tabs = [], this.tabPanels = [];
	}
};
customElements.get("cinq-tabs") || customElements.define("cinq-tabs", o);
//#endregion
export { o as Tabs };
