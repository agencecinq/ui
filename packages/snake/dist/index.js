import { EVENTS as e, dispatchEvent as t, parseNumber as n, trackDrag as r } from "@agencecinq/utils";
//#region src/config.ts
var i = "#2a2a2a", a = 21, o = 15, s = 130, c = {
	up: "down",
	down: "up",
	left: "right",
	right: "left"
}, l = {
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
}, u = class {
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
		e !== c[this.#r] && (this.#i = e, !this.#c && this.#s && (this.#c = !0));
	}
	tick() {
		if (!this.#s) return "dead";
		if (!this.#c) return "idle";
		this.#r = this.#i;
		let { x: e, y: t } = l[this.#r], n = this.#n[0], r = {
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
}, d = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right"
}, f = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	handle = (e) => {
		let t = d[e.key];
		t && (e.preventDefault(), this.#e(t));
	};
}, p = class {
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
}, m = class {
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
}, h = class extends HTMLElement {
	static observedAttributes = ["cols", "rows"];
	$canvas = null;
	#e = new u();
	#t = null;
	#n = null;
	#r = null;
	#i = null;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$canvas = null, this.#n = null, this.#r = null;
	}
	attributeChangedCallback(e, t, n) {
		(e === "cols" || e === "rows") && this.#t && t !== n && this.#o(!0);
	}
	init() {
		if (this.#t) return;
		if (this.$canvas = this.querySelector("canvas"), !this.$canvas) throw Error("Snake must contain a canvas element");
		let e = this.$canvas.getContext("2d");
		if (!e) throw Error("Snake could not get a 2d canvas context");
		this.#n = new m(this.$canvas, e), this.#r = new f(this.#s), this.#t = new p(130, this.#c, this.#l), this.addEventListener("keydown", this.#p), this.#i = r(this.$canvas, {
			start: this.#m,
			end: this.#h
		}), this.#o(!1), this.sync(), this.#t.start();
	}
	destroy() {
		this.#t && (this.#t.stop(), this.#t = null, this.removeEventListener("keydown", this.#p), this.#i?.destroy(), this.#i = null, this.#n = null, this.#r = null);
	}
	sync() {
		this.#n?.resize(), this.#l();
	}
	replay() {
		this.#e.reset(), this.#d(), this.sync(), this.#t?.start(), this.$canvas?.focus(), t(this, e.SNAKE_REPLAY, { score: this.#e.score }, { cancelable: !1 });
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
	#a() {
		return {
			cols: Math.max(1, Math.floor(n(this.getAttribute("cols"), 21))),
			rows: Math.max(1, Math.floor(n(this.getAttribute("rows"), 15)))
		};
	}
	#o(n) {
		let { cols: r, rows: i } = this.#a();
		(r !== this.#e.cols || i !== this.#e.rows) && (this.#e.setSize(r, i), this.#d(), this.sync(), this.#t?.start(), n && t(this, e.SNAKE_REPLAY, { score: this.#e.score }, { cancelable: !1 }));
	}
	#s = (e) => {
		if (!this.#e.alive) return;
		let t = !this.#e.started;
		this.#e.setDirection(e), t && this.#e.started && (this.#c(), this.#t?.hold());
	};
	#c = () => {
		let n = this.#e.tick();
		n === "eat" ? (this.#d(), t(this, e.SNAKE_EAT, { score: this.#e.score }, { cancelable: !1 })) : n === "dead" && this.#u();
	};
	#l = () => {
		this.#n && this.$canvas && this.#n.draw({
			snake: this.#e.snake,
			food: this.#e.food,
			cols: this.#e.cols,
			rows: this.#e.rows
		}, this.#f());
	};
	#u() {
		this.#t?.stop(), this.#l(), t(this, e.SNAKE_OVER, { score: this.#e.score }, { cancelable: !1 });
	}
	#d() {
		this.#t && (this.#t.stepMs = Math.max(70, 130 - this.#e.score * 5));
	}
	#f() {
		let { $canvas: e } = this;
		return e ? getComputedStyle(e).color || "#2a2a2a" : i;
	}
	#p = (e) => {
		let { key: t, target: n } = e;
		if (this.#e.alive) this.#r?.handle(e);
		else {
			if (n instanceof Element && n.closest("button, a, input, textarea, select")) return;
			(t === "Enter" || t === " ") && (e.preventDefault(), this.replay());
		}
	};
	#m = () => {
		this.$canvas?.focus();
	};
	#h = (e, { dx: t, dy: n, canceled: r }) => {
		r || Math.hypot(t, n) < 24 || (Math.abs(t) > Math.abs(n) ? this.#s(t > 0 ? "right" : "left") : this.#s(n > 0 ? "down" : "up"));
	};
};
customElements.get("cinq-snake") || customElements.define("cinq-snake", h);
//#endregion
export { a as COLS, o as ROWS, s as STEP_MS, h as Snake, i as color };
