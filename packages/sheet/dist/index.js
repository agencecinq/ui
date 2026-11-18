import { EVENTS as e, dispatchBeforeEvent as t, trackDrag as n } from "@agencecinq/utils";
//#region src/sheet.ts
var r = "closedBy" in HTMLDialogElement.prototype, i = 80, a = .5, o = 8, s = 300, c = class c extends HTMLElement {
	trigger = null;
	$dialog = null;
	$handle = null;
	#e = null;
	#t = null;
	#n = 0;
	#r = null;
	get #i() {
		return this.$dialog?.hasAttribute("popover") ?? !1;
	}
	get #a() {
		return this.$dialog ? this.#i ? this.$dialog.matches(":popover-open") : this.$dialog.open : !1;
	}
	get dismissible() {
		return this.$dialog !== null && this.$dialog.getAttribute("closedby") !== "none";
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$dialog = null, this.$handle = null;
	}
	init() {
		if (this.$dialog = this.querySelector("dialog"), !this.$dialog) throw Error("Sheet: No <dialog> found");
		if (!this.$dialog.id) throw Error("Sheet: dialog id attribute is required");
		this.$handle = this.$dialog.querySelector("[data-dom=\"drag-indicator\"]"), this.$dialog.addEventListener("command", this.#o), this.$dialog.addEventListener("cancel", this.#s), this.$dialog.addEventListener("toggle", this.#c), r || this.$dialog.addEventListener("click", this.#l), this.$handle && (this.#e = n(this.$handle, {
			host: this,
			start: () => this.#a,
			move: this.#v,
			end: this.#y
		})), this.#t = n(document, {
			target: this.#h,
			start: this.#g,
			end: this.#_
		});
	}
	destroy() {
		this.#e?.destroy(), this.#t?.destroy(), this.#e = null, this.#t = null, this.$dialog && (this.$dialog.removeEventListener("command", this.#o), this.$dialog.removeEventListener("cancel", this.#s), this.$dialog.removeEventListener("toggle", this.#c), this.$dialog.removeEventListener("click", this.#l), this.#p(!1));
	}
	show() {
		return this.#f(() => this.#p(!0));
	}
	close(t) {
		if (!this.$dialog || !this.#a) return Promise.resolve(!1);
		let n = {
			sheet: this.$dialog.id,
			instance: this
		};
		return this.#m(e.SHEET_BEFORE_CLOSE, n, () => this.#p(!1, t));
	}
	#o = (e) => {
		let { source: t, command: n, timeStamp: r } = e, i = t instanceof HTMLElement ? t : null, a = this.#u(n);
		if (!a) return;
		if (e.preventDefault(), r < this.#n) {
			this.#n = 0;
			return;
		}
		if (a === "close") {
			let e = i?.getAttribute("value") ?? void 0;
			this.close(e);
			return;
		}
		let o = i?.hasAttribute("data-replace") ? i.closest("cinq-sheet") : null;
		this.trigger = i, o instanceof c && o !== this ? this.#d(o) : this.show();
	};
	#s = (e) => {
		e.cancelable && (e.preventDefault(), this.close());
	};
	#c = (e) => {
		e.newState === "closed" && (this.#e?.cancel(), this.#b(0));
	};
	#l = (e) => {
		let t = this.$dialog, { target: n, clientX: r, clientY: i } = e;
		if (!t || n !== t || t.getAttribute("closedby") !== "any") return;
		let { top: a, right: o, bottom: s, left: c } = t.getBoundingClientRect();
		r >= c && r <= o && i >= a && i <= s || this.close();
	};
	#u(e) {
		if (this.#i) {
			switch (e) {
				case "show-popover": return "show";
				case "hide-popover": return "close";
				case "toggle-popover": return this.#a ? "close" : "show";
			}
			return null;
		}
		switch (e) {
			case "show-modal": return "show";
			case "request-close": return "close";
		}
		return null;
	}
	#d(e) {
		return this.#f(async () => await e.close() && this.#p(!0));
	}
	#f(t) {
		if (!this.$dialog || this.#a) return Promise.resolve(!1);
		let n = {
			sheet: this.$dialog.id,
			instance: this,
			trigger: this.trigger
		};
		return this.#m(e.SHEET_BEFORE_OPEN, n, t);
	}
	#p(e, t) {
		let n = this.$dialog;
		if (!n || this.#a === e) return !1;
		if (e || (this.#e?.cancel(), this.#b(0)), this.#i && e) {
			let e = this.trigger ?? void 0;
			return n.showPopover({ source: e }), !0;
		}
		return this.#i ? (n.hidePopover(), !0) : e ? (n.showModal(), !0) : (n.close(t), !0);
	}
	#m(e, n, r) {
		if (this.#r) return this.#r;
		let i = t(document.documentElement, e, n);
		if (i === !1) return Promise.resolve(!1);
		let a = i === !0 ? r() : i.then((e) => e && r());
		return typeof a == "boolean" ? Promise.resolve(a) : (this.#r = a.finally(() => {
			this.#r = null;
		}), this.#r);
	}
	#h = (e) => {
		let { target: t } = e;
		if (this.#a || !(t instanceof Element)) return null;
		let n = t.closest("button");
		return !n || n.commandForElement !== this.$dialog || this.#u(n.command) !== "show" ? null : n;
	};
	#g = () => {
		this.#n = 0;
	};
	#_ = (e, { dy: t, vy: n, canceled: r }) => {
		let { target: i, timeStamp: a } = e;
		r || Math.abs(t) < o || (this.#n = a + s, !(t > -40 && n > -.5) && (this.trigger = i instanceof HTMLElement ? i : null, setTimeout(() => this.show())));
	};
	#v = (e, { dy: t }) => {
		this.#b(t > 0 ? t : -Math.sqrt(-t));
	};
	#y = (e, { dy: t, vy: n, canceled: r }) => {
		!r && this.dismissible && (t >= i || n >= a) ? this.close().then((e) => {
			e || this.#b(0);
		}) : this.#b(0);
	};
	#b(e) {
		e === 0 ? this.style.removeProperty("--cinq-sheet-drag-offset") : this.style.setProperty("--cinq-sheet-drag-offset", `${e}px`);
	}
};
customElements.get("cinq-sheet") || customElements.define("cinq-sheet", c);
//#endregion
export { c as Sheet };
