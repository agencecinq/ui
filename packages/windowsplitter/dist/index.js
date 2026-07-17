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
}, t = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, n = document.documentElement, { body: r } = document;
n.hasAttribute("data-debug");
var i = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", t(({ x: e, y: t }) => {
	i.x = e, i.y = t;
}, 100), { passive: !0 }), window.matchMedia("(width >= 64rem)"), window.matchMedia("(min-width: 1280px)"), window.matchMedia("(min-width: 1440px)"), window.matchMedia("(min-width: 1920px)");
var a = (e, t, n) => Math.min(Math.max(e, t), n), o = ({ value: e }) => `${e}%`, s = (e) => String(e), c = (e, t) => {
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, l = (e, t) => {
	let n = e.getAttribute(t);
	return n !== null && n !== "false" && n !== "0";
}, u = (e, t, n) => {
	let r = e.getAttribute(t);
	if (r === null || r === "") return n;
	let i = Number(r);
	return Number.isFinite(i) ? i : n;
}, d = (e) => {
	let t = e.getAttribute("aria-orientation");
	return t === "horizontal" || t === "vertical" ? t : "vertical";
}, f = class extends HTMLElement {
	static observedAttributes = [
		"disabled",
		"data-windowsplitter-mode",
		"data-windowsplitter-step",
		"data-windowsplitter-page",
		"data-windowsplitter-fixed"
	];
	$container = null;
	$primary = null;
	mode = "resize";
	step = 1;
	page = 10;
	fixed = !1;
	formatSize = o;
	formatValue = s;
	previousValue = null;
	isMoving = !1;
	pointerId = null;
	grabOffset = 0;
	previousTouchAction = "";
	resizeObserver = null;
	bound = !1;
	reflectingAttribute = !1;
	containerOverride = null;
	connectedCallback() {
		this.mount();
	}
	disconnectedCallback() {
		this.destroy();
	}
	attributeChangedCallback() {
		this.reflectingAttribute || !this.bound || (this.syncOptionsFromAttributes(), this.sync());
	}
	get orientation() {
		return d(this);
	}
	get vertical() {
		return this.orientation === "vertical";
	}
	get min() {
		return c(this.getAttribute("aria-valuemin"), 0);
	}
	get max() {
		return c(this.getAttribute("aria-valuemax"), 100);
	}
	get value() {
		return c(this.getAttribute("aria-valuenow"), this.min);
	}
	set value(e) {
		this.setValue(e, !1);
	}
	get ratio() {
		let { min: e, max: t, value: n } = this, r = t - e;
		return r > 0 ? (n - e) / r : 0;
	}
	get disabled() {
		return this.hasAttribute("disabled") || this.getAttribute("aria-disabled") === "true";
	}
	set disabled(e) {
		this.reflectingAttribute = !0, e ? (this.setAttribute("disabled", ""), this.setAttribute("aria-disabled", "true")) : (this.removeAttribute("disabled"), this.removeAttribute("aria-disabled")), this.reflectingAttribute = !1, this.sync();
	}
	get collapsed() {
		return this.value === this.min;
	}
	set container(e) {
		this.containerOverride = e, this.bound && (this.resolveContainer(), this.observeContainer(), this.sync());
	}
	get container() {
		return this.$container;
	}
	sync() {
		this.$container && (this.resolvePrimary(), this.setAttribute("aria-valuetext", this.formatValue(this.value)), this.reflectCollapsedAttribute(), this.reflectDisabledAttribute(), this.apply(this.value, !1));
	}
	setValue(e, t = !0) {
		if (this.disabled) return !1;
		let n = this.value, r = a(Math.round(e), this.min, this.max), i = r !== n || !this.hasAttribute("aria-valuenow");
		return i && !this.collapsed && r === this.min && (this.previousValue = n), this.setAttribute("aria-valuenow", String(r)), this.setAttribute("aria-valuetext", this.formatValue(r)), this.apply(r, t && i), i;
	}
	collapse(e = !0) {
		return this.disabled || this.collapsed ? !1 : (this.previousValue = this.value, this.setValue(this.min, e));
	}
	restore(e = !0) {
		if (this.disabled || !this.collapsed) return !1;
		let t = Math.round((this.min + this.max) / 2), n = this.previousValue ?? t;
		return this.previousValue = null, this.setValue(n, e);
	}
	toggle(e = !0) {
		return this.collapsed ? this.restore(e) : this.collapse(e);
	}
	destroy() {
		this.bound &&= (this.removeEventListener("keydown", this.handleKeydown), this.removeEventListener("pointerdown", this.handlePointerdown), this.removeEventListener("pointermove", this.handlePointermove), this.removeEventListener("pointerup", this.handlePointerup), this.removeEventListener("pointercancel", this.handlePointerup), this.removeEventListener("lostpointercapture", this.handlePointerup), this.style.touchAction = this.previousTouchAction, this.removeAttribute("dragging"), !1), this.resizeObserver?.disconnect(), this.resizeObserver = null, this.$primary = null, this.$container = null;
	}
	mount() {
		if (!this.bound) {
			if (this.syncOptionsFromAttributes(), this.resolveContainer(), !this.$container) {
				console.warn("cinq-windowsplitter: container not found (no parentElement)");
				return;
			}
			this.previousTouchAction = this.style.touchAction, this.style.touchAction = "none", this.addEventListener("keydown", this.handleKeydown), this.addEventListener("pointerdown", this.handlePointerdown), this.addEventListener("pointermove", this.handlePointermove), this.addEventListener("pointerup", this.handlePointerup), this.addEventListener("pointercancel", this.handlePointerup), this.addEventListener("lostpointercapture", this.handlePointerup), this.bound = !0, this.observeContainer(), this.sync();
		}
	}
	syncOptionsFromAttributes() {
		let e = this.getAttribute("data-windowsplitter-mode");
		this.mode = e === "clip" || e === "none" || e === "resize" ? e : "resize", this.step = u(this, "data-windowsplitter-step", 1), this.page = u(this, "data-windowsplitter-page", 10), this.fixed = l(this, "data-windowsplitter-fixed");
	}
	resolveContainer() {
		this.$container = this.containerOverride ?? this.parentElement;
	}
	resolvePrimary() {
		let e = this.getAttribute("aria-controls");
		this.$primary = e ? document.getElementById(e) : null;
	}
	observeContainer() {
		this.resizeObserver?.disconnect(), this.resizeObserver = null, !(!this.$container || typeof ResizeObserver > "u") && (this.resizeObserver = new ResizeObserver(() => this.apply(this.value, !1)), this.resizeObserver.observe(this.$container));
	}
	apply(e, t) {
		if (!this.$container) return;
		let { min: n, max: r } = this, i = Math.max(1, r - n), a = (e - n) / i, o = this.containerLength(), s = Math.round(a * o);
		this.$container.style.setProperty("--windowsplitter-value", String(e)), this.$container.style.setProperty("--windowsplitter-ratio", String(a)), this.$container.style.setProperty("--windowsplitter-offset", `${s}px`), this.vertical ? this.style.setProperty("transform", `translate3d(${s}px, 0, 0)`) : this.style.setProperty("transform", `translate3d(0, ${s}px, 0)`), this.reflectCollapsedAttribute(), this.update(e, a, o, s), this.emit(t, e, a);
	}
	update(e, t, n, r) {
		if (!this.$primary || this.mode === "none") return;
		if (this.mode === "clip") {
			let e = Math.max(0, n - r);
			this.vertical ? this.$primary.style.clipPath = `inset(0px ${e}px 0px 0px)` : this.$primary.style.clipPath = `inset(0px 0px ${e}px 0px)`;
			return;
		}
		let i = this.formatSize({
			value: e,
			ratio: t,
			offset: r,
			length: n
		});
		this.vertical ? (this.$primary.style.width = i, this.$primary.style.flexBasis = i) : (this.$primary.style.height = i, this.$primary.style.flexBasis = i);
	}
	containerLength() {
		if (!this.$container) return 0;
		let { width: e, height: t } = this.$container.getBoundingClientRect();
		return this.vertical ? e : t;
	}
	pointerPosition(e) {
		if (!this.$container) return 0;
		let { left: t, top: n } = this.$container.getBoundingClientRect();
		return this.vertical ? e.clientX - t : e.clientY - n;
	}
	valueFromPointer(e) {
		let t = this.containerLength(), { min: n, max: r } = this, i = r - n, o = this.pointerPosition(e) - this.grabOffset, s = t > 0 ? o / t : 0;
		return a(Math.round(n + i * s), n, r);
	}
	handlePointerdown = (e) => {
		if (this.disabled || e.button !== 0) return;
		if (this.focus({ preventScroll: !0 }), e.preventDefault(), this.fixed) {
			this.toggle();
			return;
		}
		let t = this.containerLength(), n = this.ratio * t;
		this.grabOffset = this.pointerPosition(e) - n, this.isMoving = !0, this.pointerId = e.pointerId, this.reflectDraggingAttribute(!0), this.setPointerCapture(e.pointerId);
	};
	handlePointermove = (e) => {
		!this.isMoving || e.pointerId !== this.pointerId || (this.setValue(this.valueFromPointer(e)), e.preventDefault());
	};
	handlePointerup = (e) => {
		e.pointerId !== this.pointerId && this.pointerId !== null || (this.isMoving = !1, this.pointerId = null, this.grabOffset = 0, this.reflectDraggingAttribute(!1), this.hasPointerCapture?.(e.pointerId) && this.releasePointerCapture(e.pointerId));
	};
	handleKeydown = (e) => {
		if (this.disabled) return;
		let { key: t, shiftKey: n } = e, r = n ? this.page : this.step, i = this.value, a = (t) => {
			this.setValue(t), e.preventDefault();
		}, o = () => {
			this.toggle(), e.preventDefault();
		};
		if (t === "Enter") {
			o();
			return;
		}
		if (!this.fixed) switch (t) {
			case "Home":
				a(this.min);
				break;
			case "End":
				a(this.max);
				break;
			case "PageUp":
				a(i + this.page);
				break;
			case "PageDown":
				a(i - this.page);
				break;
			case "ArrowLeft":
				a(i - r);
				break;
			case "ArrowRight":
				a(i + r);
				break;
			case "ArrowUp":
				a(this.vertical ? i + r : i - r);
				break;
			case "ArrowDown":
				a(this.vertical ? i - r : i + r);
				break;
			default: break;
		}
	};
	emit(t, n, r) {
		if (!t) return;
		let i = {
			value: n,
			min: this.min,
			max: this.max,
			ratio: r,
			collapsed: n === this.min
		};
		this.dispatchEvent(new CustomEvent(e.WINDOWSPLITTER_CHANGE, {
			bubbles: !0,
			detail: i
		}));
	}
	reflectCollapsedAttribute() {
		this.reflectingAttribute = !0, this.collapsed ? this.setAttribute("collapsed", "") : this.removeAttribute("collapsed"), this.reflectingAttribute = !1;
	}
	reflectDraggingAttribute(e) {
		this.reflectingAttribute = !0, e ? this.setAttribute("dragging", "") : this.removeAttribute("dragging"), this.reflectingAttribute = !1;
	}
	reflectDisabledAttribute() {
		this.reflectingAttribute = !0, this.disabled ? this.setAttribute("disabled", "") : this.getAttribute("aria-disabled") !== "true" && this.removeAttribute("disabled"), this.reflectingAttribute = !1;
	}
};
customElements.get("cinq-windowsplitter") || customElements.define("cinq-windowsplitter", f);
//#endregion
export { f as WindowSplitter };
