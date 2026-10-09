import { EVENTS as e, disableScroll as t, dispatchBeforeEvent as n, dispatchEvent as r, enableScroll as i, getFocusableElements as a, rememberReturnFocus as o, scheduleRestoreReturnFocus as s } from "@agencecinq/utils";
//#region src/drawer.ts
var c = class extends HTMLElement {
	trigger = null;
	$dialog = null;
	#e = null;
	get modal() {
		return this.dataset.modal !== "false";
	}
	static get observedAttributes() {
		return ["open"];
	}
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		if (!this.id) throw Error("Drawer: id attribute is required");
		if (this.$dialog = this.querySelector("dialog"), !this.$dialog) throw Error("Drawer: No <dialog> found");
		this.$dialog.addEventListener("click", this.#t), this.$dialog.addEventListener("cancel", this.#n), this.$dialog.addEventListener("close", this.#a), document.addEventListener("keydown", this.#r), document.addEventListener("pointerdown", this.#i), document.documentElement.addEventListener(e.DRAWER_OPEN, this.#o), document.documentElement.addEventListener(e.DRAWER_TOGGLE, this.#s), this.hasAttribute("open") && this.#c();
	}
	destroy() {
		this.$dialog && (this.$dialog.removeEventListener("click", this.#t), this.$dialog.removeEventListener("cancel", this.#n), this.$dialog.removeEventListener("close", this.#a)), document.removeEventListener("keydown", this.#r), document.removeEventListener("pointerdown", this.#i), document.documentElement.removeEventListener(e.DRAWER_OPEN, this.#o), document.documentElement.removeEventListener(e.DRAWER_TOGGLE, this.#s), this.hasAttribute("open") && (i(!1), s(this)), this.$dialog = null;
	}
	#t = (e) => {
		if (!this.$dialog || e.target !== this.$dialog) return;
		let t = this.$dialog.getBoundingClientRect();
		e.clientX >= t.left && e.clientX <= t.right && e.clientY >= t.top && e.clientY <= t.bottom || this.close();
	};
	#n = (e) => {
		e.preventDefault(), this.close();
	};
	#r = (e) => {
		e.key !== "Escape" || e.defaultPrevented || this.modal || !this.hasAttribute("open") || this.close();
	};
	#i = (e) => {
		if (this.modal || !this.$dialog || !this.hasAttribute("open")) return;
		let t = e.target;
		!t || this.$dialog.contains(t) || t.closest("[aria-controls]")?.getAttribute("aria-controls")?.split(/\s+/).includes(this.id) || this.close();
	};
	#a = () => {
		this.hasAttribute("open") && this.removeAttribute("open");
	};
	#o = (e) => {
		if (e.detail.drawer !== this.id && this.hasAttribute("open")) {
			this.close();
			return;
		}
		e.detail.drawer === this.id && !this.hasAttribute("open") && (e.detail.trigger && (this.trigger = e.detail.trigger), this.open());
	};
	#s = (e) => {
		let { trigger: t, drawer: n } = e.detail;
		n === this.id && this.toggle({ trigger: t });
	};
	#c() {
		this.$dialog && (this.$dialog.open || (this.modal ? this.$dialog.showModal() : this.$dialog.show()), this.$dialog.querySelector("[autofocus]") || a(this.$dialog)[0]?.focus(), t());
	}
	toggle({ trigger: e = null } = {}) {
		return this.hasAttribute("open") ? this.close().then(() => this.hasAttribute("open")) : (e && (this.trigger = e), this.open().then(() => this.hasAttribute("open")));
	}
	open() {
		return this.hasAttribute("open") ? Promise.resolve(!1) : this.#l(e.DRAWER_BEFORE_OPEN, {
			drawer: this.id,
			instance: this,
			trigger: this.trigger
		}, !0);
	}
	close() {
		return this.hasAttribute("open") ? this.#l(e.DRAWER_BEFORE_CLOSE, {
			drawer: this.id,
			instance: this
		}, !1) : Promise.resolve(!1);
	}
	#l(e, t, r) {
		if (this.#e) return this.#e;
		let i = (e) => !e || this.hasAttribute("open") === r ? !1 : (this.toggleAttribute("open", r), !0), a = n(document.documentElement, e, t);
		return typeof a == "boolean" ? Promise.resolve(i(a)) : (this.#e = a.then(i).finally(() => {
			this.#e = null;
		}), this.#e);
	}
	attributeChangedCallback(t, n, a) {
		if (!(!this.isConnected || t !== "open" || !this.$dialog)) {
			if (a !== null) {
				o(this.trigger), r(document.documentElement, e.DRAWER_OPEN, {
					drawer: this.id,
					trigger: this.trigger
				}, {
					bubbles: !1,
					cancelable: !1
				}), this.#c();
				return;
			}
			this.$dialog.open && this.$dialog.close(), i(!1), s(this), r(document.documentElement, e.DRAWER_CLOSE, { drawer: this.id }, {
				bubbles: !1,
				cancelable: !1
			});
		}
	}
};
customElements.get("cinq-drawer") || customElements.define("cinq-drawer", c);
//#endregion
//#region src/drawer-button.ts
var l = class extends HTMLElement {
	controls = [];
	$button = null;
	#e = (e) => {
		this.$button && this.controls.includes(e.detail.drawer) && this.$button.setAttribute("aria-expanded", "false");
	};
	#t = (e) => {
		this.$button && this.controls.includes(e.detail.drawer) && this.$button.setAttribute("aria-expanded", "true");
	};
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$button = null, this.controls = [];
	}
	init() {
		if (this.$button = this.querySelector("[data-button]") || this.querySelector("button"), !this.$button) throw Error("DrawerButton: button element not found");
		this.controls = (this.$button.ariaControlsElements ?? []).map((e) => e.id), this.$button.addEventListener("click", this.#n), document.documentElement.addEventListener(e.DRAWER_CLOSE, this.#e), document.documentElement.addEventListener(e.DRAWER_OPEN, this.#t);
	}
	destroy() {
		this.$button && this.$button.removeEventListener("click", this.#n), document.documentElement.removeEventListener(e.DRAWER_CLOSE, this.#e), document.documentElement.removeEventListener(e.DRAWER_OPEN, this.#t);
	}
	#n = () => {
		this.controls.forEach((t) => {
			let n = {
				trigger: this.$button,
				drawer: t
			};
			r(document.documentElement, e.DRAWER_TOGGLE, n, {
				bubbles: !1,
				cancelable: !1
			});
		});
	};
};
customElements.get("cinq-drawer-button") || customElements.define("cinq-drawer-button", l);
//#endregion
export { c as Drawer, l as DrawerButton };
