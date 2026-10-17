import { EVENTS as e, dispatchBeforeEvent as t } from "@agencecinq/utils";
//#region src/modal.ts
var n = "closedBy" in HTMLDialogElement.prototype, r = class r extends HTMLElement {
	trigger = null;
	$dialog = null;
	#e = null;
	#t = (e) => {
		let t = e.source instanceof HTMLElement ? e.source : null;
		switch (e.command) {
			case "show-modal": {
				let n = t?.hasAttribute("data-replace") ? t.closest("cinq-modal") : null;
				e.preventDefault(), this.trigger = t, n instanceof r && n !== this ? this.#i(n) : this.show();
				break;
			}
			case "request-close": {
				let n = t?.getAttribute("value") ?? void 0;
				e.preventDefault(), this.close(n);
				break;
			}
		}
	};
	#n = (e) => {
		e.cancelable && (e.preventDefault(), this.close());
	};
	#r = (e) => {
		let t = this.$dialog;
		if (!t || e.target !== t || t.getAttribute("closedby") !== "any") return;
		let n = t.getBoundingClientRect();
		e.clientX >= n.left && e.clientX <= n.right && e.clientY >= n.top && e.clientY <= n.bottom || this.close();
	};
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$dialog = null;
	}
	init() {
		if (this.$dialog = this.querySelector("dialog"), !this.$dialog) throw Error("Modal: No <dialog> found");
		if (!this.$dialog.id) throw Error("Modal: dialog id attribute is required");
		this.$dialog.addEventListener("command", this.#t), this.$dialog.addEventListener("cancel", this.#n), n || this.$dialog.addEventListener("click", this.#r);
	}
	destroy() {
		this.$dialog && (this.$dialog.removeEventListener("command", this.#t), this.$dialog.removeEventListener("cancel", this.#n), this.$dialog.removeEventListener("click", this.#r), this.$dialog.open && this.$dialog.close());
	}
	show() {
		return this.#a(() => this.#o(!0));
	}
	close(t) {
		if (!this.$dialog?.open) return Promise.resolve(!1);
		let n = {
			modal: this.$dialog.id,
			instance: this
		};
		return this.#s(e.MODAL_BEFORE_CLOSE, n, () => this.#o(!1, t));
	}
	#i(e) {
		return this.#a(async () => await e.close() && this.#o(!0));
	}
	#a(t) {
		if (!this.$dialog || this.$dialog.open) return Promise.resolve(!1);
		let n = {
			modal: this.$dialog.id,
			instance: this,
			trigger: this.trigger
		};
		return this.#s(e.MODAL_BEFORE_OPEN, n, t);
	}
	#o(e, t) {
		let n = this.$dialog;
		return !n || n.open === e ? !1 : (e ? n.showModal() : n.close(t), !0);
	}
	#s(e, n, r) {
		if (this.#e) return this.#e;
		let i = t(document.documentElement, e, n);
		if (i === !1) return Promise.resolve(!1);
		let a = i === !0 ? r() : i.then((e) => e && r());
		return typeof a == "boolean" ? Promise.resolve(a) : (this.#e = a.finally(() => {
			this.#e = null;
		}), this.#e);
	}
};
customElements.get("cinq-modal") || customElements.define("cinq-modal", r);
//#endregion
export { r as Modal };
