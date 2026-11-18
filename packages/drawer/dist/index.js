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
		let { source: t, command: n } = e, i = t instanceof HTMLElement ? t : null, a = this.#o(n);
		if (!a) return;
		if (e.preventDefault(), a === "close") {
			let e = i?.getAttribute("value") ?? void 0;
			this.close(e);
			return;
		}
		let o = i?.hasAttribute("data-replace") ? i.closest("cinq-drawer") : null;
		this.trigger = i, o instanceof r && o !== this ? this.#s(o) : this.show();
	};
	#i = (e) => {
		e.cancelable && (e.preventDefault(), this.close());
	};
	#a = (e) => {
		let t = this.$dialog, { target: n, clientX: r, clientY: i } = e;
		if (!t || n !== t || t.getAttribute("closedby") !== "any") return;
		let { top: a, right: o, bottom: s, left: c } = t.getBoundingClientRect();
		r >= c && r <= o && i >= a && i <= s || this.close();
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
		if (this.#t && e) {
			let e = this.trigger ?? void 0;
			return n.showPopover({ source: e }), !0;
		}
		return this.#t ? (n.hidePopover(), !0) : e ? (n.showModal(), !0) : (n.close(t), !0);
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
