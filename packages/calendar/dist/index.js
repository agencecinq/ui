import { EVENTS as e, dispatchBeforeEvent as t, dispatchEvent as n, parseBoolean as r, parseNumber as i } from "@agencecinq/utils";
//#region src/utils.ts
function a(e) {
	return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
}
function o(e) {
	let [t, n, r] = e.split("-").map(Number);
	return new Date(t, n - 1, r);
}
function s(e, t, n) {
	return e >= t && e <= n;
}
function c(e, t) {
	return new Date(e, t + 1, 0).getDate();
}
function l(e, t, n = 0) {
	return (new Date(e, t, 1).getDay() - n + 7) % 7;
}
function u(e) {
	return (new Intl.Locale(e).getWeekInfo?.()?.firstDay ?? 0) % 7;
}
function d(e, t) {
	return new Intl.DateTimeFormat(e, {
		...t,
		calendar: "gregory"
	});
}
function f(e, t = "short") {
	let n = d(e, { weekday: t });
	return Array.from({ length: 7 }, (e, t) => n.format(new Date(2020, 0, 5 + t)));
}
//#endregion
//#region src/keyboard.ts
var p = class {
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
		let { current: e } = this.host, t = e.day ? o(e.day).getDate() : 1, n = c(e.year, e.month);
		return a(new Date(e.year, e.month, Math.min(t, n)));
	}
	focusDayByOffset(e, t) {
		let n = o(e);
		n.setDate(n.getDate() + t);
		let r = a(n);
		this.host.current.day = r, this.host.current.year = n.getFullYear(), this.host.current.month = n.getMonth();
		let i = this.host.$body?.querySelector(`[data-day="${r}"]`);
		i ? this.setFocusDay(i) : this.host.render({ focus: !0 });
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
		let r = (o(n).getDay() - this.host.options.firstDay + 7) % 7, i = getComputedStyle(t).direction === "rtl" ? -1 : 1, { key: a, code: s } = e, c = {
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
		return (c[a || s] || c.default)();
	};
}, m = (e) => {
	let t = document.createElement("input");
	return t.type = "date", Object.assign(t, e), t.validationMessage;
}, h = {
	"--previous-month": -1,
	"--next-month": 1,
	"--previous-year": -12,
	"--next-year": 12
}, g = (e) => {
	for (let t = e; t; t = t.getRootNode().host) {
		let e = t.closest("[lang]");
		if (e) return e.getAttribute("lang");
	}
	return null;
}, _ = (e, t, n, { label: r, disabled: i, current: a, tabIndex: o }) => `
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
`, v = class extends HTMLElement {
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
		let e = g(this) || navigator.language;
		return {
			locale: e,
			firstDay: i(this.getAttribute("first-day"), u(e))
		};
	}
	#a() {
		return {
			mode: this.getAttribute("mode") || "single",
			...this.#i(),
			buttonClass: this.getAttribute("button-class") || "",
			deselectable: r(this.getAttribute("deselectable"), !1),
			name: this.getAttribute("name") || void 0
		};
	}
	init() {
		let e = /* @__PURE__ */ new Date();
		if (this.today = new Date(e.getFullYear(), e.getMonth(), e.getDate()), this.day = a(this.today), this.options = this.#a(), this.current = {
			month: i(this.getAttribute("data-month"), this.today.getMonth()),
			year: i(this.getAttribute("data-year"), this.today.getFullYear()),
			day: null
		}, this.$title = this.querySelector("[aria-live]"), this.$body = this.querySelector("[role=\"grid\"] tbody"), !this.$body) throw Error("Calendar: [role=\"grid\"] tbody not found");
		this.#e = new p(this), this.picked = JSON.parse(this.getAttribute("data-picked") || "[]"), this.#n ??= [...this.picked], this.render(), this.addEventListener("click", this.#f), this.addEventListener("command", this.#p), this.$body.addEventListener("focusin", this.#m), this.#e.attach(), this.options.mode === "range" && this.$body.addEventListener("mousemove", this.#h, !1);
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
		n(this, e.CALENDAR_CHANGE, {
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
			let a = i.getAttribute("data-day"), o = r && s(a, e, t), c = i.closest("td");
			o || this.picked.includes(a) ? c?.setAttribute("aria-selected", "true") : c?.removeAttribute("aria-selected"), c?.toggleAttribute("data-range", o), c?.toggleAttribute("data-start", n && a === e), c?.toggleAttribute("data-end", r && a === t);
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
		if (this.#t.setFormValue(e || null, e), this.hasAttribute("required") && this.picked.length < r) return this.#t.setValidity({ valueMissing: !0 }, m({ required: !0 }), i);
		if (r === 2 && this.picked.length === 1) return this.#t.setValidity({ badInput: !0 }, m({ required: !0 }), i);
		let a = this.picked.find((e) => t && e < t), o = this.picked.find((e) => n && e > n), s = a ? m({
			min: t,
			value: a
		}) : "", c = o ? m({
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
	#f = (n) => {
		let { target: r } = n;
		if (!(r instanceof Element)) return;
		let i = r.closest("[data-day]"), a = i?.getAttribute("data-day");
		if (!i || !a || !this.$body?.contains(i) || i.getAttribute("aria-disabled") === "true" || this.#s(a)) return;
		let o = this.#d(a);
		if (this.#e?.setFocusDay(i, { focus: !1 }), o.join() === this.picked.join()) return;
		let s = this.picked.join(), c = (e) => {
			e && this.picked.join() === s && this.setPicked(o);
		}, l = t(this, e.CALENDAR_BEFORE_CHANGE, {
			values: [...o],
			name: this.options.name
		});
		if (typeof l == "boolean") return c(l);
		this.#r += 1, this.#l(), l.then((e) => {
			--this.#r, this.#l(), c(e);
		});
	};
	#p = (e) => {
		let t = h[e.command];
		t && this.move(t, { focus: !1 });
	};
	previewRange(e) {
		if (this.options.mode !== "range" || this.picked.length !== 1 || !this.$body) return;
		let t = this.$body.querySelector(`[data-day="${e}"]`);
		if (!t || t.getAttribute("aria-disabled") === "true" || this.#s(e)) return;
		let [n, r] = [this.picked[0], e].sort();
		this.$body.querySelectorAll("[data-day]").forEach((e) => {
			let t = e.getAttribute("data-day"), i = e.closest("td");
			i?.toggleAttribute("data-range", s(t, n, r)), i?.toggleAttribute("data-start", t === n), i?.toggleAttribute("data-end", t === r);
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
		return this.options.days ?? f(this.options.locale);
	}
	renderDays() {
		let e = this.querySelector("[role=\"grid\"] thead tr");
		if (!e) return;
		let t = this.getWeekdayNames(), n = f(this.options.locale, "long");
		e.innerHTML = "";
		for (let r = 0; r < 7; r += 1) {
			let i = (this.options.firstDay + r) % 7, a = document.createElement("th");
			a.scope = "col", a.abbr = n[i], a.textContent = t[i], e.appendChild(a);
		}
	}
	renderHeader(e, t) {
		let n = d(this.options.locale, {
			month: "long",
			year: "numeric"
		}).format(new Date(e, t, 1));
		this.$title && this.$title.textContent !== n && (this.$title.textContent = n);
	}
	renderCalendar(e, t) {
		if (!this.$body) return;
		let n = this.options.buttonClass ?? "", r = d(this.options.locale, {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		}), i = new Intl.NumberFormat(this.options.locale), o = 1;
		for (let s = 0; 6 >= s; s += 1) {
			let u = document.createElement("tr");
			for (let d = this.options.firstDay; d < 7 + this.options.firstDay; d += 1) {
				let f = new Date(e, t, o), p = document.createElement("td");
				if (s === 0 && d < this.options.firstDay + l(e, t, this.options.firstDay)) u.appendChild(p);
				else if (o > c(e, t)) break;
				else {
					let e = a(f);
					p.innerHTML = _(e, i.format(o), n, {
						label: r.format(f),
						disabled: this.#s(e),
						current: e === this.day,
						tabIndex: -1
					}), u.appendChild(p), o += 1;
				}
			}
			u.childNodes.length && this.$body.appendChild(u);
		}
		this.#c();
	}
	reset() {
		this.$body && (this.$body.innerHTML = "");
	}
	render({ focus: t = !1 } = {}) {
		let { activeElement: r } = this.getRootNode(), i = !!this.$body?.contains(r);
		Object.assign(this.options, this.#i()), this.reset(), this.renderDays(), this.renderHeader(this.current.year, this.current.month), this.renderCalendar(this.current.year, this.current.month), n(this, e.CALENDAR_RENDER, {
			year: this.current.year,
			month: this.current.month
		}, { cancelable: !1 }), this.#e?.sync({ focus: t || i }), this.#u();
	}
};
customElements.get("cinq-calendar") || customElements.define("cinq-calendar", v);
//#endregion
export { v as Calendar, o as dateFromDay, a as dayFromDate, u as getFirstDay };
