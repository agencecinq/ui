//#region src/utils.ts
var e = (e) => e === "open" ? "closed" : "open", t = /* @__PURE__ */ new WeakMap(), n = (t, n, r) => {
	let i = new ToggleEvent("beforetoggle", {
		cancelable: n === "open",
		oldState: e(n),
		newState: n,
		source: r
	});
	return t.dispatchEvent(i);
}, r = (n, r, i) => {
	let a = t.get(n), o = a?.oldState ?? e(r);
	clearTimeout(a?.timeout);
	let s = setTimeout(() => {
		let e = new ToggleEvent("toggle", {
			oldState: o,
			newState: r,
			source: i
		});
		t.delete(n), n.dispatchEvent(e);
	});
	t.set(n, {
		oldState: o,
		timeout: s
	});
}, i = (e, t, n) => {
	if (e.altKey || e.ctrlKey || e.metaKey) return;
	let r = t.length - 1, i = n === 0 ? r : n - 1, a = n === r ? 0 : n + 1, o = t[n].matches(":dir(rtl)"), s = {
		ArrowUp: i,
		ArrowLeft: o ? a : i,
		ArrowDown: a,
		ArrowRight: o ? i : a,
		Home: 0,
		End: r
	}[e.key];
	s !== void 0 && (e.preventDefault(), t[s].focus());
}, a = "button[aria-expanded][aria-controls]", o = `a[href], ${a}`, s = "a[href], button:enabled, [tabindex]:not([tabindex^=\"-\"])", c = (e) => e.ariaExpanded === "true", l = (e) => e.ariaControlsElements ?? [], u = (e, t) => l(e).some((e) => e.contains(t)), d = (e, t) => t !== null && (e.contains(t) || u(e, t)), f = (e, t) => l(e).every((r) => n(r, t, e)), p = class extends HTMLElement {
	#e = null;
	#t = /* @__PURE__ */ new WeakMap();
	#n = null;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy();
	}
	init() {
		this.#e = new AbortController();
		let { signal: e } = this.#e;
		this.addEventListener("click", this.#u, { signal: e }), this.addEventListener("keydown", this.#g, { signal: e }), this.addEventListener("focusout", this.#p, { signal: e }), this.addEventListener("beforematch", this.#m, { signal: e }), this.addEventListener("pointerover", this.#d, { signal: e }), this.addEventListener("pointerout", this.#f, { signal: e }), document.addEventListener("keydown", this.#h, { signal: e });
	}
	destroy() {
		this.#e?.abort(), this.#n = null;
	}
	open(e) {
		if (c(e) || !f(e, "open")) return;
		let t = this.#i.filter((t) => !u(t, e) && !u(e, t));
		this.#s(t), this.#c(e, !0);
	}
	close(e) {
		let t = e ? this.#i.filter((t) => t === e || u(e, t)) : this.#i;
		this.#s(t);
	}
	toggle(e) {
		return c(e) ? this.close(e) : this.open(e);
	}
	get #r() {
		return [...this.querySelectorAll(a)];
	}
	get #i() {
		return this.#r.filter(c);
	}
	#a(e, t, n = this.#r) {
		let r = n.flatMap(l).filter((t) => e.some((e) => e !== t && e.contains(t)));
		return e.flatMap((e) => [...e.querySelectorAll(t)]).filter((e) => !r.some((t) => t.contains(e)));
	}
	#o(e) {
		let t = this.#r.filter((e) => !c(e));
		return this.#a(l(e), s, t);
	}
	#s(e) {
		e.toReversed().forEach((e) => {
			f(e, "closed"), this.#c(e, !1);
		});
	}
	#c(e, t) {
		let n = t ? "open" : "closed";
		e.ariaExpanded = t.toString(), !t && e === this.#n && (this.#n = null), l(e).forEach((i) => {
			r(i, n, e), t ? (this.#t.set(i, i.hidden || !0), i.hidden = !1) : (i.matches(":focus-within") && e.focus(), i.hidden = this.#t.get(i) ?? !0);
		});
	}
	#l(e) {
		return e.pointerType === "mouse" && this.hasAttribute("data-hover");
	}
	#u = (e) => {
		let t = e.target.closest(a);
		if (!t || !this.contains(t)) return;
		let n = t === this.#n;
		this.#n = null, n || this.toggle(t);
	};
	#d = (e) => {
		let t = e.target.closest(a), n = e.relatedTarget;
		this.#l(e) && t && this.contains(t) && !c(t) && !d(t, n) && (this.open(t), c(t) && (this.#n = t));
	};
	#f = (e) => {
		if (!this.#l(e)) return;
		let t = e.target, n = e.relatedTarget;
		this.#i.filter((e) => d(e, t) && !d(e, n)).forEach((e) => this.close(e));
	};
	#p = (e) => {
		this.contains(e.relatedTarget) || this.matches(":active") || this.close();
	};
	#m = (e) => {
		let t = e.target, n = this.#r.find((e) => l(e).includes(t));
		n && (this.open(n), t.hidden = "until-found");
	};
	#h = (e) => {
		if (e.key !== "Escape" || e.defaultPrevented || !this.#i.length) return;
		let t = e.target;
		return this.contains(t) ? (e.preventDefault(), this.close(this.#i.findLast((e) => u(e, t)))) : this.close();
	};
	#g = (e) => {
		if (this.dataset.arrowKeys === "false") return;
		let t = e.target, n = this.#i.filter((e) => u(e, t)), r = n.find((e) => !n.some((t) => u(t, e))), a = r ? this.#o(r) : this.#a([this], o), s = a.indexOf(t);
		if (s !== -1) return !r && e.key === "ArrowDown" && t instanceof HTMLButtonElement && c(t) ? (e.preventDefault(), this.#o(t)[0]?.focus()) : i(e, a, s);
	};
};
customElements.get("cinq-disclosure-navigation") || customElements.define("cinq-disclosure-navigation", p);
//#endregion
export { p as DisclosureNavigation };
