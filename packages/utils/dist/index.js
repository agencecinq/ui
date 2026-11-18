//#region src/events.ts
var e = {
	DRAWER_BEFORE_CLOSE: "drawer:before-close",
	DRAWER_BEFORE_OPEN: "drawer:before-open",
	SHEET_BEFORE_CLOSE: "sheet:before-close",
	SHEET_BEFORE_OPEN: "sheet:before-open",
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
}, n = (e, n, r) => {
	let i = [], a = !0, o = (e) => {
		if (!a) throw Error(`${n}: call waitUntil() synchronously in the listener`);
		i.push(e);
	}, s = t(e, n, {
		...r,
		waitUntil: o
	}, { bubbles: !1 });
	return a = !1, s ? i.length === 0 || Promise.allSettled(i).then((e) => e.every((e) => e.status === "fulfilled")) : !1;
}, r = (e) => e ? e.trim().split(/\s+/).filter(Boolean) : [], i = (e, t) => {
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}, a = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", o = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, s = document.documentElement, { body: c } = document, l = s.hasAttribute("data-debug"), u = {
	y: 0,
	x: 0
}, d = {
	x: 0,
	y: 0
};
window.addEventListener("pointermove", o(({ x: e, y: t }) => {
	d.x = e, d.y = t;
}, 100), { passive: !0 });
var f = {
	lg: window.matchMedia("(width >= 64rem)"),
	xl: window.matchMedia("(min-width: 1280px)"),
	"2xl": window.matchMedia("(min-width: 1440px)"),
	"3xl": window.matchMedia("(min-width: 1920px)")
}, p = !0, m = (e, t) => {
	e !== void 0 && (u.x = e), t !== void 0 && (u.y = t), window.scrollTo(u.x, u.y);
};
function h() {
	let e = s.scrollLeft, t = s.scrollTop, n = c.scrollLeft, r = c.scrollTop;
	u.x = window.scrollX || e || n, u.y = window.scrollY || t || r || 0, s.style.setProperty("overflow", "hidden"), s.style.setProperty("height", "100%"), s.style.setProperty("scroll-padding-top", "0px"), m(u.x, u.y);
}
function g(e = 0) {
	let t = !0, n = u.y;
	typeof e == "number" ? n = e : typeof e == "boolean" && e === !1 && (t = !1), s.style.removeProperty("overflow"), s.style.removeProperty("height"), s.style.removeProperty("scroll-padding-top"), t && m(u.x, n);
}
//#endregion
//#region src/debounce.ts
var _ = (e, t) => {
	let n = null;
	return (...r) => {
		n && clearTimeout(n), n = setTimeout(() => {
			n = null, e(...r);
		}, t);
	};
}, v = {}, y = null;
function b(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function x(e) {
	if (!e) return [];
	let t = [
		"summary",
		"a[href]",
		"button:enabled",
		"[tabindex]:not([tabindex^=\"-\"])",
		"input:not([type=hidden]):enabled",
		"select:enabled",
		"textarea:enabled",
		"object",
		"iframe",
		"[contenteditable]"
	].join(",");
	return Array.from(e.querySelectorAll(t)).filter((e) => b(e) && e.getAttribute("tabindex") !== "-1");
}
function S(e) {
	if (y) return;
	let t = e ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
	t && t !== document.body && t.isConnected && (y = t);
}
function C() {
	y?.focus(), y = null;
}
function w(e) {
	queueMicrotask(() => {
		let t = document.activeElement;
		t instanceof HTMLElement && t !== document.body && !e?.contains(t) || C();
	});
}
function T(e, t = e) {
	let n = x(e);
	if (n.length === 0) return;
	let r = n[0], i = n[n.length - 1];
	S(), E(), v.keydown = (t) => {
		t.key === "Tab" && (t.shiftKey ? (document.activeElement === r || document.activeElement === e) && (t.preventDefault(), i.focus()) : document.activeElement === i && (t.preventDefault(), r.focus()));
	}, document.addEventListener("keydown", v.keydown), t.focus(), t instanceof HTMLInputElement && [
		"search",
		"text",
		"email",
		"url"
	].includes(t.type) && t.value && t.setSelectionRange(0, t.value.length);
}
function E(e = null) {
	v.keydown && document.removeEventListener("keydown", v.keydown), e && e.focus();
}
//#endregion
//#region src/clamp.ts
var D = (e, t, n) => Math.min(Math.max(e, t), n), O = 50, k = (e, t = {}) => {
	let { host: n, target: r, start: i, move: a, end: o } = t, s = null, c = ({ startX: e, startY: t, samples: n }) => {
		let r = n[0], i = n[n.length - 1], a = i.time - r.time, o = {
			dx: i.x - e,
			dy: i.y - t,
			vx: 0,
			vy: 0
		};
		return a <= 0 ? o : {
			...o,
			vx: (i.x - r.x) / a,
			vy: (i.y - r.y) / a
		};
	}, l = ({ samples: e }, { clientX: t, clientY: n, timeStamp: r }) => {
		let i = r - O;
		for (e.push({
			x: t,
			y: n,
			time: r
		}); e.length > 1 && e[0].time < i;) e.shift();
	}, u = (e) => {
		let { pointerId: t, $target: r } = e;
		s = null, n?.removeAttribute("dragging"), r.hasPointerCapture(t) && r.releasePointerCapture(t);
	}, d = (e) => {
		let { button: t, pointerId: a, clientX: o, clientY: c, timeStamp: l } = e;
		if (s || t !== 0) return;
		let u = r ? r(e) : e.currentTarget;
		u && i?.(e) !== !1 && (s = {
			pointerId: a,
			$target: u,
			startX: o,
			startY: c,
			samples: [{
				x: o,
				y: c,
				time: l
			}]
		}, n?.setAttribute("dragging", ""), u.setPointerCapture(a));
	}, f = (e) => {
		let t = s;
		t && e.pointerId === t.pointerId && (l(t, e), a?.(e, c(t)));
	}, p = (e) => {
		let t = s, { pointerId: n, type: r } = e;
		if (!t || n !== t.pointerId) return;
		let i = r !== "pointerup";
		i || l(t, e);
		let a = {
			...c(t),
			canceled: i
		};
		u(t), o?.(e, a);
	}, m = [
		["pointerdown", d],
		["pointermove", f],
		["pointerup", p],
		["pointercancel", p],
		["lostpointercapture", p]
	];
	m.forEach(([t, n]) => {
		e.addEventListener(t, n);
	});
	let h = () => {
		s && u(s);
	};
	return {
		cancel: h,
		destroy: () => {
			h(), m.forEach(([t, n]) => {
				e.removeEventListener(t, n);
			});
		}
	};
};
//#endregion
export { e as EVENTS, T as addTrapFocus, c as body, f as breakpoints, D as clamp, _ as debounce, h as disableScroll, n as dispatchBeforeEvent, t as dispatchEvent, g as enableScroll, x as getFocusableElements, s as html, l as isDebug, d as mouse, a as parseBoolean, r as parseList, i as parseNumber, p as production, S as rememberReturnFocus, E as removeTrapFocus, C as restoreReturnFocus, w as scheduleRestoreReturnFocus, u as scroll, o as throttle, k as trackDrag };
