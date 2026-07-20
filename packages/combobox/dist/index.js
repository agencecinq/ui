//#region ../utils/dist/index.js
var e = {
	DRAWER_CLOSE: "drawer-close",
	DRAWER_OPEN: "drawer-open",
	DRAWER_TOGGLE: "drawer-toggle",
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
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, r = document.documentElement, { body: i } = document;
r.hasAttribute("data-debug");
var a = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", n(({ x: e, y: t }) => {
	a.x = e, a.y = t;
}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/Props.ts
var o = class {
	id;
	role;
	"aria-posinset";
	"aria-setsize";
	"aria-selected";
	constructor(e, t, n, r) {
		this.id = `${n}-option-${e}`, this.role = "option", this["aria-posinset"] = e + 1, this["aria-setsize"] = r, e === t && (this["aria-selected"] = "true");
	}
	toString() {
		let e = this;
		return Object.keys(this).reduce((t, n) => `${t} ${n}="${e[n]}"`, "");
	}
}, s = class {
	host;
	constructor(e) {
		this.host = e;
	}
	handle = (e) => {
		let { key: t, ctrlKey: n, shiftKey: r } = e;
		if (!(n || r)) switch (t) {
			case "Enter":
				this.onEnter(e);
				break;
			case "ArrowDown":
				this.onArrowDown(e);
				break;
			case "ArrowUp":
				this.onArrowUp(e);
				break;
			case "Escape":
				this.onEscape(e);
				break;
			case "Tab":
				this.onTab();
				break;
			case "Home":
				this.onHome(e);
				break;
			case "End":
				this.onEnd(e);
				break;
			case "ArrowLeft":
			case "ArrowRight":
				this.host.blurOption();
				break;
			default: break;
		}
	};
	onEnter(e) {
		let { host: t } = this;
		if (t.focused) {
			e.preventDefault(), t.select();
			return;
		}
		t.expanded && t.hide({
			force: !0,
			clear: !1
		});
	}
	async onArrowDown(e) {
		e.preventDefault();
		let { host: t } = this;
		if (!await t.ensureOpen()) return;
		let { altKey: n } = e;
		if (n) {
			t.blurOption();
			return;
		}
		let { length: r } = t.options;
		t.focused ? t.index = t.index + 1 > r - 1 ? 0 : t.index + 1 : t.index = 0, t.refresh(t.index);
	}
	async onArrowUp(e) {
		e.preventDefault();
		let { host: t } = this;
		if (!await t.ensureOpen()) return;
		let { altKey: n } = e;
		if (n) {
			t.blurOption();
			return;
		}
		let { length: r } = t.options;
		t.focused ? t.index = 0 > t.index - 1 ? r - 1 : t.index - 1 : t.index = r - 1, t.refresh(t.index);
	}
	onEscape(e) {
		e.preventDefault();
		let { host: t } = this;
		if (t.expanded) {
			t.hide({ force: !0 });
			return;
		}
		t.write(t.input, ""), t.value = "";
	}
	onTab() {
		let { host: e } = this;
		if (e.focused) {
			e.select();
			return;
		}
		e.hide({ force: !0 });
	}
	onHome(e) {
		let { host: t } = this;
		t.focused && (e.preventDefault(), t.blurOption(), t.input.setSelectionRange(0, 0));
	}
	onEnd(e) {
		let { host: t } = this;
		if (!t.focused) return;
		e.preventDefault(), t.blurOption();
		let { length: n } = t.input.value;
		t.input.setSelectionRange(n, n);
	}
}, c = (e, t) => {
	e.value = t;
}, l = (e, t) => `<li${t}>${e}</li>`, u = [
	"data-combobox-mode",
	"data-combobox-select-mode",
	"data-combobox-debounce",
	"data-combobox-min-length",
	"data-combobox-open-on-empty",
	"data-combobox-autoselect"
], d = (e, t) => {
	let n = e.getAttribute(t);
	return n !== null && n !== "false" && n !== "0";
}, f = (e, t, n) => {
	let r = e.getAttribute(t);
	if (r === null) return n;
	let i = parseInt(r, 10);
	return Number.isNaN(i) ? n : i;
}, p = class extends HTMLElement {
	static observedAttributes = [
		"value",
		"disabled",
		"expanded",
		...u
	];
	$input = null;
	$listbox = null;
	$button = null;
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
	_value = "";
	_expanded = !1;
	_search = null;
	_render = l;
	searchId = 0;
	debounceTimer = null;
	abortController = null;
	keyboard = null;
	bound = !1;
	reflectingAttribute = !1;
	connectedCallback() {
		this.$input = this.querySelector("[role=\"combobox\"]") || this.querySelector("input"), this.$listbox = this.querySelector("[role=\"listbox\"]") || this.querySelector("[data-combobox-listbox]"), this.$button = this.querySelector("[data-combobox-button]") || null, this.mount();
	}
	disconnectedCallback() {
		this.destroy(), this.$input = null, this.$listbox = null, this.$button = null;
	}
	attributeChangedCallback(e, t, n) {
		if (!(this.reflectingAttribute || t === n)) {
			if (e === "value") {
				this.setValue(n ?? "", { reflect: !1 });
				return;
			}
			if (e === "disabled") {
				this.syncDisabled();
				return;
			}
			if (e === "expanded") {
				n === null ? this.hide({ force: !0 }) : this.ensureOpen().then((e) => {
					e && this.blurOption();
				});
				return;
			}
			u.includes(e) && this.syncOptionsFromAttributes();
		}
	}
	get value() {
		return this._value;
	}
	set value(e) {
		this.setValue(e);
	}
	get expanded() {
		return this._expanded;
	}
	get disabled() {
		return this.hasAttribute("disabled") || this.getAttribute("aria-disabled") === "true";
	}
	setValue(e, { reflect: t = !0 } = {}) {
		let n = e ?? "";
		this._value = n, this.$input && this.$input.value !== n && this.write(this.$input, n), t && this.reflectValueAttribute();
	}
	get search() {
		return this._search;
	}
	set search(e) {
		this._search = e, this.bound || this.mount();
	}
	get render() {
		return this._render;
	}
	set render(e) {
		this._render = e;
	}
	get input() {
		if (!this.$input) throw Error("cinq-combobox: input is not ready");
		return this.$input;
	}
	get focused() {
		return -1 < this.index;
	}
	get listbox() {
		if (!this.$listbox) throw Error("cinq-combobox: listbox is not ready");
		return this.$listbox;
	}
	show() {
		!this.$input || !this.$listbox || this.disabled || (this.listbox.removeAttribute("hidden"), this.setExpanded(!0));
	}
	hide({ force: e = !1, clear: t = !0 } = {}) {
		if (!this.$input || !this.$listbox || !e && !this._expanded) return;
		let n = this.options[this.index];
		if (this.autoselect && n && this.selectMode === "value") {
			let { value: e } = n;
			this.setValue(e);
		}
		this.index = -1, t ? this.clear() : this.options.forEach(({ element: e }) => {
			e.setAttribute("aria-selected", "false");
		}), this.clearActiveDescendant(), this.listbox.setAttribute("hidden", ""), this.setExpanded(!1);
	}
	select = () => {
		if (!this.$input || !this.$listbox || this.disabled) return;
		let t = this.options[this.index] ?? null, n = this.detail(t, this.index);
		if (t && this.selectMode === "value") {
			let { value: e } = t;
			this.setValue(e);
		}
		this.onSelect?.(n), this.emit(e.COMBOBOX_SUBMIT, n), this.hide({ force: !0 });
	};
	destroy() {
		this.searchId += 1, this.clearDebounce(), this.abort(), this.bound && this.$input && this.$listbox && this.keyboard && (this.$input.removeEventListener("input", this.onInput), this.$input.removeEventListener("keydown", this.keyboard.handle), this.$input.removeEventListener("click", this.onInputClick), this.$input.removeEventListener("focus", this.onFocus), this.$input.removeEventListener("blur", this.onBlur), this.$listbox.removeEventListener("mousedown", this.onListboxMousedown), this.$listbox.removeEventListener("click", this.onListboxClick), this.$button?.removeEventListener("mousedown", this.onButtonMousedown), this.$button?.removeEventListener("click", this.onButtonClick), document.removeEventListener("click", this.onDocumentClick)), this.keyboard = null, this.bound = !1;
	}
	blurOption() {
		if (!(!this.$input || !this.$listbox)) {
			if (!this.focused) {
				this.clearActiveDescendant();
				return;
			}
			this.index = -1, this.refresh(this.index);
		}
	}
	refresh(t) {
		if (!this.$input || !this.$listbox) return;
		this.sync(t), this.active(t);
		let { options: n, value: r } = this;
		this.emit(e.COMBOBOX_UPDATE, {
			options: n,
			index: t,
			value: r
		});
	}
	async ensureOpen() {
		if (!this.$input || !this.$listbox || this.disabled) return !1;
		if (this._expanded && 0 < this.options.length) return !0;
		let { value: e } = this.input;
		return await this.run(e, { openWhenEmpty: !0 }), this._expanded && 0 < this.options.length;
	}
	mount() {
		if (this.destroy(), !this.isConnected || !this.$input || !this.$listbox || !this._search) return;
		this.syncOptionsFromAttributes(), this.autocomplete = this.$input.getAttribute("aria-autocomplete") || "list", this.$button ||= this.resolveButton();
		let e = this.getAttribute("value");
		e === null ? this.$input.value && this.setValue(this.$input.value) : this.setValue(e, { reflect: !1 }), this.syncDisabled(), this.keyboard = new s(this), this.sync(-1), this.hide({
			force: !0,
			clear: !1
		}), this.bind(), this.bound = !0;
	}
	syncOptionsFromAttributes() {
		let e = this.getAttribute("data-combobox-mode") ?? "managed", t = this.getAttribute("data-combobox-select-mode") ?? "value";
		this.mode = e === "external" ? "external" : "managed", this.selectMode = t === "custom" ? "custom" : "value", this.debounce = Math.max(0, f(this, "data-combobox-debounce", 0)), this.minLength = Math.max(0, f(this, "data-combobox-min-length", 0)), this.openOnEmpty = d(this, "data-combobox-open-on-empty"), this.autoselect = d(this, "data-combobox-autoselect");
	}
	syncDisabled() {
		let e = this.disabled;
		this.$input && (this.$input.disabled = e, e ? this.$input.setAttribute("disabled", "") : this.$input.removeAttribute("disabled")), this.$button && (this.$button.disabled = e, e ? this.$button.setAttribute("disabled", "") : this.$button.removeAttribute("disabled")), e && this._expanded && this.hide({ force: !0 });
	}
	resolveButton() {
		let { id: e } = this.listbox;
		if (!e) return null;
		for (let t of [this, document]) {
			let n = t.querySelectorAll("button[aria-controls]");
			for (let t of n) {
				let n = t.getAttribute("aria-controls");
				if (n && n.trim().split(/\s+/).includes(e)) return t;
			}
		}
		return null;
	}
	bind() {
		!this.$input || !this.$listbox || !this.keyboard || (this.$input.addEventListener("input", this.onInput), this.$input.addEventListener("keydown", this.keyboard.handle), this.$input.addEventListener("click", this.onInputClick), this.$input.addEventListener("focus", this.onFocus), this.$input.addEventListener("blur", this.onBlur), this.$listbox.addEventListener("mousedown", this.onListboxMousedown), this.$listbox.addEventListener("click", this.onListboxClick), this.$button && (this.$button.addEventListener("mousedown", this.onButtonMousedown), this.$button.addEventListener("click", this.onButtonClick)), document.addEventListener("click", this.onDocumentClick));
	}
	isTarget(e) {
		return e instanceof Node ? this.$input === e || !!this.$input?.contains(e) || this.$listbox === e || !!this.$listbox?.contains(e) || this.$button === e || !!this.$button?.contains(e) : !1;
	}
	onDocumentClick = ({ target: e }) => {
		this.isTarget(e) || this.hide({ force: !0 });
	};
	onListboxMousedown = (e) => {
		e.preventDefault();
	};
	onInput = ({ target: e }) => {
		if (!(e instanceof HTMLInputElement) || this.disabled) return;
		let { value: t } = e;
		this.setValue(t), this.blurOption(), this.schedule(t);
	};
	onInputClick = (e) => {
		this.disabled || (e.stopPropagation(), this.toggle());
	};
	onButtonMousedown = (e) => {
		e.preventDefault();
	};
	onButtonClick = (e) => {
		this.disabled || (e.preventDefault(), e.stopPropagation(), this.toggle().then(() => {
			this.$input?.focus();
		}));
	};
	onListboxClick = ({ target: e }) => {
		if (this.disabled || !(e instanceof Element) || !this.$listbox) return;
		let t = e.closest("[role=\"option\"]");
		if (!t || !this.$listbox.contains(t)) return;
		let n = this.options.findIndex(({ element: e }) => e === t);
		0 > n && (this.sync(-1), n = this.options.findIndex(({ element: e }) => e === t), 0 > n) || (this.index = n, this.select());
	};
	onFocus = ({ target: e }) => {
		if (!(e instanceof HTMLInputElement)) return;
		let { value: t } = e;
		this.setValue(t), this.blurOption();
	};
	onBlur = ({ relatedTarget: e }) => {
		this.isTarget(e);
	};
	async toggle() {
		if (!this.disabled) {
			if (this._expanded) {
				this.hide({ force: !0 });
				return;
			}
			await this.ensureOpen() && this.blurOption();
		}
	}
	build(e, t) {
		this.listbox.innerHTML = "";
		let { length: n } = t, { id: r } = this.listbox;
		t.forEach((t, i) => {
			let a = new o(i, e, r, n);
			this.listbox.insertAdjacentHTML("beforeend", this._render(t, a));
		}), this.sync(e);
	}
	sync(e) {
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
	active(e) {
		if (-1 < e && this.options[e]) {
			let { id: t, element: n } = this.options[e];
			if (t) {
				this.input.setAttribute("aria-activedescendant", t), n.scrollIntoView({ block: "nearest" });
				return;
			}
		}
		this.clearActiveDescendant();
	}
	clearActiveDescendant() {
		this.$input?.removeAttribute("aria-activedescendant");
	}
	emit(e, n) {
		t(this, e, n, { cancelable: !1 });
	}
	setLoading(e) {
		if (this.loading = e, e) {
			this.$listbox?.setAttribute("aria-busy", "true"), this.reflectBusyAttribute(!0);
			return;
		}
		this.$listbox?.removeAttribute("aria-busy"), this.reflectBusyAttribute(!1);
	}
	setExpanded(e) {
		this._expanded = e, this.$input && this.$input.setAttribute("aria-expanded", e ? "true" : "false"), this.$button?.setAttribute("aria-expanded", e ? "true" : "false"), this.reflectExpandedAttribute();
	}
	detail(e, t) {
		let { value: n = "" } = e ?? {};
		return {
			option: e,
			index: t,
			value: n
		};
	}
	schedule(t) {
		if (!this.disabled) {
			if (this.clearDebounce(), t.trim().length < this.minLength) {
				this.abort(), this.searchId += 1, this.clear(), this.emit(e.COMBOBOX_EMPTY, { value: t }), this.hide({ force: !0 });
				return;
			}
			if (0 < this.debounce) {
				this.debounceTimer = setTimeout(() => {
					this.debounceTimer = null, this.run(t);
				}, this.debounce);
				return;
			}
			this.run(t);
		}
	}
	async run(t, { openWhenEmpty: n = !1 } = {}) {
		if (!this._search || this.disabled) return;
		this.abort(), this.abortController = new AbortController();
		let r = ++this.searchId, { signal: i } = this.abortController;
		this.emit(e.COMBOBOX_LOADING), this.setLoading(!0);
		let a;
		try {
			a = await this._search(t, { signal: i });
		} catch (e) {
			if (i.aborted || r !== this.searchId) return;
			throw this.setLoading(!1), e;
		}
		if (r === this.searchId) {
			if (this.apply(a), this.emit(e.COMBOBOX_LOADED), this.setLoading(!1), this.options.length === 0) {
				if (this.emit(e.COMBOBOX_EMPTY, { value: t }), this.openOnEmpty) {
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
	apply(e) {
		if (Array.isArray(e)) {
			if (e.length === 0) {
				this.clear({ clearDom: this.mode === "managed" });
				return;
			}
			if (typeof e[0] == "string") {
				this.build(-1, e);
				return;
			}
			this.replace(e);
			return;
		}
		let { html: t, options: n } = e;
		if (t != null && this.mode === "external") {
			this.listbox.innerHTML = t, this.sync(-1);
			return;
		}
		if (n) {
			if (n.length === 0) {
				this.clear({ clearDom: !0 });
				return;
			}
			if (typeof n[0] == "string") {
				this.build(-1, n);
				return;
			}
			this.replace(n);
			return;
		}
		if (this.mode === "external") {
			this.sync(-1);
			return;
		}
		this.clear({ clearDom: !0 });
	}
	replace(e) {
		this.listbox.innerHTML = "", e.forEach((e) => {
			this.listbox.appendChild(e);
		}), this.sync(-1);
	}
	clear({ clearDom: e = !0 } = {}) {
		this.options = [], this.index = -1, e && this.$listbox && (this.$listbox.innerHTML = "");
	}
	clearDebounce() {
		this.debounceTimer &&= (clearTimeout(this.debounceTimer), null);
	}
	abort() {
		this.abortController?.abort(), this.abortController = null;
	}
	reflectValueAttribute() {
		this.reflectingAttribute = !0, this._value ? this.setAttribute("value", this._value) : this.removeAttribute("value"), this.reflectingAttribute = !1;
	}
	reflectExpandedAttribute() {
		this.reflectingAttribute = !0, this._expanded ? this.setAttribute("expanded", "") : this.removeAttribute("expanded"), this.reflectingAttribute = !1;
	}
	reflectBusyAttribute(e) {
		this.reflectingAttribute = !0, e ? this.setAttribute("busy", "") : this.removeAttribute("busy"), this.reflectingAttribute = !1;
	}
};
customElements.get("cinq-combobox") || customElements.define("cinq-combobox", p);
//#endregion
export { p as Combobox, o as Props };
