import { EVENTS as e, dispatchEvent as t, getFocusableElements as n } from "@agencecinq/utils";
//#region src/drilldown.ts
var { DRILLDOWN_OPEN: r, DRILLDOWN_CLOSE: i } = e, a = class extends HTMLElement {
	panels = [];
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.panels = [];
	}
	init() {
		this.panels = Array.from(this.children).filter((e) => e instanceof HTMLElement), this.addEventListener("click", this.#n);
	}
	destroy() {
		this.removeEventListener("click", this.#n);
	}
	get current() {
		return this.panels.find((e) => !e.hidden) ?? null;
	}
	open(e, i = null) {
		let a = this.current, o = this.panels.find((t) => t.id === e);
		if (!a || !o || o === a) return !1;
		let s = i ?? a.querySelector(`button[aria-controls="${CSS.escape(e)}"]`);
		return !s || !t(this, r, {
			panel: o,
			previous: a,
			$button: s,
			open: !0
		}) ? !1 : (this.dataset.direction = "forward", s.setAttribute("aria-expanded", "true"), a.hidden = !0, o.hidden = !1, (o.querySelector("[data-autofocus], [autofocus]") ?? n(o)[0])?.focus(), !0);
	}
	close(e = !0) {
		let n = this.current, r = n ? this.#e(n) : null, a = r ? this.#t(r) : null;
		return !n || !r || !a || !t(this, i, {
			panel: a,
			previous: n,
			$button: r,
			open: !1
		}) ? !1 : (this.dataset.direction = "back", r.setAttribute("aria-expanded", "false"), n.hidden = !0, a.hidden = !1, e && r.focus(), !0);
	}
	closeAll() {
		for (; this.close(!1););
		delete this.dataset.direction;
	}
	#e(e) {
		return this.querySelector(`button[aria-controls="${CSS.escape(e.id)}"][aria-expanded="true"]`);
	}
	#t(e) {
		return this.panels.find((t) => t.contains(e)) ?? null;
	}
	#n = (e) => {
		let t = e.target, n = t.closest("[data-close]");
		if (n && this.contains(n)) {
			this.close();
			return;
		}
		let r = t.closest("button[aria-controls]"), i = r?.getAttribute("aria-controls");
		r && i && this.contains(r) && this.open(i, r);
	};
};
customElements.get("cinq-drilldown") || customElements.define("cinq-drilldown", a);
//#endregion
export { a as Drilldown };
