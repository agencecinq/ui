//#region ../utils/dist/index.js
var e = {
	DRAWER_CLOSE: "drawer-close",
	DRAWER_OPEN: "drawer-open",
	DRAWER_TOGGLE: "drawer-toggle",
	MODAL_CLOSE: "modal-close",
	MODAL_OPEN: "modal-open",
	MODAL_TOGGLE: "modal-toggle",
	SPINBUTTON_CHANGE: "spinbutton-change",
	DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
	DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close",
	SWITCH_ACTIVATE: "switch:activate",
	SWITCH_DEACTIVATE: "switch:deactivate",
	TAB_BEFORE_ACTIVATE: "tab-before-activate",
	TAB_ACTIVATE: "tab-activate",
	TAB_DELETE: "tab-delete",
	CART_BEFORE_ADD: "cart-before-add",
	CART_BEFORE_UPDATE: "cart-before-update",
	CART_UPDATE: "cart-update",
	VARIANT_CHANGE: "variant-change"
}, t = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, n = document.documentElement, { body: r } = document;
n.hasAttribute("data-debug");
var i = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", t(({ x: e, y: t }) => {
	i.x = e, i.y = t;
}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/disclosure-button.ts
var a = (e, t, n) => e.dispatchEvent(new CustomEvent(n, {
	bubbles: !0,
	cancelable: !0,
	detail: t
})), o = (e, t) => {
	e.hidden = !t;
}, s = (e) => {
	e.forEach((e) => {
		o(e, !0);
	});
}, c = (e) => {
	e.forEach((e) => {
		o(e, !1);
	});
}, l = (e) => !e.hidden, u = (e) => e ? e.trim().split(/\s+/).map((e) => e.trim()).filter(Boolean) : [], d = (e, t) => e.elements.some((e) => t.includes(e)), f = class extends HTMLElement {
	static observedAttributes = ["expanded"];
	$button = null;
	elements = [];
	controlIds = [];
	observer = null;
	reflectingAttribute = !1;
	connectedCallback() {
		if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button) throw Error("DisclosureButton: button element not found");
		if (this.controlIds = u(this.$button.getAttribute("aria-controls")), this.controlIds.length === 0) return;
		let e = this.controlIds.map((e) => `#${e}`).join(",");
		this.elements = [...document.querySelectorAll(e)], this.initEvents(), this.updateExpandedFromElements(), this.observer = new MutationObserver(() => {
			this.reflectingAttribute || this.reflectExpandedAttribute();
		}), this.observer.observe(this.$button, {
			attributes: !0,
			attributeFilter: ["aria-expanded"]
		}), this.reflectExpandedAttribute();
	}
	disconnectedCallback() {
		this.destroy(), this.$button = null, this.elements = [], this.controlIds = [];
	}
	attributeChangedCallback(e, t, n) {
		if (e !== "expanded" || !this.$button || this.reflectingAttribute) return;
		let r = this.$button.getAttribute("aria-expanded") === "true";
		if (n !== null && !r) {
			this.open();
			return;
		}
		n === null && r && this.close();
	}
	get button() {
		return this.$button;
	}
	get expanded() {
		return this.$button?.getAttribute("aria-expanded") === "true";
	}
	toggle() {
		return this.$button ? this.isExpanded() ? a(this.$button, this.detail, e.DISCLOSURE_BUTTON_CLOSE) ? (this.close(!1), !0) : !1 : a(this.$button, this.detail, e.DISCLOSURE_BUTTON_OPEN) ? (this.open(!1), !0) : !1 : !1;
	}
	close(t = !0) {
		this.$button && (t && this.isExpanded() && !a(this.$button, this.detail, e.DISCLOSURE_BUTTON_CLOSE) || (c(this.elements), this.updateExpandedFromElements()));
	}
	open(t = !0) {
		this.$button && (t && !this.isExpanded() && !a(this.$button, this.detail, e.DISCLOSURE_BUTTON_OPEN) || (s(this.elements), this.updateExpandedFromElements()));
	}
	destroy() {
		this.$button && (this.$button.removeEventListener("click", this.handleClick), this.$button.removeEventListener("focus", this.handleFocus), this.$button.removeEventListener("blur", this.handleBlur), document.removeEventListener(e.DISCLOSURE_BUTTON_OPEN, this.handleLinkedChange), document.removeEventListener(e.DISCLOSURE_BUTTON_CLOSE, this.handleLinkedChange), this.observer?.disconnect(), this.observer = null);
	}
	initEvents() {
		this.$button && (this.$button.addEventListener("click", this.handleClick), this.$button.addEventListener("focus", this.handleFocus), this.$button.addEventListener("blur", this.handleBlur), document.addEventListener(e.DISCLOSURE_BUTTON_OPEN, this.handleLinkedChange), document.addEventListener(e.DISCLOSURE_BUTTON_CLOSE, this.handleLinkedChange));
	}
	handleClick = () => {
		this.toggle();
	};
	handleFocus = () => {
		this.$button?.classList.add("focus");
	};
	handleBlur = () => {
		this.$button?.classList.remove("focus");
	};
	handleLinkedChange = (e) => {
		if (!(e instanceof CustomEvent) || !this.$button) return;
		let t = e.detail;
		t.el !== this.$button && d(t, this.elements) && queueMicrotask(() => {
			this.updateExpandedFromElements();
		});
	};
	get detail() {
		return {
			ids: this.controlIds,
			elements: this.elements,
			el: this.$button
		};
	}
	isExpanded() {
		return this.$button?.getAttribute("aria-expanded") === "true";
	}
	updateExpandedFromElements() {
		if (!this.$button) return;
		if (this.elements.length === 0) {
			this.$button.setAttribute("aria-expanded", "false");
			return;
		}
		let e = this.elements.every((e) => l(e));
		this.$button.setAttribute("aria-expanded", e ? "true" : "false");
	}
	reflectExpandedAttribute() {
		this.$button && (this.reflectingAttribute = !0, this.$button.getAttribute("aria-expanded") === "true" ? this.setAttribute("expanded", "") : this.removeAttribute("expanded"), this.reflectingAttribute = !1);
	}
};
customElements.get("cinq-disclosure-button") || customElements.define("cinq-disclosure-button", f);
//#endregion
export { f as DisclosureButton };
