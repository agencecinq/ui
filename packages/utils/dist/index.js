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
}, a = (e, t = !1) => e == null ? t : e !== "false" && e !== "0", o = {
	x: 0,
	y: 0
}, s = (e, t) => {
	e !== void 0 && (o.x = e), t !== void 0 && (o.y = t), window.scrollTo(o.x, o.y);
};
function c() {
	let { documentElement: e, body: t } = document, n = e.scrollLeft, r = e.scrollTop, i = t.scrollLeft, a = t.scrollTop;
	o.x = window.scrollX || n || i, o.y = window.scrollY || r || a || 0, e.style.setProperty("overflow", "hidden"), e.style.setProperty("height", "100%"), e.style.setProperty("scroll-padding-top", "0px"), s(o.x, o.y);
}
function l(e = 0) {
	let t = !0, n = o.y;
	typeof e == "number" ? n = e : typeof e == "boolean" && e === !1 && (t = !1);
	let { documentElement: r } = document;
	r.style.removeProperty("overflow"), r.style.removeProperty("height"), r.style.removeProperty("scroll-padding-top"), t && s(o.x, n);
}
//#endregion
//#region src/throttle.ts
var u = (e, t) => {
	let n = null, r = null, i = () => {
		r && e(...r), n = null;
	};
	return (...e) => {
		r = e, n ||= setTimeout(i, t);
	};
}, d = (e, t) => {
	let n = null;
	return (...r) => {
		n && clearTimeout(n), n = setTimeout(() => {
			n = null, e(...r);
		}, t);
	};
};
//#endregion
//#region src/focus.ts
function f(e) {
	return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
function p(e) {
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
	return Array.from(e.querySelectorAll(t)).filter((e) => f(e) && e.getAttribute("tabindex") !== "-1");
}
//#endregion
//#region src/clamp.ts
var m = (e, t, n) => Math.min(Math.max(e, t), n), h = 50, g = (e, t = {}) => {
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
		let i = r - h;
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
		let d = r ? r(e) : e.currentTarget;
		if (!d) return;
		let f = {
			pointerId: a,
			$target: d,
			startX: o,
			startY: c,
			samples: [{
				x: o,
				y: c,
				time: l
			}]
		};
		s = f, n?.setAttribute("dragging", ""), d.setPointerCapture(a), i?.(e) === !1 && u(f);
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
	let g = () => {
		s && u(s);
	};
	return {
		cancel: g,
		destroy: () => {
			g(), m.forEach(([t, n]) => {
				e.removeEventListener(t, n);
			});
		}
	};
}, _ = (e, t, n) => {
	if (e.altKey || e.ctrlKey || e.metaKey) return;
	let r = t.length - 1, i = n === 0 ? r : n - 1, a = n === r ? 0 : n + 1, o = t[n].matches(":dir(rtl)"), s = {
		ArrowUp: i,
		ArrowLeft: o ? a : i,
		ArrowDown: a,
		ArrowRight: o ? i : a,
		Home: 0,
		End: r
	}[e.key];
	if (s !== void 0) return e.preventDefault(), t[s].focus(), s;
};
//#endregion
export { e as EVENTS, m as clamp, d as debounce, c as disableScroll, n as dispatchBeforeEvent, t as dispatchEvent, l as enableScroll, _ as focusByKey, p as getFocusableElements, a as parseBoolean, r as parseList, i as parseNumber, u as throttle, g as trackDrag };
