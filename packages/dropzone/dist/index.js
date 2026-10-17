//#region ../utils/dist/index.js
var e = {
	DRAWER_BEFORE_CLOSE: "drawer:before-close",
	DRAWER_BEFORE_OPEN: "drawer:before-open",
	DRAWER_CLOSE: "drawer:close",
	DRAWER_OPEN: "drawer:open",
	DRAWER_TOGGLE: "drawer:toggle",
	SHEET_BEFORE_CLOSE: "sheet:before-close",
	SHEET_BEFORE_OPEN: "sheet:before-open",
	SHEET_CLOSE: "sheet:close",
	SHEET_OPEN: "sheet:open",
	SHEET_TOGGLE: "sheet:toggle",
	MODAL_BEFORE_CLOSE: "modal:before-close",
	MODAL_BEFORE_OPEN: "modal:before-open",
	SPINBUTTON_CHANGE: "spinbutton:change",
	TOAST_OPEN: "toast:open",
	TOAST_CLOSE: "toast:close",
	DISCLOSURE_BUTTON_OPEN: "disclosure-button:open",
	DISCLOSURE_BUTTON_CLOSE: "disclosure-button:close",
	DRILLDOWN_OPEN: "drilldown:open",
	DRILLDOWN_CLOSE: "drilldown:close",
	DROPZONE_CHANGE: "dropzone:change",
	DROPZONE_REJECT: "dropzone:reject",
	SWITCH_ACTIVATE: "switch:activate",
	SWITCH_DEACTIVATE: "switch:deactivate",
	ACCORDION_OPEN: "accordion:open",
	ACCORDION_CLOSE: "accordion:close",
	COMBOBOX_LOADING: "combobox:loading",
	COMBOBOX_LOADED: "combobox:loaded",
	COMBOBOX_UPDATE: "combobox:update",
	COMBOBOX_SUBMIT: "combobox:submit",
	COMBOBOX_EMPTY: "combobox:empty",
	WINDOWSPLITTER_CHANGE: "windowsplitter:change",
	SLIDER_CHANGE: "slider:change",
	SNAKE_EAT: "snake:eat",
	SNAKE_OVER: "snake:over",
	SNAKE_REPLAY: "snake:replay",
	CALENDAR_RENDER: "calendar:render",
	CALENDAR_BEFORE_CHANGE: "calendar:before-change",
	CALENDAR_CHANGE: "calendar:change",
	TABS_BEFORE_ACTIVATE: "tabs:before-activate",
	TABS_ACTIVATE: "tabs:activate",
	TABS_DELETE: "tabs:delete",
	CART_BEFORE_ADD: "cart:before-add",
	CART_BEFORE_UPDATE: "cart:before-update",
	CART_UPDATE: "cart:update",
	VARIANT_CHANGE: "variant:change"
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
r.hasAttribute("data-debug"), window.addEventListener("pointermove", n(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/filter.ts
function a(e, t) {
	let n = t.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean), r = e.name.toLowerCase(), i = e.type.toLowerCase();
	return !n.length || n.some((e) => e.startsWith(".") ? r.endsWith(e) : e.endsWith("/*") ? i.startsWith(e.slice(0, -1)) : i === e);
}
function o(e, { accept: t, maxSize: n, multiple: r }) {
	let i = [], o = [];
	return e.forEach((e) => {
		a(e, t) ? n && e.size > n ? o.push({
			file: e,
			reason: "size"
		}) : !r && i.length ? o.push({
			file: e,
			reason: "multiple"
		}) : i.push(e) : o.push({
			file: e,
			reason: "accept"
		});
	}), {
		accepted: i,
		rejected: o
	};
}
//#endregion
//#region src/dropzone.ts
var s = class extends HTMLElement {
	$label = null;
	$input = null;
	#e = 0;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$label = null, this.$input = null;
	}
	init() {
		this.$label = this.querySelector("label");
		let e = this.$label?.control, t = this.querySelector("input[type=\"file\"]") ?? (e instanceof HTMLInputElement ? e : null);
		if (!t || t.type !== "file") throw Error("cinq-dropzone: needs an input[type=\"file\"] inside, or a label[for] pointing to one.");
		this.$input = t, this.addEventListener("dragenter", this.#n), this.addEventListener("dragover", this.#r), this.addEventListener("dragleave", this.#i), this.addEventListener("drop", this.#a), this.$input.addEventListener("change", this.#o);
	}
	destroy() {
		this.removeEventListener("dragenter", this.#n), this.removeEventListener("dragover", this.#r), this.removeEventListener("dragleave", this.#i), this.removeEventListener("drop", this.#a), this.$input?.removeEventListener("change", this.#o), this.#l();
	}
	get maxSize() {
		let e = Number(this.getAttribute("data-max-size"));
		return Number.isFinite(e) && e > 0 ? e : 0;
	}
	get files() {
		return Array.from(this.$input?.files ?? []);
	}
	clear() {
		this.$input && (this.$input.value = "", this.#c());
	}
	#t(e) {
		return Array.from(e.dataTransfer?.types ?? []).includes("Files") && !this.$input?.disabled;
	}
	#n = (e) => {
		this.#t(e) && (e.preventDefault(), this.#e += 1, this.toggleAttribute("dragover", !0));
	};
	#r = (e) => {
		this.#t(e) && (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	};
	#i = () => {
		this.#e = Math.max(0, this.#e - 1), this.#e || this.#l();
	};
	#a = (e) => {
		let t = Array.from(e.dataTransfer?.files ?? []);
		if (this.#l(), !this.$input || !this.#t(e) || !t.length) return;
		e.preventDefault();
		let { accepted: n } = this.#s(t);
		if (!n.length) return;
		let r = new DataTransfer();
		n.forEach((e) => r.items.add(e)), this.$input.files = r.files, this.#c();
	};
	#o = () => {
		if (!this.$input) return;
		let { accepted: n, rejected: r } = this.#s(this.files);
		if (r.length) {
			let e = new DataTransfer();
			n.forEach((t) => e.items.add(t)), this.$input.files = e.files;
		}
		t(this, e.DROPZONE_CHANGE, {
			files: n,
			$input: this.$input
		}, { cancelable: !1 });
	};
	#s(n) {
		let r = this.$input, i = o(n, {
			accept: r.accept,
			maxSize: this.maxSize,
			multiple: r.multiple
		});
		return i.rejected.length && t(this, e.DROPZONE_REJECT, {
			rejected: i.rejected,
			$input: r
		}, { cancelable: !1 }), i;
	}
	#c() {
		this.$input && (this.$input.dispatchEvent(new Event("input", { bubbles: !0 })), this.$input.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	#l() {
		this.#e = 0, this.removeAttribute("dragover");
	}
};
customElements.get("cinq-dropzone") || customElements.define("cinq-dropzone", s);
//#endregion
export { s as Dropzone, a as accepts, o as filter };
