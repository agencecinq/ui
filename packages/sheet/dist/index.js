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
		this.$handle = this.$dialog.querySelector("[data-dom=\"drag-indicator\"]"), this.$dialog.addEventListener("cancel", this.#r), this.$dialog.addEventListener("close", this.#i), this.$handle && (this.$handle.addEventListener("pointerdown", this.#s), this.$handle.addEventListener("pointermove", this.#c), this.$handle.addEventListener("pointerup", this.#l), this.$handle.addEventListener("pointercancel", this.#l), this.$handle.addEventListener("lostpointercapture", this.#l)), document.documentElement.addEventListener(e.SHEET_TOGGLE, this.#a), document.documentElement.addEventListener(e.SHEET_OPEN, this.#o), this.#n(), this.hasAttribute("open") && this.#t();
	}
	destroy() {
		this.#u(), this.$dialog && (this.$dialog.removeEventListener("cancel", this.#r), this.$dialog.removeEventListener("close", this.#i), this.$dialog.open && this.$dialog.close()), this.$handle && (this.$handle.removeEventListener("pointerdown", this.#s), this.$handle.removeEventListener("pointermove", this.#c), this.$handle.removeEventListener("pointerup", this.#l), this.$handle.removeEventListener("pointercancel", this.#l), this.$handle.removeEventListener("lostpointercapture", this.#l)), document.documentElement.removeEventListener(e.SHEET_TOGGLE, this.#a), document.documentElement.removeEventListener(e.SHEET_OPEN, this.#o), this.$dialog = null, this.$handle = null;
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
			this.#u(), this.#d(0), this.$dialog.open && this.$dialog.close(), t(document.documentElement, e.SHEET_CLOSE, { sheet: this.id }, {
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
	#s = (e) => {
		e.button === 0 && this.hasAttribute("open") && this.$handle && (this.#e = {
			pointerId: e.pointerId,
			startY: e.clientY,
			lastY: e.clientY,
			lastTime: e.timeStamp,
			velocity: 0
		}, this.$handle.setPointerCapture(e.pointerId), this.toggleAttribute("dragging", !0));
	};
	#c = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		let n = Math.max(e.timeStamp - t.lastTime, 1);
		t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY, t.lastTime = e.timeStamp;
		let r = t.lastY - t.startY;
		this.#d(r > 0 ? r : -Math.sqrt(-r));
	};
	#l = (e) => {
		let t = this.#e;
		t && e.pointerId === t.pointerId && (this.#u(), (!(this.dismissible && (t.lastY - t.startY >= n || t.velocity >= r)) || !this.close()) && this.#d(0));
	};
	#u() {
		let e = this.#e;
		e && (this.#e = null, this.toggleAttribute("dragging", !1), this.$handle?.hasPointerCapture(e.pointerId) && this.$handle.releasePointerCapture(e.pointerId));
	}
	#d(e) {
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
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		if (this.$button = this.querySelector("button"), !this.$button) throw Error("SheetButton: button element not found");
		let t = this.$button.ariaControlsElements ?? [];
		this.controls = t.map((e) => e.id), this.#n(t.some((e) => e.hasAttribute("open"))), this.$button.addEventListener("click", this.#i), this.$button.addEventListener("pointerdown", this.#a), this.$button.addEventListener("pointermove", this.#o), this.$button.addEventListener("pointerup", this.#s), this.$button.addEventListener("pointercancel", this.#c), document.documentElement.addEventListener(e.SHEET_OPEN, this.#l), document.documentElement.addEventListener(e.SHEET_CLOSE, this.#u);
	}
	destroy() {
		this.#e = null, this.$button && (this.$button.removeEventListener("click", this.#i), this.$button.removeEventListener("pointerdown", this.#a), this.$button.removeEventListener("pointermove", this.#o), this.$button.removeEventListener("pointerup", this.#s), this.$button.removeEventListener("pointercancel", this.#c)), document.documentElement.removeEventListener(e.SHEET_OPEN, this.#l), document.documentElement.removeEventListener(e.SHEET_CLOSE, this.#u), this.$button = null, this.controls = [];
	}
	#n(e) {
		this.$button?.setAttribute("aria-expanded", String(e));
	}
	#r(n) {
		t(document.documentElement, e.SHEET_TOGGLE, {
			sheet: n,
			trigger: this.$button
		}, {
			bubbles: !1,
			cancelable: !1
		});
	}
	#i = () => {
		if (this.#t) {
			this.#t = !1;
			return;
		}
		this.controls.forEach((e) => this.#r(e));
	};
	#a = (e) => {
		e.button === 0 && this.$button && (this.#t = !1, this.#e = {
			pointerId: e.pointerId,
			startY: e.clientY,
			lastY: e.clientY,
			lastTime: e.timeStamp,
			velocity: 0
		}, this.$button.setPointerCapture(e.pointerId));
	};
	#o = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		let n = Math.max(e.timeStamp - t.lastTime, 1);
		t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY, t.lastTime = e.timeStamp;
	};
	#s = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		this.#e = null;
		let n = t.lastY - t.startY;
		Math.abs(n) < a || (this.#t = !0, !(n > -40 && t.velocity > -.5) && this.controls.filter((e) => !document.getElementById(e)?.hasAttribute("open")).forEach((e) => this.#r(e)));
	};
	#c = () => {
		this.#e = null;
	};
	#l = (e) => {
		this.controls.includes(e.detail.sheet) && this.#n(!0);
	};
	#u = (e) => {
		this.controls.includes(e.detail.sheet) && this.#n(!1);
	};
};
customElements.get("cinq-sheet-button") || customElements.define("cinq-sheet-button", o);
//#endregion
export { i as Sheet, o as SheetButton };
