import { EVENTS as e, dispatchEvent as t } from "@agencecinq/utils";
//#region src/sheet.ts
var n = 80, r = .5, i = class extends HTMLElement {
	static observedAttributes = ["open"];
	trigger = null;
	$dialog = null;
	$handle = null;
	#e = null;
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
		this.$handle = this.$dialog.querySelector("[data-dom=\"drag-indicator\"]"), this.$dialog.addEventListener("cancel", this.#n), this.$dialog.addEventListener("close", this.#r), this.$handle && (this.$handle.addEventListener("pointerdown", this.#o), this.$handle.addEventListener("pointermove", this.#s), this.$handle.addEventListener("pointerup", this.#c), this.$handle.addEventListener("pointercancel", this.#c), this.$handle.addEventListener("lostpointercapture", this.#c)), document.documentElement.addEventListener(e.SHEET_TOGGLE, this.#i), document.documentElement.addEventListener(e.SHEET_OPEN, this.#a), this.hasAttribute("open") && this.#t();
	}
	destroy() {
		this.#l(), this.$dialog && (this.$dialog.removeEventListener("cancel", this.#n), this.$dialog.removeEventListener("close", this.#r), this.$dialog.open && this.$dialog.close()), this.$handle && (this.$handle.removeEventListener("pointerdown", this.#o), this.$handle.removeEventListener("pointermove", this.#s), this.$handle.removeEventListener("pointerup", this.#c), this.$handle.removeEventListener("pointercancel", this.#c), this.$handle.removeEventListener("lostpointercapture", this.#c)), document.documentElement.removeEventListener(e.SHEET_TOGGLE, this.#i), document.documentElement.removeEventListener(e.SHEET_OPEN, this.#a), this.$dialog = null, this.$handle = null;
	}
	toggle(e = null) {
		return this.hasAttribute("open") ? (this.close(), this.hasAttribute("open")) : this.open(e);
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
		}, { bubbles: !1 }) ? (r(), !0) : this.hasAttribute("open");
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
		}, { bubbles: !1 }) ? (n(), !0) : !this.hasAttribute("open");
	}
	attributeChangedCallback(n, r, i) {
		if (this.$dialog && n === "open" && r !== i) {
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
			this.#l(), this.#u(0), this.$dialog.open && this.$dialog.close(), t(document.documentElement, e.SHEET_CLOSE, { sheet: this.id }, {
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
	#n = (e) => {
		e.preventDefault(), this.close();
	};
	#r = () => {
		this.$dialog?.open || this.toggleAttribute("open", !1);
	};
	#i = (e) => {
		e.detail.sheet === this.id && this.toggle(e.detail.trigger);
	};
	#a = (e) => {
		e.detail.sheet !== this.id && this.modal && this.close();
	};
	#o = (e) => {
		e.button === 0 && this.hasAttribute("open") && this.$handle && (this.#e = {
			pointerId: e.pointerId,
			startY: e.clientY,
			lastY: e.clientY,
			lastTime: e.timeStamp,
			velocity: 0
		}, this.$handle.setPointerCapture(e.pointerId), this.toggleAttribute("dragging", !0));
	};
	#s = (e) => {
		let t = this.#e;
		if (!t || e.pointerId !== t.pointerId) return;
		let n = Math.max(e.timeStamp - t.lastTime, 1);
		t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY, t.lastTime = e.timeStamp;
		let r = t.lastY - t.startY;
		this.#u(r > 0 ? r : -Math.sqrt(-r));
	};
	#c = (e) => {
		let t = this.#e;
		if (t && e.pointerId === t.pointerId) {
			if (e.clientY !== t.lastY) {
				let n = Math.max(e.timeStamp - t.lastTime, 1);
				t.velocity = (e.clientY - t.lastY) / n, t.lastY = e.clientY;
			}
			this.#l(), (!(this.dismissible && (t.lastY - t.startY >= n || t.velocity >= r)) || !this.close()) && this.#u(0);
		}
	};
	#l() {
		let e = this.#e;
		e && (this.#e = null, this.toggleAttribute("dragging", !1), this.$handle?.hasPointerCapture(e.pointerId) && this.$handle.releasePointerCapture(e.pointerId));
	}
	#u(e) {
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
var a = 8, o = 300, s = class extends HTMLElement {
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
	#r(n) {
		t(document.documentElement, e.SHEET_TOGGLE, {
			sheet: n,
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
		Math.abs(n) < a || (this.#t = e.timeStamp + o, !(n > -40 && t.velocity > -.5) && this.controls.filter((e) => !document.getElementById(e)?.hasAttribute("open")).forEach((e) => this.#r(e)));
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
customElements.get("cinq-sheet-button") || customElements.define("cinq-sheet-button", s);
//#endregion
export { i as Sheet, s as SheetButton };
