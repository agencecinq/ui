import { EVENTS as e, dispatchBeforeEvent as t, dispatchEvent as n } from "@agencecinq/utils";
//#region src/sheet.ts
var r = 80, i = .5, a = class extends HTMLElement {
	static observedAttributes = ["open"];
	trigger = null;
	$dialog = null;
	$handle = null;
	#e = null;
	#t = null;
	get modal() {
		return this.dataset.modal !== "false";
	}
	get dismissible() {
		return this.$dialog?.getAttribute("closedby") !== "none";
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
		this.$handle = this.$dialog.querySelector("[data-dom=\"drag-indicator\"]"), this.$dialog.addEventListener("cancel", this.#i), this.$dialog.addEventListener("close", this.#a), this.$handle && (this.$handle.addEventListener("pointerdown", this.#c), this.$handle.addEventListener("pointermove", this.#l), this.$handle.addEventListener("pointerup", this.#u), this.$handle.addEventListener("pointercancel", this.#u), this.$handle.addEventListener("lostpointercapture", this.#u)), document.documentElement.addEventListener(e.SHEET_TOGGLE, this.#o), document.documentElement.addEventListener(e.SHEET_OPEN, this.#s), this.hasAttribute("open") && this.#r();
	}
	destroy() {
		this.#d(), this.$dialog && (this.$dialog.removeEventListener("cancel", this.#i), this.$dialog.removeEventListener("close", this.#a), this.$dialog.open && this.$dialog.close()), this.$handle && (this.$handle.removeEventListener("pointerdown", this.#c), this.$handle.removeEventListener("pointermove", this.#l), this.$handle.removeEventListener("pointerup", this.#u), this.$handle.removeEventListener("pointercancel", this.#u), this.$handle.removeEventListener("lostpointercapture", this.#u)), document.documentElement.removeEventListener(e.SHEET_TOGGLE, this.#o), document.documentElement.removeEventListener(e.SHEET_OPEN, this.#s), this.$dialog = null, this.$handle = null;
	}
	toggle(e = null) {
		return this.hasAttribute("open") ? this.close().then(() => this.hasAttribute("open")) : this.open(e).then(() => this.hasAttribute("open"));
	}
	open(t = null) {
		return this.hasAttribute("open") ? Promise.resolve(!1) : (this.trigger = t, this.#n(e.SHEET_BEFORE_OPEN, {
			sheet: this.id,
			instance: this,
			trigger: t
		}, !0));
	}
	close() {
		return this.hasAttribute("open") ? this.#n(e.SHEET_BEFORE_CLOSE, {
			sheet: this.id,
			instance: this
		}, !1) : Promise.resolve(!1);
	}
	#n(e, n, r) {
		if (this.#t) return this.#t;
		let i = (e) => !e || this.hasAttribute("open") === r ? !1 : (this.toggleAttribute("open", r), !0), a = t(document.documentElement, e, n);
		return typeof a == "boolean" ? Promise.resolve(i(a)) : (this.#t = a.then(i).finally(() => {
			this.#t = null;
		}), this.#t);
	}
	attributeChangedCallback(t, r, i) {
		if (this.$dialog && t === "open" && r !== i) {
			if (i !== null) {
				this.#r(), n(document.documentElement, e.SHEET_OPEN, {
					sheet: this.id,
					trigger: this.trigger
				}, {
					bubbles: !1,
					cancelable: !1
				});
				return;
			}
			this.#d(), this.#f(0), this.$dialog.open && this.$dialog.close(), n(document.documentElement, e.SHEET_CLOSE, { sheet: this.id }, {
				bubbles: !1,
				cancelable: !1
			});
		}
	}
	#r() {
		if (this.$dialog && !this.$dialog.open) {
			if (this.modal) {
				this.$dialog.showModal();
				return;
			}
			this.$dialog.show();
		}
	}
	#i = (e) => {
		e.preventDefault(), this.close();
	};
	#a = () => {
		this.$dialog?.open || this.toggleAttribute("open", !1);
	};
	#o = (e) => {
		e.detail.sheet === this.id && this.toggle(e.detail.trigger);
	};
	#s = (e) => {
		e.detail.sheet !== this.id && this.modal && this.close();
	};
	#c = (e) => {
		e.button === 0 && this.hasAttribute("open") && this.$handle && (this.#e = {
			pointerId: e.pointerId,
			startY: e.clientY,
			lastY: e.clientY,
			lastTime: e.timeStamp,
			velocity: 0
		}, this.$handle.setPointerCapture(e.pointerId), this.toggleAttribute("dragging", !0));
	};
	#l = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		let n = Math.max(e.timeStamp - t.lastTime, 1);
		t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY, t.lastTime = e.timeStamp;
		let r = t.lastY - t.startY;
		this.#f(r > 0 ? r : -Math.sqrt(-r));
	};
	#u = (e) => {
		let t = this.#e;
		if (t && e.pointerId === t.pointerId) {
			if (e.clientY !== t.lastY) {
				let n = Math.max(e.timeStamp - t.lastTime, 1);
				t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY;
			}
			if (this.#d(), !(this.dismissible && (t.lastY - t.startY >= r || t.velocity >= i))) {
				this.#f(0);
				return;
			}
			this.close().then((e) => {
				e || this.#f(0);
			});
		}
	};
	#d() {
		let e = this.#e;
		e && (this.#e = null, this.toggleAttribute("dragging", !1), this.$handle?.hasPointerCapture(e.pointerId) && this.$handle.releasePointerCapture(e.pointerId));
	}
	#f(e) {
		if (e !== 0) {
			this.style.setProperty("--cinq-sheet-drag-offset", `${e}px`);
			return;
		}
		this.style.removeProperty("--cinq-sheet-drag-offset");
	}
};
customElements.get("cinq-sheet") || customElements.define("cinq-sheet", a);
//#endregion
//#region src/sheet-button.ts
var o = 8, s = 300, c = class extends HTMLElement {
	controls = [];
	$button = null;
	#e = null;
	#t = 0;
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
	#r(t) {
		n(document.documentElement, e.SHEET_TOGGLE, {
			sheet: t,
			trigger: this.$button
		}, {
			bubbles: !1,
			cancelable: !1
		});
	}
	#i = (e) => {
		if (e.timeStamp < this.#t) {
			this.#t = 0;
			return;
		}
		this.controls.forEach((e) => this.#r(e));
	};
	#a = (e) => {
		e.button === 0 && this.$button && (this.#t = 0, this.#e = {
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
		if (e.clientY !== t.lastY) {
			let n = Math.max(e.timeStamp - t.lastTime, 1);
			t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY;
		}
		this.#e = null;
		let n = t.lastY - t.startY;
		Math.abs(n) < o || (this.#t = e.timeStamp + s, !(n > -40 && t.velocity > -.5) && this.controls.filter((e) => !document.getElementById(e)?.hasAttribute("open")).forEach((e) => this.#r(e)));
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
customElements.get("cinq-sheet-button") || customElements.define("cinq-sheet-button", c);
//#endregion
export { a as Sheet, c as SheetButton };
