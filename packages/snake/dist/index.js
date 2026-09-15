//#region ../utils/dist/index.js
var e = (e, t, n, r = {}) => {
	let { bubbles: i = !0, cancelable: a = !0 } = r;
	return e.dispatchEvent(new CustomEvent(t, {
		bubbles: i,
		cancelable: a,
		detail: n
	}));
}, t = (e, t) => {
	if (e == null || e === "") return t;
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
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
//#region src/config.ts
var a = "#2a2a2a", o = 21, s = 15, c = 130, l = {
	up: "down",
	down: "up",
	left: "right",
	right: "left"
}, u = {
	up: {
		x: 0,
		y: -1
	},
	down: {
		x: 0,
		y: 1
	},
	left: {
		x: -1,
		y: 0
	},
	right: {
		x: 1,
		y: 0
	}
}, d = class {
	#e;
	#t;
	#n = [];
	#r = "right";
	#i = "right";
	#a = {
		x: 0,
		y: 0
	};
	#o = 0;
	#s = !0;
	#c = !1;
	constructor(e = 21, t = 15) {
		this.#e = Math.max(1, e), this.#t = Math.max(1, t), this.reset();
	}
	get cols() {
		return this.#e;
	}
	get rows() {
		return this.#t;
	}
	get snake() {
		return this.#n;
	}
	get food() {
		return this.#a;
	}
	get score() {
		return this.#o;
	}
	get alive() {
		return this.#s;
	}
	get started() {
		return this.#c;
	}
	setSize(e, t) {
		this.#e = Math.max(1, Math.floor(e)), this.#t = Math.max(1, Math.floor(t)), this.reset();
	}
	reset() {
		let e = Math.min(3, this.#e), t = Math.min(this.#t - 1, Math.floor(this.#t / 2)), n = Math.min(this.#e - 1, Math.max(e - 1, Math.floor(this.#e / 2))), r = [];
		for (let i = 0; i < e; i += 1) r.push({
			x: n - i,
			y: t
		});
		this.#n = r, this.#r = "right", this.#i = "right", this.#o = 0, this.#s = !0, this.#c = !1, this.#d();
	}
	setDirection(e) {
		e !== l[this.#r] && (this.#i = e, !this.#c && this.#s && (this.#c = !0));
	}
	tick() {
		if (!this.#s) return "dead";
		if (!this.#c) return "idle";
		this.#r = this.#i;
		let { x: e, y: t } = u[this.#r], n = this.#n[0], r = {
			x: n.x + e,
			y: n.y + t
		};
		if (this.#l(r)) return this.#s = !1, "dead";
		let i = r.x === this.#a.x && r.y === this.#a.y;
		return this.#u(r, i) ? (this.#s = !1, "dead") : (this.#n.unshift(r), i ? (this.#o += 1, this.#d(), "eat") : (this.#n.pop(), "move"));
	}
	#l({ x: e, y: t }) {
		return e < 0 || t < 0 || e >= this.#e || t >= this.#t;
	}
	#u(e, t) {
		let n = t ? this.#n.length : this.#n.length - 1;
		for (let t = 0; t < n; t += 1) {
			let n = this.#n[t];
			if (n.x === e.x && n.y === e.y) return !0;
		}
		return !1;
	}
	#d() {
		let e = new Set(this.#n.map((e) => `${e.x},${e.y}`)), t = [];
		for (let n = 0; n < this.#t; n += 1) for (let r = 0; r < this.#e; r += 1) e.has(`${r},${n}`) || t.push({
			x: r,
			y: n
		});
		t.length !== 0 && (this.#a = t[Math.floor(Math.random() * t.length)]);
	}
}, f = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right"
}, p = 24, m = class {
	#e;
	#t = null;
	constructor(e) {
		this.#e = e;
	}
	handle = (e) => {
		let t = f[e.key];
		t && (e.preventDefault(), this.#e(t));
	};
	handlePointerDown = (e) => {
		this.#t = {
			x: e.clientX,
			y: e.clientY
		};
	};
	handlePointerUp = (e) => {
		let t = this.#t;
		if (this.#t = null, !t) return;
		let { clientX: n, clientY: r } = e, i = n - t.x, a = r - t.y;
		if (!(Math.hypot(i, a) < p)) {
			if (Math.abs(i) > Math.abs(a)) {
				this.#e(i > 0 ? "right" : "left");
				return;
			}
			this.#e(a > 0 ? "down" : "up");
		}
	};
	handlePointerCancel = () => {
		this.#t = null;
	};
}, h = class {
	#e;
	#t;
	#n;
	#r = 0;
	#i = 0;
	#a = 0;
	#o = !1;
	constructor(e, t, n) {
		this.#e = e, this.#t = t, this.#n = n;
	}
	get running() {
		return this.#o;
	}
	set stepMs(e) {
		this.#e = e;
	}
	hold() {
		this.#i = 0, this.#a = 0;
	}
	start() {
		this.#o || (this.#o = !0, this.#i = 0, this.#a = 0, this.#r = requestAnimationFrame(this.#s));
	}
	stop() {
		this.#o = !1, this.#r && (cancelAnimationFrame(this.#r), this.#r = 0, this.#i = 0, this.#a = 0);
	}
	#s = (e) => {
		if (!this.#o) return;
		if (this.#r = requestAnimationFrame(this.#s), this.#i === 0) {
			this.#i = e, this.#n();
			return;
		}
		let t = Math.min(e - this.#i, this.#e * 3);
		for (this.#i = e, this.#a += t; this.#o && this.#a >= this.#e;) this.#t(), this.#a -= this.#e;
		this.#o && this.#n();
	};
}, g = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	resize() {
		let { clientWidth: e, clientHeight: t } = this.#e;
		if (e === 0 || t === 0) return;
		let n = window.devicePixelRatio || 1, r = Math.round(e * n), i = Math.round(t * n);
		(this.#e.width !== r || this.#e.height !== i) && (this.#e.width = r, this.#e.height = i), this.#t.setTransform(n, 0, 0, n, 0, 0);
	}
	draw(e, t) {
		let n = this.#n(e.cols, e.rows);
		if (!n) return;
		let { width: r, height: i } = n, a = this.#t;
		a.imageSmoothingEnabled = !1, a.clearRect(0, 0, r, i);
		for (let r of e.snake) this.#r(r.x, r.y, n, t, .12);
		this.#r(e.food.x, e.food.y, n, t, .32);
	}
	#n(e, t) {
		let { clientWidth: n, clientHeight: r } = this.#e;
		return n === 0 || r === 0 ? null : {
			width: n,
			height: r,
			cols: e,
			rows: t
		};
	}
	#r(e, t, n, r, i) {
		let { width: a, height: o, cols: s, rows: c } = n, l = e * a / s, u = t * o / c, d = (e + 1) * a / s - l, f = (t + 1) * o / c - u, p = Math.max(1, Math.round(Math.min(d, f) * i)), m = d - p * 2, h = f - p * 2;
		m <= 0 || h <= 0 || (this.#t.fillStyle = r, this.#t.fillRect(l + p, u + p, m, h));
	}
}, _ = class extends HTMLElement {
	static observedAttributes = ["cols", "rows"];
	$canvas = null;
	#e = new d();
	#t = null;
	#n = null;
	#r = null;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$canvas = null, this.#n = null, this.#r = null;
	}
	attributeChangedCallback(e, t, n) {
		(e === "cols" || e === "rows") && this.#t && t !== n && this.#a(!0);
	}
	init() {
		if (this.#t) return;
		if (this.$canvas = this.querySelector("canvas"), !this.$canvas) throw Error("Snake must contain a canvas element");
		let e = this.$canvas.getContext("2d");
		if (!e) throw Error("Snake could not get a 2d canvas context");
		this.#n = new g(this.$canvas, e), this.#r = new m(this.#o), this.#t = new h(130, this.#s, this.#c), this.addEventListener("keydown", this.#f), this.$canvas.addEventListener("pointerdown", this.#p), this.$canvas.addEventListener("pointerup", this.#r.handlePointerUp), this.$canvas.addEventListener("pointercancel", this.#r.handlePointerCancel), this.#a(!1), this.sync(), this.#t.start();
	}
	destroy() {
		if (!this.#t) return;
		let { $canvas: e } = this, t = this.#r;
		this.#t.stop(), this.#t = null, this.removeEventListener("keydown", this.#f), e?.removeEventListener("pointerdown", this.#p), e && t && (e.removeEventListener("pointerup", t.handlePointerUp), e.removeEventListener("pointercancel", t.handlePointerCancel)), this.#n = null, this.#r = null;
	}
	sync() {
		this.#n?.resize(), this.#c();
	}
	replay() {
		this.#e.reset(), this.#u(), this.sync(), this.#t?.start(), this.$canvas?.focus(), e(this, "snake:replay", { score: this.#e.score });
	}
	get score() {
		return this.#e.score;
	}
	get cols() {
		return this.#e.cols;
	}
	get rows() {
		return this.#e.rows;
	}
	#i() {
		return {
			cols: Math.max(1, Math.floor(t(this.getAttribute("cols"), 21))),
			rows: Math.max(1, Math.floor(t(this.getAttribute("rows"), 15)))
		};
	}
	#a(t) {
		let { cols: n, rows: r } = this.#i();
		(n !== this.#e.cols || r !== this.#e.rows) && (this.#e.setSize(n, r), this.#u(), this.sync(), this.#t?.start(), t && e(this, "snake:replay", { score: this.#e.score }));
	}
	#o = (e) => {
		if (!this.#e.alive) return;
		let t = !this.#e.started;
		this.#e.setDirection(e), t && this.#e.started && (this.#s(), this.#t?.hold());
	};
	#s = () => {
		let t = this.#e.tick();
		if (t === "eat") {
			this.#u(), e(this, "snake:eat", { score: this.#e.score });
			return;
		}
		t === "dead" && this.#l();
	};
	#c = () => {
		this.#n && this.$canvas && this.#n.draw({
			snake: this.#e.snake,
			food: this.#e.food,
			cols: this.#e.cols,
			rows: this.#e.rows
		}, this.#d());
	};
	#l() {
		this.#t?.stop(), this.#c(), e(this, "snake:over", { score: this.#e.score });
	}
	#u() {
		this.#t && (this.#t.stepMs = Math.max(70, 130 - this.#e.score * 5));
	}
	#d() {
		let { $canvas: e } = this;
		return e ? getComputedStyle(e).color || "#2a2a2a" : a;
	}
	#f = (e) => {
		let { key: t, target: n } = e;
		if (!this.#e.alive) {
			if (n instanceof Element && n.closest("button, a, input, textarea, select")) return;
			(t === "Enter" || t === " ") && (e.preventDefault(), this.replay());
			return;
		}
		this.#r?.handle(e);
	};
	#p = (e) => {
		let { $canvas: t } = this;
		t && (t.focus(), t.setPointerCapture(e.pointerId), this.#r?.handlePointerDown(e));
	};
};
customElements.get("cinq-snake") || customElements.define("cinq-snake", _);
//#endregion
export { o as COLS, s as ROWS, c as STEP_MS, _ as Snake, a as color };
