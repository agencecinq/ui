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
	MODAL_CLOSE: "modal:close",
	MODAL_OPEN: "modal:open",
	MODAL_TOGGLE: "modal:toggle",
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
}, n = (e, n, r) => {
	let i = [], a = !0, o = (e) => {
		if (!a) throw Error(`${n}: call waitUntil() synchronously in the listener`);
		i.push(e);
	}, s = t(e, n, {
		...r,
		waitUntil: o
	}, { bubbles: !1 });
	return a = !1, s ? i.length === 0 || Promise.allSettled(i).then((e) => e.every((e) => e.status === "fulfilled")) : !1;
}, r = (e, t) => {
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, i = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", a = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, o = document.documentElement, { body: s } = document;
o.hasAttribute("data-debug"), window.addEventListener("pointermove", a(({ x: e, y: t }) => {}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
//#endregion
//#region src/utils.ts
function c(e) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function l(e) {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function u(e, t, n) {
	return e >= t && e <= n;
}
function d(e, t) {
	return new Date(e, t + 1, 0).getDate();
}
function f(e, t, n = 0) {
	return (new Date(e, t, 1).getDay() - n + 7) % 7;
}
function p(e) {
	return (new Intl.Locale(e).getWeekInfo?.()?.firstDay ?? 0) % 7;
}
function m(e, t) {
	return new Intl.DateTimeFormat(e, {
		...t,
		calendar: "gregory"
	});
}
function h(e, t = "short") {
	let n = m(e, { weekday: t });
	return Array.from({ length: 7 }, (e, t) => n.format(new Date(2020, 0, 5 + t)));
}
//#endregion
//#region src/keyboard.ts
var g = class {
	host;
	constructor(e) {
		this.host = e;
	}
	setFocusDay(e, { focus: t = !0 } = {}) {
		this.host.$body?.querySelectorAll("[data-day]").forEach((e) => {
			e.tabIndex = -1;
		}), e.tabIndex = 0, this.host.current.day = e.getAttribute("data-day"), t && e.focus();
		let { activeElement: n } = e.getRootNode();
		n === e && this.host.current.day && this.host.previewRange(this.host.current.day);
	}
	dayInView() {
		let { current: e } = this.host, t = e.day ? l(e.day).getDate() : 1, n = d(e.year, e.month);
		return c(new Date(e.year, e.month, Math.min(t, n)));
	}
	focusDayByOffset(e, t) {
		let n = l(e);
		n.setDate(n.getDate() + t);
		let r = c(n);
		this.host.current.day = r, this.host.current.year = n.getFullYear(), this.host.current.month = n.getMonth();
		let i = this.host.$body?.querySelector(`[data-day="${r}"]`);
		if (i) {
			this.setFocusDay(i);
			return;
		}
		this.host.render({ focus: !0 });
	}
	sync({ focus: e = !1 } = {}) {
		if (!this.host.$body) return;
		let t = Array.from(this.host.$body.querySelectorAll("[data-day]"));
		if (!t.length) return;
		let n = (e) => t.find((t) => t.getAttribute("data-day") === e), r = this.host.current.day && (n(this.host.current.day) || n(this.dayInView())) || t.find((e) => this.host.picked.includes(e.getAttribute("data-day") || "")) || n(this.host.day) || t[0];
		this.setFocusDay(r, { focus: e });
	}
	attach() {
		this.host.$body?.addEventListener("keydown", this.#e, !1);
	}
	detach() {
		this.host.$body?.removeEventListener("keydown", this.#e, !1);
	}
	#e = (e) => {
		let t = e.target.closest("[data-day]");
		if (!t || !this.host.$body?.contains(t)) return;
		let n = t.getAttribute("data-day");
		this.host.current.day = n;
		let r = (l(n).getDay() - this.host.options.firstDay + 7) % 7, i = getComputedStyle(t).direction === "rtl" ? -1 : 1, { key: a, code: o } = e, s = {
			ArrowLeft: () => {
				e.preventDefault(), this.focusDayByOffset(n, -i);
			},
			ArrowRight: () => {
				e.preventDefault(), this.focusDayByOffset(n, i);
			},
			ArrowUp: () => {
				e.preventDefault(), this.focusDayByOffset(n, -7);
			},
			ArrowDown: () => {
				e.preventDefault(), this.focusDayByOffset(n, 7);
			},
			Home: () => {
				e.preventDefault(), this.focusDayByOffset(n, -r);
			},
			End: () => {
				e.preventDefault(), this.focusDayByOffset(n, 6 - r);
			},
			PageUp: () => {
				e.preventDefault(), this.host.move(e.shiftKey ? -12 : -1);
			},
			PageDown: () => {
				e.preventDefault(), this.host.move(e.shiftKey ? 12 : 1);
			},
			default: () => !1
		};
		return (s[a || o] || s.default)();
	};
}, _ = (e) => {
	let t = document.createElement("input");
	return t.type = "date", Object.assign(t, e), t.validationMessage;
}, v = {
	"--previous-month": -1,
	"--next-month": 1,
	"--previous-year": -12,
	"--next-year": 12
}, y = (e) => {
	for (let t = e; t; t = t.getRootNode().host) {
		let e = t.closest("[lang]");
		if (e) return e.getAttribute("lang");
	}
	return null;
}, b = (e, t, n, { label: r, disabled: i, current: a, tabIndex: o }) => `
	<button
		type="button"
		${n ? `class="${n}"` : ""}
		data-day="${e}"
		tabindex="${o}"
		aria-label="${r}"
		${i ? "aria-disabled=\"true\"" : ""}
		${a ? "aria-current=\"date\"" : ""}
	>
		${t}
	</button>
`, x = class extends HTMLElement {
	static formAssociated = !0;
	static observedAttributes = [
		"lang",
		"first-day",
		"min",
		"max",
		"required"
	];
	today = /* @__PURE__ */ new Date();
	day = "";
	options = {
		mode: "single",
		firstDay: 0,
		locale: "en",
		buttonClass: "",
		deselectable: !1
	};
	current = {
		month: 0,
		year: 0,
		day: null
	};
	#e = null;
	#t = this.attachInternals();
	#n = null;
	#r = 0;
	$body = null;
	$title = null;
	picked = [];
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	get validity() {
		return this.#t.validity;
	}
	get validationMessage() {
		return this.#t.validationMessage;
	}
	checkValidity() {
		return this.#t.checkValidity();
	}
	reportValidity() {
		return this.#t.reportValidity();
	}
	attributeChangedCallback(e, t, n) {
		this.$body && t !== n && this.render();
	}
	formDisabledCallback() {
		this.$body && this.render();
	}
	formResetCallback() {
		this.setPicked([...this.#n ?? []], !1);
	}
	formStateRestoreCallback(e) {
		this.setPicked(e ? e.split(",") : [], !1);
	}
	#i() {
		let e = y(this) || navigator.language;
		return {
			locale: e,
			firstDay: r(this.getAttribute("first-day"), p(e))
		};
	}
	#a() {
		return {
			mode: this.getAttribute("mode") || "single",
			...this.#i(),
			buttonClass: this.getAttribute("button-class") || "",
			deselectable: i(this.getAttribute("deselectable"), !1),
			name: this.getAttribute("name") || void 0
		};
	}
	init() {
		let e = /* @__PURE__ */ new Date();
		if (this.today = new Date(e.getFullYear(), e.getMonth(), e.getDate()), this.day = c(this.today), this.options = this.#a(), this.current = {
			month: r(this.getAttribute("data-month"), this.today.getMonth()),
			year: r(this.getAttribute("data-year"), this.today.getFullYear()),
			day: null
		}, this.$title = this.querySelector("[aria-live]"), this.$body = this.querySelector("[role=\"grid\"] tbody"), !this.$body) throw Error("Calendar: [role=\"grid\"] tbody not found");
		this.#e = new g(this), this.picked = JSON.parse(this.getAttribute("data-picked") || "[]"), this.#n ??= [...this.picked], this.render(), this.addEventListener("click", this.#f), this.addEventListener("command", this.#p), this.$body.addEventListener("focusin", this.#m), this.#e.attach(), this.options.mode === "range" && this.$body.addEventListener("mousemove", this.#h, !1);
	}
	destroy() {
		this.removeEventListener("click", this.#f), this.removeEventListener("command", this.#p), this.$body?.removeEventListener("focusin", this.#m), this.$body?.removeEventListener("mousemove", this.#h, !1), this.#e?.detach(), this.reset(), this.#t.setValidity({}), this.#t.states.clear(), this.#e = null, this.$body = null, this.$title = null;
	}
	move(e, { focus: t = !0 } = {}) {
		let { year: n, month: r } = this.current, i = new Date(n, r + e, 1);
		this.current.year = i.getFullYear(), this.current.month = i.getMonth(), this.render({ focus: t });
	}
	setPicked(e, t = !0) {
		this.picked = e, this.setAttribute("data-picked", JSON.stringify(this.picked)), this.#c(), this.#u(), t && this.#o();
	}
	#o() {
		t(this, e.CALENDAR_CHANGE, {
			values: this.picked,
			name: this.options.name
		}, { cancelable: !1 });
	}
	#s(e) {
		let t = this.getAttribute("min"), n = this.getAttribute("max");
		return this.matches(":disabled") || !!t && e < t || !!n && e > n;
	}
	#c() {
		let [e, t] = this.picked, n = this.options.mode === "range", r = n && this.picked.length === 2;
		this.$body?.querySelectorAll("[data-day]").forEach((i) => {
			let a = i.getAttribute("data-day"), o = r && u(a, e, t), s = i.closest("td");
			o || this.picked.includes(a) ? s?.setAttribute("aria-selected", "true") : s?.removeAttribute("aria-selected"), s?.toggleAttribute("data-range", o), s?.toggleAttribute("data-start", n && a === e), s?.toggleAttribute("data-end", r && a === t);
		}), this.#l();
	}
	#l() {
		let { length: e } = this.picked, t = {
			empty: e === 0,
			picking: this.options.mode === "range" && e === 1,
			pending: this.#r > 0
		};
		for (let [e, n] of Object.entries(t)) n ? this.#t.states.add(e) : this.#t.states.delete(e);
	}
	#u() {
		let e = this.picked.join(","), t = this.getAttribute("min") ?? "", n = this.getAttribute("max") ?? "", r = this.options.mode === "range" ? 2 : 1, i = this.$body?.querySelector("[data-day][tabindex=\"0\"]") ?? void 0;
		if (this.#t.setFormValue(e || null, e), this.hasAttribute("required") && this.picked.length < r) return this.#t.setValidity({ valueMissing: !0 }, _({ required: !0 }), i);
		if (r === 2 && this.picked.length === 1) return this.#t.setValidity({ badInput: !0 }, _({ required: !0 }), i);
		let a = this.picked.find((e) => t && e < t), o = this.picked.find((e) => n && e > n), s = a ? _({
			min: t,
			value: a
		}) : "", c = o ? _({
			max: n,
			value: o
		}) : "";
		if (s) return this.#t.setValidity({ rangeUnderflow: !0 }, s, i);
		if (c) return this.#t.setValidity({ rangeOverflow: !0 }, c, i);
		this.#t.setValidity({});
	}
	#d(e) {
		let { mode: t, deselectable: n } = this.options, r = this.picked.includes(e);
		return t === "multiple" ? r ? this.picked.filter((t) => t !== e) : [...this.picked, e].sort() : t === "range" ? this.picked.length === 1 ? [this.picked[0], e].sort() : [e] : r && n ? [] : [e];
	}
	#f = (t) => {
		let { target: r } = t;
		if (!(r instanceof Element)) return;
		let i = r.closest("[data-day]"), a = i?.getAttribute("data-day");
		if (!i || !a || !this.$body?.contains(i) || i.getAttribute("aria-disabled") === "true" || this.#s(a)) return;
		let o = this.#d(a);
		if (this.#e?.setFocusDay(i, { focus: !1 }), o.join() === this.picked.join()) return;
		let s = this.picked.join(), c = (e) => {
			e && this.picked.join() === s && this.setPicked(o);
		}, l = n(this, e.CALENDAR_BEFORE_CHANGE, {
			values: [...o],
			name: this.options.name
		});
		if (typeof l == "boolean") return c(l);
		this.#r += 1, this.#l(), l.then((e) => {
			--this.#r, this.#l(), c(e);
		});
	};
	#p = (e) => {
		let t = v[e.command];
		t && this.move(t, { focus: !1 });
	};
	previewRange(e) {
		if (this.options.mode !== "range" || this.picked.length !== 1 || !this.$body) return;
		let t = this.$body.querySelector(`[data-day="${e}"]`);
		if (!t || t.getAttribute("aria-disabled") === "true" || this.#s(e)) return;
		let [n, r] = [this.picked[0], e].sort();
		this.$body.querySelectorAll("[data-day]").forEach((e) => {
			let t = e.getAttribute("data-day"), i = e.closest("td");
			i?.toggleAttribute("data-range", u(t, n, r)), i?.toggleAttribute("data-start", t === n), i?.toggleAttribute("data-end", t === r);
		});
	}
	#m = (e) => {
		let t = e.target.closest("[data-day]");
		t && this.$body?.contains(t) && this.#e?.setFocusDay(t, { focus: !1 }), this.#u();
	};
	#h = (e) => {
		let t = e.target.closest("[data-day]"), n = t?.getAttribute("data-day");
		t && n && this.$body?.contains(t) && this.previewRange(n);
	};
	getWeekdayNames() {
		return this.options.days ?? h(this.options.locale);
	}
	renderDays() {
		let e = this.querySelector("[role=\"grid\"] thead tr");
		if (!e) return;
		let t = this.getWeekdayNames(), n = h(this.options.locale, "long");
		e.innerHTML = "";
		for (let r = 0; r < 7; r += 1) {
			let i = (this.options.firstDay + r) % 7, a = document.createElement("th");
			a.scope = "col", a.abbr = n[i], a.textContent = t[i], e.appendChild(a);
		}
	}
	renderHeader(e, t) {
		let n = m(this.options.locale, {
			month: "long",
			year: "numeric"
		}).format(new Date(e, t, 1));
		this.$title && this.$title.textContent !== n && (this.$title.textContent = n);
	}
	renderCalendar(e, t) {
		if (!this.$body) return;
		let n = this.options.buttonClass ?? "", r = m(this.options.locale, {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		}), i = new Intl.NumberFormat(this.options.locale), a = 1;
		for (let o = 0; 6 >= o; o += 1) {
			let s = document.createElement("tr");
			for (let l = this.options.firstDay; l < 7 + this.options.firstDay; l += 1) {
				let u = new Date(e, t, a), p = document.createElement("td");
				if (o === 0 && l < this.options.firstDay + f(e, t, this.options.firstDay)) s.appendChild(p);
				else if (a > d(e, t)) break;
				else {
					let e = c(u);
					p.innerHTML = b(e, i.format(a), n, {
						label: r.format(u),
						disabled: this.#s(e),
						current: e === this.day,
						tabIndex: -1
					}), s.appendChild(p), a += 1;
				}
			}
			s.childNodes.length && this.$body.appendChild(s);
		}
		this.#c();
	}
	reset() {
		this.$body && (this.$body.innerHTML = "");
	}
	render({ focus: n = !1 } = {}) {
		let { activeElement: r } = this.getRootNode(), i = !!this.$body?.contains(r);
		Object.assign(this.options, this.#i()), this.reset(), this.renderDays(), this.renderHeader(this.current.year, this.current.month), this.renderCalendar(this.current.year, this.current.month), t(this, e.CALENDAR_RENDER, {
			year: this.current.year,
			month: this.current.month
		}, { cancelable: !1 }), this.#e?.sync({ focus: n || i }), this.#u();
	}
};
customElements.get("cinq-calendar") || customElements.define("cinq-calendar", x);
//#endregion
export { x as Calendar, l as dateFromDay, c as dayFromDate, p as getFirstDay };
