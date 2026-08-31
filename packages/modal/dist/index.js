//#region ../utils/dist/index.js
var e = {
	DRAWER_BEFORE_CLOSE: "drawer:before-close",
	DRAWER_BEFORE_OPEN: "drawer:before-open",
	DRAWER_CLOSE: "drawer:close",
	DRAWER_OPEN: "drawer:open",
	DRAWER_TOGGLE: "drawer:toggle",
	MODAL_BEFORE_CLOSE: "modal:before-close",
	MODAL_BEFORE_OPEN: "modal:before-open",
	MODAL_CLOSE: "modal:close",
	MODAL_OPEN: "modal:open",
	MODAL_TOGGLE: "modal:toggle",
	SPINBUTTON_CHANGE: "spinbutton:change",
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
	WINDOWSPLITTER_CHANGE: "windowsplitter:change",
	CALENDAR_CHANGE: "calendar:change",
	TABS_BEFORE_ACTIVATE: "tabs:before-activate",
	TABS_ACTIVATE: "tabs:activate",
	TABS_DELETE: "tabs:delete",
	CART_BEFORE_ADD: "cart:before-add",
	CART_BEFORE_UPDATE: "cart:before-update",
	CART_UPDATE: "cart:update",
	VARIANT_CHANGE: "variant:change"
}, t = (e, t, n, r = {}) => {
	let { bubbles: i = !0, cancelable: a = !0 } = r;
	return e.dispatchEvent(new CustomEvent(t, {
		bubbles: i,
		cancelable: a,
		detail: n
	}));
}, n = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, r = document.documentElement, { body: i } = document;
r.hasAttribute("data-debug"), window.addEventListener("pointermove", n(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
function a(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function o(e) {
	if (!e) return [];
	let t = [
		"summary",
		"a[href]",
		"button:enabled",
		"[tabindex]:not([tabindex^=\"-\"])",
		"input:not([type=hidden]):enabled",
		"select:enabled",
		"textarea:enabled",
		"object",
		"iframe",
		"[contenteditable]"
	].join(",");
	return Array.from(e.querySelectorAll(t)).filter((e) => a(e) && e.getAttribute("tabindex") !== "-1");
}
//#endregion
//#region src/modal.ts
var s = class extends HTMLElement {
	trigger = null;
	$modal = null;
	#e = (e) => {
		e.target === e.currentTarget && this.close();
	};
	#t = (e) => {
		e.preventDefault(), this.close();
	};
	#n = (e) => {
		let { modal: t, trigger: n } = e.detail;
		if (t === this.id) {
			if (this.hasAttribute("open")) {
				this.close();
				return;
			}
			n && (this.trigger = n), this.show();
		}
	};
	constructor() {
		super();
	}
	static get observedAttributes() {
		return ["open"];
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$modal = null;
	}
	init() {
		if (this.$modal = this.querySelector("[data-dialog]") || this.querySelector("dialog"), !this.$modal) throw Error("Modal: No dialog found");
		if (!this.id) throw Error("Modal: id attribute is required");
		this.$modal.addEventListener("click", this.#e), this.$modal.addEventListener("cancel", this.#t), document.documentElement.addEventListener(e.MODAL_TOGGLE, this.#n);
	}
	destroy() {
		this.$modal && (this.$modal.removeEventListener("click", this.#e), this.$modal.removeEventListener("cancel", this.#t), this.hasAttribute("open") && this.$modal.open && this.$modal.close()), document.documentElement.removeEventListener(e.MODAL_TOGGLE, this.#n);
	}
	show() {
		if (this.hasAttribute("open")) return !1;
		let n = () => this.setAttribute("open", "");
		return t(document.documentElement, e.MODAL_BEFORE_OPEN, {
			modal: this.id,
			instance: this,
			trigger: this.trigger,
			resolve: n
		}, { bubbles: !1 }) ? (n(), !0) : this.hasAttribute("open");
	}
	close() {
		if (!this.hasAttribute("open")) return !1;
		let n = () => this.removeAttribute("open");
		return t(document.documentElement, e.MODAL_BEFORE_CLOSE, {
			modal: this.id,
			instance: this,
			resolve: n
		}, { bubbles: !1 }) ? (n(), !0) : !this.hasAttribute("open");
	}
	attributeChangedCallback(n, r, i) {
		if (!(!this.isConnected || n !== "open")) {
			if (i !== null) {
				if (this.$modal && !this.$modal.open) {
					this.$modal.showModal(), t(document.documentElement, e.MODAL_OPEN, {
						modal: this.id,
						trigger: this.trigger
					}, {
						bubbles: !1,
						cancelable: !1
					});
					let n = o(this.$modal);
					n.length > 0 && n[0].focus();
				}
				return;
			}
			this.$modal?.open && this.$modal.close(), t(document.documentElement, e.MODAL_CLOSE, { modal: this.id }, {
				bubbles: !1,
				cancelable: !1
			});
		}
	}
};
customElements.get("cinq-modal") || customElements.define("cinq-modal", s);
//#endregion
//#region src/modal-button.ts
var c = class extends HTMLElement {
	$button = null;
	controls = [];
	#e = (e) => {
		this.$button && this.controls.includes(e.detail.modal) && this.$button.setAttribute("aria-pressed", "false");
	};
	#t = (e) => {
		this.$button && this.controls.includes(e.detail.modal) && this.$button.setAttribute("aria-pressed", "true");
	};
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$button = null, this.controls = [];
	}
	init() {
		if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button) throw Error("ModalButton: No button found");
		this.controls = (this.$button.ariaControlsElements ?? []).map((e) => e.id), this.$button.addEventListener("click", this.show), document.documentElement.addEventListener(e.MODAL_CLOSE, this.#e), document.documentElement.addEventListener(e.MODAL_OPEN, this.#t);
	}
	destroy() {
		this.$button && this.$button.removeEventListener("click", this.show), document.documentElement.removeEventListener(e.MODAL_CLOSE, this.#e), document.documentElement.removeEventListener(e.MODAL_OPEN, this.#t);
	}
	show = () => {
		this.$button && this.controls.forEach((n) => {
			let r = this.$button?.getAttribute("data-trap"), i = {
				trigger: this.$button,
				trap: r ? document.getElementById(r) : null,
				modal: n
			};
			t(document.documentElement, e.MODAL_TOGGLE, i, {
				bubbles: !1,
				cancelable: !1
			});
		});
	};
};
customElements.get("cinq-modal-button") || customElements.define("cinq-modal-button", c);
//#endregion
export { s as Modal, c as ModalButton };
