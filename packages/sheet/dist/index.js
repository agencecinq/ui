import { EVENTS as e, dispatchBeforeEvent as t } from "@agencecinq/utils";
//#region src/sheet.ts
var n = "closedBy" in HTMLDialogElement.prototype, r = 80, i = .5, a = 8, o = 300;
function s(e) {
	return {
		pointerId: e.pointerId,
		startY: e.clientY,
		lastY: e.clientY,
		lastTime: e.timeStamp,
		velocity: 0
	};
}
function c(e, t) {
	let n = Math.max(t.timeStamp - e.lastTime, 1);
	e.velocity = (t.clientY - e.lastY) / n, e.lastY = t.clientY, e.lastTime = t.timeStamp;
}
var l = class l extends HTMLElement {
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
		this.$handle = this.$dialog.querySelector("[data-dom=\"drag-indicator\"]"), this.$dialog.addEventListener("command", this.#o), this.$dialog.addEventListener("cancel", this.#s), this.$dialog.addEventListener("toggle", this.#c), n || this.$dialog.addEventListener("click", this.#l), this.$handle && (this.$handle.addEventListener("pointerdown", this.#y), this.$handle.addEventListener("pointermove", this.#b), this.$handle.addEventListener("pointerup", this.#x), this.$handle.addEventListener("pointercancel", this.#x), this.$handle.addEventListener("lostpointercapture", this.#x)), document.addEventListener("pointerdown", this.#h), document.addEventListener("pointermove", this.#g), document.addEventListener("pointerup", this.#_), document.addEventListener("pointercancel", this.#v);
	}
	destroy() {
		this.#S(), this.#t = null, document.removeEventListener("pointerdown", this.#h), document.removeEventListener("pointermove", this.#g), document.removeEventListener("pointerup", this.#_), document.removeEventListener("pointercancel", this.#v), this.$handle && (this.$handle.removeEventListener("pointerdown", this.#y), this.$handle.removeEventListener("pointermove", this.#b), this.$handle.removeEventListener("pointerup", this.#x), this.$handle.removeEventListener("pointercancel", this.#x), this.$handle.removeEventListener("lostpointercapture", this.#x)), this.$dialog && (this.$dialog.removeEventListener("command", this.#o), this.$dialog.removeEventListener("cancel", this.#s), this.$dialog.removeEventListener("toggle", this.#c), this.$dialog.removeEventListener("click", this.#l), this.#p(!1));
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
		let t = e.source instanceof HTMLElement ? e.source : null, n = this.#u(e.command);
		if (!n) return;
		if (e.preventDefault(), e.timeStamp < this.#n) {
			this.#n = 0;
			return;
		}
		if (n === "close") {
			let e = t?.getAttribute("value") ?? void 0;
			this.close(e);
			return;
		}
		let r = t?.hasAttribute("data-replace") ? t.closest("cinq-sheet") : null;
		this.trigger = t, r instanceof l && r !== this ? this.#d(r) : this.show();
	};
	#s = (e) => {
		e.cancelable && (e.preventDefault(), this.close());
	};
	#c = (e) => {
		e.newState === "closed" && (this.#S(), this.#C(0));
	};
	#l = (e) => {
		let t = this.$dialog;
		if (!t || e.target !== t || t.getAttribute("closedby") !== "any") return;
		let n = t.getBoundingClientRect();
		e.clientX >= n.left && e.clientX <= n.right && e.clientY >= n.top && e.clientY <= n.bottom || this.close();
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
		if (e || (this.#S(), this.#C(0)), this.#i) {
			let t = this.trigger ?? void 0;
			e ? n.showPopover({ source: t }) : n.hidePopover();
		} else e ? n.showModal() : n.close(t);
		return !0;
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
		if (e.button !== 0 || this.#a || !(e.target instanceof Element)) return;
		let t = e.target.closest("button");
		t && t.commandForElement === this.$dialog && this.#u(t.command) === "show" && (this.#n = 0, this.#t = {
			...s(e),
			$button: t
		}, t.setPointerCapture(e.pointerId));
	};
	#g = (e) => {
		let t = this.#t;
		t && e.pointerId === t.pointerId && c(t, e);
	};
	#_ = (e) => {
		let t = this.#t;
		if (!t || e.pointerId !== t.pointerId) return;
		e.clientY !== t.lastY && c(t, e), this.#t = null;
		let n = t.lastY - t.startY;
		Math.abs(n) < a || (this.#n = e.timeStamp + o, !(n > -40 && t.velocity > -.5) && (this.trigger = t.$button, setTimeout(() => this.show())));
	};
	#v = () => {
		this.#t = null;
	};
	#y = (e) => {
		e.button === 0 && this.#a && this.$handle && (this.#e = s(e), this.$handle.setPointerCapture(e.pointerId), this.toggleAttribute("dragging", !0));
	};
	#b = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		c(t, e);
		let n = t.lastY - t.startY;
		this.#C(n > 0 ? n : -Math.sqrt(-n));
	};
	#x = (e) => {
		let t = this.#e;
		t && e.pointerId === t.pointerId && (e.clientY !== t.lastY && c(t, e), this.#S(), this.dismissible && (t.lastY - t.startY >= r || t.velocity >= i) ? this.close().then((e) => {
			e || this.#C(0);
		}) : this.#C(0));
	};
	#S() {
		let e = this.#e;
		e && (this.#e = null, this.toggleAttribute("dragging", !1), this.$handle?.hasPointerCapture(e.pointerId) && this.$handle.releasePointerCapture(e.pointerId));
	}
	#C(e) {
		e === 0 ? this.style.removeProperty("--cinq-sheet-drag-offset") : this.style.setProperty("--cinq-sheet-drag-offset", `${e}px`);
	}
};
customElements.get("cinq-sheet") || customElements.define("cinq-sheet", l);
//#endregion
export { l as Sheet };
