import { EVENTS as e, dispatchBeforeEvent as t, dispatchEvent as n, getFocusableElements as r } from "@agencecinq/utils";
//#region src/modal.ts
var i = class extends HTMLElement {
	trigger = null;
	$modal = null;
	#e = null;
	#t = (e) => {
		e.target === e.currentTarget && this.close();
	};
	#n = (e) => {
		e.preventDefault(), this.close();
	};
	#r = () => {
		this.removeAttribute("open");
	};
	#i = (e) => {
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
		this.$modal.addEventListener("click", this.#t), this.$modal.addEventListener("cancel", this.#n), this.$modal.addEventListener("close", this.#r), document.documentElement.addEventListener(e.MODAL_TOGGLE, this.#i);
	}
	destroy() {
		this.$modal && (this.$modal.removeEventListener("click", this.#t), this.$modal.removeEventListener("cancel", this.#n), this.$modal.removeEventListener("close", this.#r), this.hasAttribute("open") && this.$modal.open && this.$modal.close()), document.documentElement.removeEventListener(e.MODAL_TOGGLE, this.#i);
	}
	show() {
		return this.hasAttribute("open") ? Promise.resolve(!1) : this.#a(e.MODAL_BEFORE_OPEN, {
			modal: this.id,
			instance: this,
			trigger: this.trigger
		}, !0);
	}
	close() {
		return this.hasAttribute("open") ? this.#a(e.MODAL_BEFORE_CLOSE, {
			modal: this.id,
			instance: this
		}, !1) : Promise.resolve(!1);
	}
	#a(e, n, r) {
		if (this.#e) return this.#e;
		let i = (e) => !e || this.hasAttribute("open") === r ? !1 : (this.toggleAttribute("open", r), !0), a = t(document.documentElement, e, n);
		return typeof a == "boolean" ? Promise.resolve(i(a)) : (this.#e = a.then(i).finally(() => {
			this.#e = null;
		}), this.#e);
	}
	attributeChangedCallback(t, i, a) {
		if (!(!this.isConnected || t !== "open")) {
			if (a !== null) {
				if (this.$modal && !this.$modal.open) {
					this.$modal.showModal(), n(document.documentElement, e.MODAL_OPEN, {
						modal: this.id,
						trigger: this.trigger
					}, {
						bubbles: !1,
						cancelable: !1
					});
					let t = r(this.$modal);
					t.length > 0 && t[0].focus();
				}
				return;
			}
			this.$modal?.open && this.$modal.close(), n(document.documentElement, e.MODAL_CLOSE, { modal: this.id }, {
				bubbles: !1,
				cancelable: !1
			});
		}
	}
};
customElements.get("cinq-modal") || customElements.define("cinq-modal", i);
//#endregion
//#region src/modal-button.ts
var a = class extends HTMLElement {
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
		this.$button && this.controls.forEach((t) => {
			let r = {
				trigger: this.$button,
				modal: t
			};
			n(document.documentElement, e.MODAL_TOGGLE, r, {
				bubbles: !1,
				cancelable: !1
			});
		});
	};
};
customElements.get("cinq-modal-button") || customElements.define("cinq-modal-button", a);
//#endregion
export { i as Modal, a as ModalButton };
