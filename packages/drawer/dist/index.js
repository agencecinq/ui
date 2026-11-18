import { EVENTS as e, dispatchBeforeEvent as t } from "@agencecinq/utils";
//#region src/drawer.ts
var n = "closedBy" in HTMLDialogElement.prototype, r = class r extends HTMLElement {
	trigger = null;
	$dialog = null;
	#e = null;
	get #t() {
		return this.$dialog?.hasAttribute("popover") ?? !1;
	}
	get #n() {
		return this.$dialog ? this.#t ? this.$dialog.matches(":popover-open") : this.$dialog.open : !1;
	}
	#r = (e) => {
		let t = e.source instanceof HTMLElement ? e.source : null, n = this.#o(e.command);
		if (!n) return;
		if (e.preventDefault(), n === "close") {
			let e = t?.getAttribute("value") ?? void 0;
			this.close(e);
			return;
		}
		let i = t?.hasAttribute("data-replace") ? t.closest("cinq-drawer") : null;
		this.trigger = t, i instanceof r && i !== this ? this.#s(i) : this.show();
	};
	#i = (e) => {
		e.cancelable && (e.preventDefault(), this.close());
	};
	#a = (e) => {
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
		if (this.$dialog = this.querySelector("dialog"), !this.$dialog) throw Error("Drawer: No <dialog> found");
		if (!this.$dialog.id) throw Error("Drawer: dialog id attribute is required");
		this.$dialog.addEventListener("command", this.#r), this.$dialog.addEventListener("cancel", this.#i), n || this.$dialog.addEventListener("click", this.#a);
	}
	destroy() {
		this.$dialog && (this.$dialog.removeEventListener("command", this.#r), this.$dialog.removeEventListener("cancel", this.#i), this.$dialog.removeEventListener("click", this.#a), this.#l(!1));
	}
	show() {
		return this.#c(() => this.#l(!0));
	}
	close(t) {
		if (!this.$dialog || !this.#n) return Promise.resolve(!1);
		let n = {
			drawer: this.$dialog.id,
			instance: this
		};
		return this.#u(e.DRAWER_BEFORE_CLOSE, n, () => this.#l(!1, t));
	}
	#o(e) {
		if (this.#t) {
			switch (e) {
				case "show-popover": return "show";
				case "hide-popover": return "close";
				case "toggle-popover": return this.#n ? "close" : "show";
			}
			return null;
		}
		switch (e) {
			case "show-modal": return "show";
			case "request-close": return "close";
		}
		return null;
	}
	#s(e) {
		return this.#c(async () => await e.close() && this.#l(!0));
	}
	#c(t) {
		if (!this.$dialog || this.#n) return Promise.resolve(!1);
		let n = {
			drawer: this.$dialog.id,
			instance: this,
			trigger: this.trigger
		};
		return this.#u(e.DRAWER_BEFORE_OPEN, n, t);
	}
	#l(e, t) {
		let n = this.$dialog;
		if (!n || this.#n === e) return !1;
		if (this.#t) {
			let t = this.trigger ?? void 0;
			e ? n.showPopover({ source: t }) : n.hidePopover();
		} else e ? n.showModal() : n.close(t);
		return !0;
	}
	#u(e, n, r) {
		if (this.#e) return this.#e;
		let i = t(document.documentElement, e, n);
		if (i === !1) return Promise.resolve(!1);
		let a = i === !0 ? r() : i.then((e) => e && r());
		return typeof a == "boolean" ? Promise.resolve(a) : (this.#e = a.finally(() => {
			this.#e = null;
		}), this.#e);
	}
};
customElements.get("cinq-drawer") || customElements.define("cinq-drawer", r);
//#endregion
export { r as Drawer };
