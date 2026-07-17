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
	ACCORDION_PANEL_OPEN: "accordion-panel:open",
	ACCORDION_PANEL_CLOSE: "accordion-panel:close",
	COMBOBOX_LOADING: "combobox:loading",
	COMBOBOX_LOADED: "combobox:loaded",
	COMBOBOX_UPDATE: "combobox:update",
	COMBOBOX_SUBMIT: "combobox:submit",
	COMBOBOX_EMPTY: "combobox:empty",
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
//#region src/modal.ts
var a = class extends HTMLElement {
	$modal = null;
	handleClick = (e) => {
		e.target === e.currentTarget && this.close();
	};
	handleModalToggle = (e) => {
		let { modal: t } = e.detail;
		t === this.id && (this.$modal?.open ? this.close() : this.show());
	};
	constructor() {
		super();
	}
	connectedCallback() {
		if (this.$modal = this.querySelector("[data-dialog]") || this.querySelector("dialog"), !this.$modal) throw Error("Modal: No dialog found");
		this.$modal.addEventListener("click", this.handleClick), document.documentElement.addEventListener(e.MODAL_TOGGLE, this.handleModalToggle);
	}
	disconnectedCallback() {
		this.$modal && this.$modal.removeEventListener("click", this.handleClick), document.documentElement.removeEventListener(e.MODAL_TOGGLE, this.handleModalToggle), this.$modal = null;
	}
	close = () => {
		this.$modal && (this.$modal.close(), document.documentElement.dispatchEvent(new CustomEvent(e.MODAL_CLOSE)));
	};
	show = () => {
		this.$modal && (this.$modal.showModal(), document.documentElement.dispatchEvent(new CustomEvent(e.MODAL_OPEN, { detail: { modal: this.id } })));
	};
};
customElements.get("cinq-modal") || customElements.define("cinq-modal", a);
//#endregion
//#region src/modal-button.ts
var o = class extends HTMLElement {
	$button = null;
	controls = [];
	handleModalClose = () => this.$button?.setAttribute("aria-pressed", "false");
	handleModalOpen = (e) => {
		let { modal: t } = e.detail;
		this.$button && this.controls.includes(t) && this.$button.setAttribute("aria-pressed", "true");
	};
	connectedCallback() {
		if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button) throw Error("ModalButton: No button found");
		this.controls = this.$button.getAttribute("aria-controls")?.trim().split(" ") || [], this.$button.addEventListener("click", this.show), document.documentElement.addEventListener(e.MODAL_CLOSE, this.handleModalClose), document.documentElement.addEventListener(e.MODAL_OPEN, this.handleModalOpen);
	}
	disconnectedCallback() {
		this.$button && this.$button.removeEventListener("click", this.show), document.documentElement.removeEventListener(e.MODAL_CLOSE, this.handleModalClose), document.documentElement.removeEventListener(e.MODAL_OPEN, this.handleModalOpen), this.$button = null, this.controls = [];
	}
	show = () => {
		this.$button && (this.$button.setAttribute("aria-pressed", "true"), this.controls.forEach((t) => {
			let n = {
				trigger: this.$button,
				trap: document.getElementById(`${this.$button?.getAttribute("data-trap")}`),
				modal: t
			};
			document.documentElement.dispatchEvent(new CustomEvent(e.MODAL_TOGGLE, { detail: n }));
		}));
	};
};
customElements.get("cinq-modal-button") || customElements.define("cinq-modal-button", o);
//#endregion
export { a as Modal, o as ModalButton };
