import { EVENTS as e, dispatchEvent as t } from "@agencecinq/utils";
//#region src/sheet.ts
var n = 80, r = .5, i = class extends HTMLElement {
	static observedAttributes = [
		"open",
		"modal",
		"dismissible"
	];
	trigger = null;
	$dialog = null;
	$handle = null;
	#e = null;
	get modal() {
		return this.getAttribute("modal") !== "false";
	}
	get dismissible() {
		return this.getAttribute("dismissible") !== "false";
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		if (!this.id) throw Error("Sheet: id attribute is required");
		if (this.$dialog = this.querySelector("dialog"), !this.$dialog) throw Error("Sheet: dialog element not found");
		this.$handle = this.$dialog.querySelector("[data-dom=\"drag-indicator\"]"), this.$dialog.addEventListener("cancel", this.#r), this.$dialog.addEventListener("close", this.#i), this.$handle && (this.$handle.addEventListener("pointerdown", this.#u), this.$handle.addEventListener("pointermove", this.#d), this.$handle.addEventListener("pointerup", this.#f), this.$handle.addEventListener("pointercancel", this.#f), this.$handle.addEventListener("lostpointercapture", this.#p)), document.documentElement.addEventListener(e.SHEET_TOGGLE, this.#a), document.documentElement.addEventListener(e.SHEET_OPEN, this.#o), this.#n(), this.hasAttribute("open") && this.#t();
	}
	destroy() {
		this.#m(), this.$dialog && (this.$dialog.removeEventListener("cancel", this.#r), this.$dialog.removeEventListener("close", this.#i), this.$dialog.open && this.$dialog.close()), this.$handle && (this.$handle.removeEventListener("pointerdown", this.#u), this.$handle.removeEventListener("pointermove", this.#d), this.$handle.removeEventListener("pointerup", this.#f), this.$handle.removeEventListener("pointercancel", this.#f), this.$handle.removeEventListener("lostpointercapture", this.#p)), document.documentElement.removeEventListener(e.SHEET_TOGGLE, this.#a), document.documentElement.removeEventListener(e.SHEET_OPEN, this.#o), this.$dialog = null, this.$handle = null;
	}
	toggle(e = null) {
		return this.hasAttribute("open") ? this.close() : this.open(e);
	}
	open(n = null) {
		if (this.hasAttribute("open")) return !1;
		this.trigger = n;
		let r = () => {
			this.toggleAttribute("open", !0);
		};
		return t(document.documentElement, e.SHEET_BEFORE_OPEN, {
			sheet: this.id,
			instance: this,
			trigger: n,
			resolve: r
		}, { bubbles: !1 }) ? (r(), !0) : !1;
	}
	close() {
		if (!this.hasAttribute("open")) return !1;
		let n = () => {
			this.toggleAttribute("open", !1);
		};
		return t(document.documentElement, e.SHEET_BEFORE_CLOSE, {
			sheet: this.id,
			instance: this,
			resolve: n
		}, { bubbles: !1 }) ? (n(), !0) : !1;
	}
	attributeChangedCallback(n, r, i) {
		if (this.$dialog && r !== i) {
			if (n !== "open") {
				this.#n();
				return;
			}
			if (i !== null) {
				this.#t(), t(document.documentElement, e.SHEET_OPEN, {
					sheet: this.id,
					trigger: this.trigger
				}, {
					bubbles: !1,
					cancelable: !1
				});
				return;
			}
			this.#m(), this.#h(0), this.$dialog.open && this.$dialog.close(), t(document.documentElement, e.SHEET_CLOSE, { sheet: this.id }, {
				bubbles: !1,
				cancelable: !1
			});
		}
	}
	#t() {
		if (this.$dialog && !this.$dialog.open) {
			if (this.modal) {
				this.$dialog.showModal();
				return;
			}
			this.$dialog.show();
		}
	}
	#n() {
		if (this.$dialog) {
			if (!this.dismissible) {
				this.$dialog.setAttribute("closedby", "none");
				return;
			}
			this.$dialog.setAttribute("closedby", this.modal ? "any" : "closerequest");
		}
	}
	#r = (e) => {
		e.preventDefault(), this.dismissible && this.close();
	};
	#i = () => {
		this.$dialog?.open || this.toggleAttribute("open", !1);
	};
	#a = (e) => {
		e.detail.sheet === this.id && this.toggle(e.detail.trigger);
	};
	#o = (e) => {
		e.detail.sheet !== this.id && this.modal && this.close();
	};
	#s = !1;
	#c() {
		this.#s || (this.#s = !0, window.addEventListener("pointermove", this.#d), window.addEventListener("pointerup", this.#f), window.addEventListener("pointercancel", this.#f));
	}
	#l() {
		this.#s && (this.#s = !1, window.removeEventListener("pointermove", this.#d), window.removeEventListener("pointerup", this.#f), window.removeEventListener("pointercancel", this.#f));
	}
	#u = (e) => {
		if (e.button === 0 && this.hasAttribute("open") && this.$handle) {
			this.#e = {
				pointerId: e.pointerId,
				startY: e.clientY,
				lastY: e.clientY,
				lastTime: e.timeStamp,
				velocity: 0
			};
			try {
				this.$handle.setPointerCapture(e.pointerId);
			} catch {}
			this.$handle.hasPointerCapture(e.pointerId) || this.#c(), this.toggleAttribute("dragging", !0);
		}
	};
	#d = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		let n = Math.max(e.timeStamp - t.lastTime, 1);
		t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY, t.lastTime = e.timeStamp;
		let r = t.lastY - t.startY;
		this.#h(r > 0 ? r : -Math.sqrt(-r));
	};
	#f = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		let i = Math.max(e.timeStamp - t.lastTime, 1);
		e.clientY !== t.lastY && (t.velocity = (e.clientY - t.lastY) / i, t.lastY = e.clientY, t.lastTime = e.timeStamp), this.#m(), (!(this.dismissible && (t.lastY - t.startY >= n || t.velocity >= r)) || !this.close()) && this.#h(0);
	};
	#p = (e) => {
		this.#e && e.pointerId === this.#e.pointerId && this.#c();
	};
	#m() {
		let e = this.#e;
		e && (this.#e = null, this.toggleAttribute("dragging", !1), this.#l(), this.$handle?.hasPointerCapture(e.pointerId) && this.$handle.releasePointerCapture(e.pointerId));
	}
	#h(e) {
		if (e !== 0) {
			this.style.setProperty("--cinq-sheet-drag-offset", `${e}px`);
			return;
		}
		this.style.removeProperty("--cinq-sheet-drag-offset");
	}
};
customElements.get("cinq-sheet") || customElements.define("cinq-sheet", i);
//#endregion
//#region src/sheet-button.ts
var a = 8, o = class extends HTMLElement {
	controls = [];
	$button = null;
	#e = null;
	#t = !1;
	#n = !1;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		if (this.$button = this.querySelector("button"), !this.$button) throw Error("SheetButton: button element not found");
		let t = this.$button.ariaControlsElements ?? [];
		this.controls = t.map((e) => e.id), this.#r(t.some((e) => e.hasAttribute("open"))), this.$button.addEventListener("click", this.#s), this.$button.addEventListener("pointerdown", this.#c), this.$button.addEventListener("pointermove", this.#l), this.$button.addEventListener("pointerup", this.#u), this.$button.addEventListener("pointercancel", this.#d), this.$button.addEventListener("lostpointercapture", this.#f), document.documentElement.addEventListener(e.SHEET_OPEN, this.#p), document.documentElement.addEventListener(e.SHEET_CLOSE, this.#m);
	}
	destroy() {
		this.#o(), this.#e = null, this.$button && (this.$button.removeEventListener("click", this.#s), this.$button.removeEventListener("pointerdown", this.#c), this.$button.removeEventListener("pointermove", this.#l), this.$button.removeEventListener("pointerup", this.#u), this.$button.removeEventListener("pointercancel", this.#d), this.$button.removeEventListener("lostpointercapture", this.#f)), document.documentElement.removeEventListener(e.SHEET_OPEN, this.#p), document.documentElement.removeEventListener(e.SHEET_CLOSE, this.#m), this.$button = null, this.controls = [];
	}
	#r(e) {
		this.$button?.setAttribute("aria-expanded", String(e));
	}
	#i(n) {
		t(document.documentElement, e.SHEET_TOGGLE, {
			sheet: n,
			trigger: this.$button
		}, {
			bubbles: !1,
			cancelable: !1
		});
	}
	#a() {
		this.#n || (this.#n = !0, window.addEventListener("pointermove", this.#l), window.addEventListener("pointerup", this.#u), window.addEventListener("pointercancel", this.#d));
	}
	#o() {
		this.#n && (this.#n = !1, window.removeEventListener("pointermove", this.#l), window.removeEventListener("pointerup", this.#u), window.removeEventListener("pointercancel", this.#d));
	}
	#s = () => {
		if (this.#t) {
			this.#t = !1;
			return;
		}
		this.controls.forEach((e) => this.#i(e));
	};
	#c = (e) => {
		if (e.button === 0 && this.$button) {
			this.#t = !1, this.#e = {
				pointerId: e.pointerId,
				startY: e.clientY,
				lastY: e.clientY,
				lastTime: e.timeStamp,
				velocity: 0
			};
			try {
				this.$button.setPointerCapture(e.pointerId);
			} catch {}
			this.$button.hasPointerCapture(e.pointerId) || this.#a();
		}
	};
	#l = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		let n = Math.max(e.timeStamp - t.lastTime, 1);
		t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY, t.lastTime = e.timeStamp;
	};
	#u = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		let n = Math.max(e.timeStamp - t.lastTime, 1);
		e.clientY !== t.lastY && (t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY, t.lastTime = e.timeStamp), this.#e = null, this.#o();
		let r = t.lastY - t.startY;
		Math.abs(r) < a || (this.#t = !0, !(r > -40 && t.velocity > -.5) && this.controls.filter((e) => !document.getElementById(e)?.hasAttribute("open")).forEach((e) => this.#i(e)));
	};
	#d = (e) => {
		this.#e && e.pointerId === this.#e.pointerId && (this.#t = Math.abs(this.#e.lastY - this.#e.startY) >= a, this.#e = null, this.#o());
	};
	#f = (e) => {
		this.#e && e.pointerId === this.#e.pointerId && this.#a();
	};
	#p = (e) => {
		this.controls.includes(e.detail.sheet) && this.#r(!0);
	};
	#m = (e) => {
		this.controls.includes(e.detail.sheet) && this.#r(!1);
	};
};
customElements.get("cinq-sheet-button") || customElements.define("cinq-sheet-button", o);
//#endregion
export { i as Sheet, o as SheetButton };
