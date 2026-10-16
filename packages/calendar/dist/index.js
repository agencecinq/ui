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
function g(e, t = "long") {
	let n = m(e, { month: t });
	return Array.from({ length: 12 }, (e, t) => n.format(new Date(2020, t, 1)));
}
//#endregion
//#region src/keyboard.ts
var _ = class {
	host;
	constructor(e) {
		this.host = e;
	}
	setFocusDay(e, { focus: t = !0 } = {}) {
		this.host.$body?.querySelectorAll(".js-day").forEach((e) => {
			e.tabIndex = -1;
		}), e.tabIndex = 0, this.host.current.day = e.getAttribute("data-day"), t && e.focus(), this.host.current.day && this.host.previewRange(this.host.current.day);
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
		let t = Array.from(this.host.$body.querySelectorAll(".js-day"));
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
		let t = e.target.closest(".js-day");
		if (!t) return;
		let n = t.getAttribute("data-day"), r = (l(n).getDay() - this.host.options.firstDay + 7) % 7, { key: i, code: a } = e, o = {
			ArrowLeft: () => {
				e.preventDefault(), this.focusDayByOffset(n, -1);
			},
			ArrowRight: () => {
				e.preventDefault(), this.focusDayByOffset(n, 1);
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
		return (o[i || a] || o.default)();
	};
}, v = {
	active: "active",
	range: "range",
	start: "start",
	end: "end"
}, y = [
	"single",
	"range",
	"multiple"
], b = (e) => {
	let t = e.getAttribute("mode");
	return t && y.includes(t) ? t : "single";
}, x = () => {
	let e = document.createElement("input");
	return e.required = !0, e.validationMessage;
}, S = (e, t, n, { label: r, disabled: i, current: a, tabIndex: o }) => `
	<button
		type="button"
		class="js-day${n ? ` ${n}` : ""}"
		data-day="${e}"
		tabindex="${o}"
		aria-label="${r}"
		${i ? "aria-disabled=\"true\"" : ""}
		${a ? "aria-current=\"date\"" : ""}
	>
		${t}
	</button>
`, C = class extends HTMLElement {
	static formAssociated = !0;
	static observedAttributes = [
		"min",
		"max",
		"required"
	];
	today = /* @__PURE__ */ new Date();
	day = "";
	options = {
		mode: "single",
		firstDay: 0,
		stateClasses: { ...v },
		locale: "en",
		buttonClass: "",
		deselect: !1
	};
	current = {
		month: 0,
		year: 0,
		day: null
	};
	#e = null;
	#t = () => {};
	#n = this.attachInternals();
	#r = null;
	#i = !1;
	$body = null;
	$title = null;
	$next = null;
	$previous = null;
	picked = [];
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.#e = null, this.$body = null, this.$title = null, this.$next = null, this.$previous = null;
	}
	attributeChangedCallback() {
		this.$body && this.render();
	}
	formDisabledCallback(e) {
		this.#i = e, this.$body && this.render();
	}
	formResetCallback() {
		this.setPicked([...this.#r ?? []], !1);
	}
	formStateRestoreCallback(e) {
		this.setPicked(e ? e.split(",") : [], !1);
	}
	#a() {
		let e = this.getAttribute("locale") || this.getAttribute("data-locale") || document.documentElement.getAttribute("lang") || "en", t = this.getAttribute("first-day");
		return {
			mode: b(this),
			firstDay: t != null && t !== "" ? r(t, p(e)) : p(e),
			stateClasses: { ...v },
			locale: e,
			buttonClass: this.getAttribute("button-class") || "",
			deselect: i(this.getAttribute("deselect"), !1),
			name: this.getAttribute("name") || void 0
		};
	}
	init() {
		let n = /* @__PURE__ */ new Date();
		if (this.today = new Date(n.getFullYear(), n.getMonth(), n.getDate()), this.day = c(this.today), this.options = this.#a(), this.current = {
			month: r(this.getAttribute("data-month"), this.today.getMonth()),
			year: r(this.getAttribute("data-year"), this.today.getFullYear()),
			day: null
		}, this.$title = this.querySelector(".js-title"), this.$body = this.querySelector(".js-body"), this.$next = this.querySelector(".js-next"), this.$previous = this.querySelector(".js-previous"), !this.$body) throw Error("Calendar: .js-body element not found");
		this.#e = new _(this), this.picked = JSON.parse(this.getAttribute("data-picked") || "[]"), this.#r ??= [...this.picked], this.render(), this.addEventListener("click", this.#l), this.#e.attach(), this.options.mode === "range" && this.$body.addEventListener("mousemove", this.#u, !1), this.#t = () => {
			let n = {
				values: this.picked,
				name: this.options.name
			};
			t(this, e.CALENDAR_CHANGE, n, { cancelable: !1 });
		};
	}
	destroy() {
		this.removeEventListener("click", this.#l), this.#e && (this.#e.detach(), this.$body?.removeEventListener("mousemove", this.#u, !1)), this.reset(), this.#t = () => {};
	}
	move(e, { focus: t = !0 } = {}) {
		let { year: n, month: r } = this.current, i = new Date(n, r + e, 1);
		this.current.year = i.getFullYear(), this.current.month = i.getMonth(), this.render({ focus: t });
	}
	setPicked(e, t = !0) {
		this.picked = e, this.setAttribute("data-picked", JSON.stringify(this.picked)), this.#o(), this.#s(), t && this.#t();
	}
	#o() {
		let { mode: e, stateClasses: t } = this.options, [n, r] = this.picked, i = e === "range", a = i && this.picked.length === 2;
		this.$body?.querySelectorAll(".js-day").forEach((e) => {
			let o = e.getAttribute("data-day"), s = this.picked.includes(o), c = a && u(o, n, r), l = e.closest("td");
			s || c ? l?.setAttribute("aria-selected", "true") : l?.removeAttribute("aria-selected"), e.classList.toggle(t.active, s), e.classList.toggle(t.range, c), e.classList.toggle(t.start, i && o === n), e.classList.toggle(t.end, a && o === r);
		});
	}
	#s() {
		this.#n.setFormValue(this.picked.join(",") || null);
		let e = this.options.mode === "range" ? 2 : 1;
		if (!this.hasAttribute("required") || this.picked.length >= e) {
			this.#n.setValidity({});
			return;
		}
		this.#n.setValidity({ valueMissing: !0 }, x(), this.$body?.querySelector(".js-day[tabindex=\"0\"]") ?? void 0);
	}
	#c(e) {
		let { mode: t, deselect: n } = this.options, r = this.picked.includes(e);
		return t === "multiple" ? r ? this.picked.filter((t) => t !== e) : [...this.picked, e].sort() : t === "single" ? r && n ? [] : [e] : this.picked.length === 1 ? [this.picked[0], e].sort() : [e];
	}
	#l = (t) => {
		let { target: r } = t;
		if (!(r instanceof HTMLElement)) return;
		if (r.closest(".js-next")) return this.move(1, { focus: !1 });
		if (r.closest(".js-previous")) return this.move(-1, { focus: !1 });
		let i = r.closest(".js-day");
		if (!i || i.getAttribute("aria-disabled") === "true") return;
		let a = this.#c(i.getAttribute("data-day"));
		if (this.#e?.setFocusDay(i, { focus: !1 }), a.join() === this.picked.join()) return;
		let o = this.picked, s = (e) => {
			e && this.picked === o && this.setPicked(a);
		}, c = n(this, e.CALENDAR_BEFORE_CHANGE, {
			values: [...a],
			name: this.options.name
		});
		if (typeof c == "boolean") return s(c);
		c.then(s);
	};
	previewRange(e) {
		if (this.options.mode !== "range" || this.picked.length !== 1 || !this.$body) return;
		let t = this.$body.querySelector(`[data-day="${e}"]`);
		if (!t || t.getAttribute("aria-disabled") === "true") return;
		let n = this.$body.querySelectorAll(".js-day"), r = this.$body.querySelector(`[data-day="${this.picked[0]}"]`), i = !1, a = this.picked[0], o = e;
		a > o && (i = !0, o = this.picked[0], a = e), n.forEach((e) => {
			let t = e.getAttribute("data-day");
			e.classList.remove(this.options.stateClasses.range, this.options.stateClasses.end, this.options.stateClasses.start), u(t, a, o) && e.classList.add(this.options.stateClasses.range);
		}), r?.classList.add(this.options.stateClasses.start), t.classList.add(this.options.stateClasses.end), i && (r?.classList.add(this.options.stateClasses.end), r?.classList.remove(this.options.stateClasses.start), t.classList.add(this.options.stateClasses.start), t.classList.remove(this.options.stateClasses.end));
	}
	#u = (e) => {
		let t = e.target.closest(".js-day");
		if (!t) return;
		let n = t.getAttribute("data-day");
		n && this.previewRange(n);
	};
	getMonthName(e) {
		return this.options.months?.[e] ?? g(this.options.locale)[e];
	}
	getWeekdayNames() {
		return this.options.days ?? h(this.options.locale);
	}
	renderDays() {
		let e = this.querySelector(".js-days");
		if (!e) return;
		let t = this.getWeekdayNames(), n = h(this.options.locale, "long");
		e.innerHTML = "";
		for (let r = 0; r < 7; r += 1) {
			let i = (this.options.firstDay + r) % 7, a = document.createElement("th");
			a.scope = "col", a.abbr = n[i], a.textContent = t[i], e.appendChild(a);
		}
	}
	renderHeader(e, t) {
		this.$title && (this.$title.textContent = m(this.options.locale, {
			month: "long",
			year: "numeric"
		}).format(new Date(e, t, 1))), this.$previous?.setAttribute("data-content", this.getMonthName(0 > t - 1 ? 11 : t - 1)), this.$next?.setAttribute("data-content", this.getMonthName(11 < t + 1 ? 0 : t + 1));
	}
	renderCalendar(e, t, { focus: n = !1 } = {}) {
		if (!this.$body) return;
		let r = this.options.buttonClass ?? "", i = this.getAttribute("min"), a = this.getAttribute("max"), o = m(this.options.locale, {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		}), s = 1;
		for (let n = 0; 6 >= n; n += 1) {
			let l = document.createElement("tr");
			for (let u = this.options.firstDay; u < 7 + this.options.firstDay; u += 1) {
				let p = new Date(e, t, s), m = document.createElement("td"), h = document.createElement("div");
				if (n === 0 && u < this.options.firstDay + f(e, t, this.options.firstDay)) l.appendChild(m);
				else if (s > d(e, t)) break;
				else {
					let e = c(p);
					h.innerHTML = S(e, s, r, {
						label: o.format(p),
						disabled: this.#i || !!i && e < i || !!a && e > a,
						current: e === this.day,
						tabIndex: -1
					}), m.appendChild(h), l.appendChild(m), s += 1;
				}
			}
			l.childNodes.length && this.$body.appendChild(l);
		}
		this.#o(), this.#e?.sync({ focus: n });
	}
	reset() {
		this.$body && (this.$body.innerHTML = "");
	}
	render({ focus: n = !1 } = {}) {
		this.reset(), this.renderDays(), this.renderHeader(this.current.year, this.current.month), this.renderCalendar(this.current.year, this.current.month, { focus: n }), this.#s(), t(this, e.CALENDAR_RENDER, {
			year: this.current.year,
			month: this.current.month
		}, { cancelable: !1 });
	}
};
customElements.get("cinq-calendar") || customElements.define("cinq-calendar", C);
//#endregion
export { C as Calendar, l as dateFromDay, c as dayFromDate, p as getFirstDay };
