//#region ../utils/dist/index.js
var e = {
	DRAWER_BEFORE_CLOSE: "drawer-before-close",
	DRAWER_BEFORE_OPEN: "drawer-before-open",
	DRAWER_CLOSE: "drawer-close",
	DRAWER_OPEN: "drawer-open",
	DRAWER_TOGGLE: "drawer-toggle",
	MODAL_BEFORE_CLOSE: "modal-before-close",
	MODAL_BEFORE_OPEN: "modal-before-open",
	MODAL_CLOSE: "modal-close",
	MODAL_OPEN: "modal-open",
	MODAL_TOGGLE: "modal-toggle",
	SPINBUTTON_CHANGE: "spinbutton-change",
	DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
	DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close",
	SWITCH_ACTIVATE: "switch:activate",
	SWITCH_DEACTIVATE: "switch:deactivate",
	ACCORDION_PANEL_OPEN: "accordion-panel:open",
	ACCORDION_PANEL_CLOSE: "accordion-panel:close",
	COMBOBOX_LOADING: "combobox:loading",
	COMBOBOX_LOADED: "combobox:loaded",
	COMBOBOX_UPDATE: "combobox:update",
	COMBOBOX_SUBMIT: "combobox:submit",
	COMBOBOX_EMPTY: "combobox:empty",
	WINDOWSPLITTER_CHANGE: "windowsplitter:change",
	CALENDAR_CHANGE: "calendar:change",
	TAB_BEFORE_ACTIVATE: "tab-before-activate",
	TAB_ACTIVATE: "tab-activate",
	TAB_DELETE: "tab-delete",
	CART_BEFORE_ADD: "cart-before-add",
	CART_BEFORE_UPDATE: "cart-before-update",
	CART_UPDATE: "cart-update",
	VARIANT_CHANGE: "variant-change"
}, t = (e, t, n, r = {}) => {
	let { bubbles: i = !0, cancelable: a = !0 } = r;
	return e.dispatchEvent(new CustomEvent(t, {
		bubbles: i,
		cancelable: a,
		detail: n
	}));
}, n = (e, t) => {
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, r = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", i = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, a = document.documentElement, { body: o } = document;
a.hasAttribute("data-debug"), window.addEventListener("pointermove", i(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/keyboard.ts
var s = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	handle = (e) => {
		let { key: t, ctrlKey: n, shiftKey: r } = e;
		if (!(n || r)) switch (t) {
			case "Enter":
				this.#t(e);
				break;
			case "ArrowDown":
				this.#n(e);
				break;
			case "ArrowUp":
				this.#r(e);
				break;
			case "Escape":
				this.#i(e);
				break;
			case "Tab":
				this.#a();
				break;
			case "Home":
				this.#o(e);
				break;
			case "End":
				this.#s(e);
				break;
			case "ArrowLeft":
			case "ArrowRight": this.#e.blurOption();
		}
	};
	#t(e) {
		let t = this.#e;
		if (t.focused) {
			e.preventDefault(), t.select();
			return;
		}
		t.expanded && t.hide({
			force: !0,
			clear: !1
		});
	}
	async #n(e) {
		e.preventDefault();
		let t = this.#e;
		if (!await t.ensureOpen()) return;
		let { altKey: n } = e;
		if (n) {
			t.blurOption();
			return;
		}
		let { length: r } = t.options;
		t.index = t.focused ? t.index + 1 > r - 1 ? 0 : t.index + 1 : 0, t.refresh(t.index);
	}
	async #r(e) {
		e.preventDefault();
		let t = this.#e;
		if (!await t.ensureOpen()) return;
		let { altKey: n } = e;
		if (n) {
			t.blurOption();
			return;
		}
		let { length: r } = t.options;
		t.index = t.focused ? 0 > t.index - 1 ? r - 1 : t.index - 1 : r - 1, t.refresh(t.index);
	}
	#i(e) {
		e.preventDefault();
		let t = this.#e;
		if (t.expanded) {
			t.hide({ force: !0 });
			return;
		}
		t.write(t.input, ""), t.value = "";
	}
	#a() {
		let e = this.#e;
		if (e.focused) {
			e.select();
			return;
		}
		e.hide({ force: !0 });
	}
	#o(e) {
		let t = this.#e;
		t.focused && (e.preventDefault(), t.blurOption(), t.input.setSelectionRange(0, 0));
	}
	#s(e) {
		let t = this.#e;
		if (!t.focused) return;
		e.preventDefault(), t.blurOption();
		let { length: n } = t.input.value;
		t.input.setSelectionRange(n, n);
	}
}, c = (e, t) => {
	e.value = t;
};
function l(e, t, n, r) {
	return {
		id: `${n}-option-${e}`,
		index: e,
		size: r,
		selected: e === t
	};
}
function u({ id: e, index: t, size: n, selected: r }) {
	let i = r ? " aria-selected=\"true\"" : "";
	return ` id="${e}" role="option" aria-posinset="${t + 1}" aria-setsize="${n}"${i}`;
}
var d = (e, t) => `<li${u(t)}>${e}</li>`, f = [
	"data-mode",
	"data-select-mode",
	"data-debounce",
	"data-min-length",
	"data-open-on-empty",
	"data-autoselect"
], p = class extends HTMLElement {
	static observedAttributes = [
		"value",
		"disabled",
		"expanded",
		...f
	];
	$input = null;
	$listbox = null;
	index = -1;
	options = [];
	loading = !1;
	mode = "managed";
	selectMode = "value";
	autoselect = !1;
	autocomplete = "list";
	debounce = 0;
	minLength = 0;
	openOnEmpty = !1;
	write = c;
	onSelect = null;
	#e = "";
	#t = !1;
	#n = null;
	#r = d;
	#i = 0;
	#a = null;
	#o = null;
	#s = null;
	#c = !1;
	#l = !1;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$input = null, this.$listbox = null;
	}
	attributeChangedCallback(e, t, n) {
		if (!(this.#l || t === n)) {
			if (e === "value") {
				this.setValue(n ?? "", { reflect: !1 });
				return;
			}
			if (e === "disabled") {
				this.#f();
				return;
			}
			if (e === "expanded") {
				n === null ? this.hide({ force: !0 }) : this.ensureOpen().then((e) => {
					e && this.blurOption();
				});
				return;
			}
			f.includes(e) && this.#d();
		}
	}
	get value() {
		return this.#e;
	}
	set value(e) {
		this.setValue(e);
	}
	get expanded() {
		return this.#t;
	}
	get disabled() {
		return this.hasAttribute("disabled") || this.getAttribute("aria-disabled") === "true";
	}
	setValue(e, { reflect: t = !0 } = {}) {
		let n = e ?? "";
		this.#e = n, this.$input && this.$input.value !== n && this.write(this.$input, n), t && this.#R();
	}
	get search() {
		return this.#n;
	}
	set search(e) {
		this.#n = e, this.#c || this.init();
	}
	get render() {
		return this.#r;
	}
	set render(e) {
		this.#r = e;
	}
	get input() {
		if (!this.$input) throw Error("cinq-combobox: input is not ready");
		return this.$input;
	}
	get focused() {
		return -1 < this.index;
	}
	get #u() {
		if (!this.$listbox) throw Error("cinq-combobox: listbox is not ready");
		return this.$listbox;
	}
	show() {
		!this.$input || !this.$listbox || this.disabled || (this.#u.removeAttribute("hidden"), this.#k(!0));
	}
	hide({ force: e = !1, clear: t = !0 } = {}) {
		if (!this.$input || !this.$listbox || !e && !this.#t) return;
		let n = this.options[this.index];
		if (this.autoselect && n && this.selectMode === "value") {
			let { value: e } = n;
			this.setValue(e);
		}
		this.index = -1, t ? this.#F() : this.options.forEach(({ element: e }) => {
			e.setAttribute("aria-selected", "false");
		}), this.#E(), this.#u.setAttribute("hidden", ""), this.#k(!1);
	}
	select = () => {
		if (!this.$input || !this.$listbox || this.disabled) return;
		let t = this.options[this.index] ?? null, n = this.#A(t, this.index);
		if (t && this.selectMode === "value") {
			let { value: e } = t;
			this.setValue(e);
		}
		this.onSelect?.(n), this.#D(e.COMBOBOX_SUBMIT, n), this.hide({ force: !0 });
	};
	destroy() {
		this.#i += 1, this.#I(), this.#L(), this.#c && this.$input && this.$listbox && this.#s && (this.$input.removeEventListener("input", this.#_), this.$input.removeEventListener("keydown", this.#s.handle), this.$input.removeEventListener("click", this.#v), this.$input.removeEventListener("focus", this.#b), this.$input.removeEventListener("blur", this.#x), this.$listbox.removeEventListener("mousedown", this.#g), this.$listbox.removeEventListener("click", this.#y), document.removeEventListener("click", this.#h)), this.#s = null, this.#c = !1;
	}
	blurOption() {
		if (!(!this.$input || !this.$listbox)) {
			if (!this.focused) {
				this.#E();
				return;
			}
			this.index = -1, this.refresh(this.index);
		}
	}
	refresh(t) {
		if (!this.$input || !this.$listbox) return;
		this.#w(t), this.#T(t);
		let { options: n, value: r } = this;
		this.#D(e.COMBOBOX_UPDATE, {
			options: n,
			index: t,
			value: r
		});
	}
	async ensureOpen() {
		if (!this.$input || !this.$listbox || this.disabled) return !1;
		if (this.#t && 0 < this.options.length) return !0;
		let { value: e } = this.input;
		return await this.#M(e, { openWhenEmpty: !0 }), this.#t && 0 < this.options.length;
	}
	init() {
		if (this.$input = this.querySelector("[role=\"combobox\"]") || this.querySelector("input"), this.$listbox = this.querySelector("[role=\"listbox\"]"), !this.isConnected || !this.$input || !this.$listbox || !this.#n) return;
		this.#d(), this.autocomplete = this.$input.getAttribute("aria-autocomplete") || "list";
		let e = this.getAttribute("value");
		e === null ? this.$input.value && this.setValue(this.$input.value) : this.setValue(e, { reflect: !1 }), this.#f(), this.#s = new s(this), this.#w(-1), this.hide({
			force: !0,
			clear: !1
		}), this.#p(), this.#c = !0;
	}
	#d() {
		let e = this.getAttribute("data-mode") ?? "managed", t = this.getAttribute("data-select-mode") ?? "value";
		this.mode = e === "external" ? "external" : "managed", this.selectMode = t === "custom" ? "custom" : "value", this.debounce = Math.max(0, n(this.getAttribute("data-debounce"), 0)), this.minLength = Math.max(0, n(this.getAttribute("data-min-length"), 0)), this.openOnEmpty = r(this.getAttribute("data-open-on-empty")), this.autoselect = r(this.getAttribute("data-autoselect"));
	}
	#f() {
		let e = this.disabled;
		this.$input && (this.$input.disabled = e, e ? this.$input.setAttribute("disabled", "") : this.$input.removeAttribute("disabled")), e && this.#t && this.hide({ force: !0 });
	}
	#p() {
		!this.$input || !this.$listbox || !this.#s || (this.$input.addEventListener("input", this.#_), this.$input.addEventListener("keydown", this.#s.handle), this.$input.addEventListener("click", this.#v), this.$input.addEventListener("focus", this.#b), this.$input.addEventListener("blur", this.#x), this.$listbox.addEventListener("mousedown", this.#g), this.$listbox.addEventListener("click", this.#y), document.addEventListener("click", this.#h));
	}
	#m(e) {
		return e instanceof Node && this.contains(e);
	}
	#h = ({ target: e }) => {
		this.#m(e) || this.hide({ force: !0 });
	};
	#g = (e) => {
		e.preventDefault();
	};
	#_ = ({ target: e }) => {
		if (!(e instanceof HTMLInputElement) || this.disabled) return;
		let { value: t } = e;
		this.setValue(t), this.blurOption(), this.#j(t);
	};
	#v = (e) => {
		this.disabled || (e.stopPropagation(), this.#S());
	};
	#y = ({ target: e }) => {
		if (this.disabled || !(e instanceof Element) || !this.$listbox) return;
		let t = e.closest("[role=\"option\"]");
		if (!t || !this.$listbox.contains(t)) return;
		let n = this.options.findIndex(({ element: e }) => e === t);
		0 > n && (this.#w(-1), n = this.options.findIndex(({ element: e }) => e === t), 0 > n) || (this.index = n, this.select());
	};
	#b = ({ target: e }) => {
		if (!(e instanceof HTMLInputElement)) return;
		let { value: t } = e;
		this.setValue(t), this.blurOption();
	};
	#x = ({ relatedTarget: e }) => {
		this.#m(e);
	};
	async #S() {
		if (!this.disabled) {
			if (this.#t) {
				this.hide({ force: !0 });
				return;
			}
			await this.ensureOpen() && this.blurOption();
		}
	}
	#C(e, t) {
		this.#u.innerHTML = "";
		let { length: n } = t, { id: r } = this.#u;
		t.forEach((t, i) => {
			let a = l(i, e, r, n);
			this.#u.insertAdjacentHTML("beforeend", this.#r(t, a));
		}), this.#w(e);
	}
	#w(e) {
		if (!this.$listbox) return;
		let t = [...this.$listbox.querySelectorAll("[role=\"option\"]")];
		this.options = t.map((t, n) => {
			t.setAttribute("aria-selected", n === e ? "true" : "false");
			let { id: r, textContent: i, dataset: a } = t, o = (i ?? "").trim();
			return {
				id: r,
				label: o,
				value: a.value ?? o,
				element: t
			};
		});
	}
	#T(e) {
		if (-1 < e && this.options[e]) {
			let { id: t, element: n } = this.options[e];
			if (t) {
				this.input.setAttribute("aria-activedescendant", t), n.scrollIntoView({ block: "nearest" });
				return;
			}
		}
		this.#E();
	}
	#E() {
		this.$input?.removeAttribute("aria-activedescendant");
	}
	#D(e, n) {
		t(this, e, n, { cancelable: !1 });
	}
	#O(e) {
		if (this.loading = e, e) {
			this.$listbox?.setAttribute("aria-busy", "true"), this.#B(!0);
			return;
		}
		this.$listbox?.removeAttribute("aria-busy"), this.#B(!1);
	}
	#k(e) {
		this.#t = e, this.$input && this.$input.setAttribute("aria-expanded", e ? "true" : "false"), this.#z();
	}
	#A(e, t) {
		let { value: n = "" } = e ?? {};
		return {
			option: e,
			index: t,
			value: n
		};
	}
	#j(t) {
		if (!this.disabled) {
			if (this.#I(), t.trim().length < this.minLength) {
				this.#L(), this.#i += 1, this.#F(), this.#D(e.COMBOBOX_EMPTY, { value: t }), this.hide({ force: !0 });
				return;
			}
			if (0 < this.debounce) {
				this.#a = setTimeout(() => {
					this.#a = null, this.#M(t);
				}, this.debounce);
				return;
			}
			this.#M(t);
		}
	}
	async #M(t, { openWhenEmpty: n = !1 } = {}) {
		if (!this.#n || this.disabled) return;
		this.#L(), this.#o = new AbortController();
		let r = ++this.#i, { signal: i } = this.#o;
		this.#D(e.COMBOBOX_LOADING), this.#O(!0);
		let a;
		try {
			a = await this.#n(t, { signal: i });
		} catch (e) {
			if (i.aborted || r !== this.#i) return;
			throw this.#O(!1), e;
		}
		if (r === this.#i) {
			if (this.#N(a), this.#D(e.COMBOBOX_LOADED), this.#O(!1), this.options.length === 0) {
				if (this.#D(e.COMBOBOX_EMPTY, { value: t }), this.openOnEmpty) {
					this.show();
					return;
				}
				this.hide({ force: !0 });
				return;
			}
			if (!n && t.length === 0 && this.autocomplete === "list") {
				this.index = -1, this.refresh(this.index), this.hide({
					force: !0,
					clear: !1
				});
				return;
			}
			this.index = this.autoselect ? 0 : -1, this.refresh(this.index), this.show();
		}
	}
	#N(e) {
		if (Array.isArray(e)) {
			if (e.length === 0) {
				this.#F({ clearDom: this.mode === "managed" });
				return;
			}
			if (typeof e[0] == "string") {
				this.#C(-1, e);
				return;
			}
			this.#P(e);
			return;
		}
		let { html: t, options: n } = e;
		if (t != null && this.mode === "external") {
			this.#u.innerHTML = t, this.#w(-1);
			return;
		}
		if (n) {
			if (n.length === 0) {
				this.#F({ clearDom: !0 });
				return;
			}
			if (typeof n[0] == "string") {
				this.#C(-1, n);
				return;
			}
			this.#P(n);
			return;
		}
		if (this.mode === "external") {
			this.#w(-1);
			return;
		}
		this.#F({ clearDom: !0 });
	}
	#P(e) {
		this.#u.innerHTML = "", e.forEach((e) => {
			this.#u.appendChild(e);
		}), this.#w(-1);
	}
	#F({ clearDom: e = !0 } = {}) {
		this.options = [], this.index = -1, e && this.$listbox && (this.$listbox.innerHTML = "");
	}
	#I() {
		this.#a &&= (clearTimeout(this.#a), null);
	}
	#L() {
		this.#o?.abort(), this.#o = null;
	}
	#R() {
		this.#l = !0, this.#e ? this.setAttribute("value", this.#e) : this.removeAttribute("value"), this.#l = !1;
	}
	#z() {
		this.#l = !0, this.#t ? this.setAttribute("expanded", "") : this.removeAttribute("expanded"), this.#l = !1;
	}
	#B(e) {
		this.#l = !0, e ? this.setAttribute("busy", "") : this.removeAttribute("busy"), this.#l = !1;
	}
};
customElements.get("cinq-combobox") || customElements.define("cinq-combobox", p);
//#endregion
export { p as Combobox, l as optionRenderProps, u as serializeOptionAttrs };
