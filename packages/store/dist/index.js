//#region src/store.ts
var e = (e) => {
	typeof globalThis.reportError == "function" ? globalThis.reportError(e) : console.error(e);
}, t = class {
	#e;
	#t;
	#n;
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = Promise.resolve();
	#o = 0;
	constructor(e, t = {}) {
		let { normalize: n = (e) => e, equals: r = Object.is } = t;
		this.#e = e, this.#t = n, this.#n = r;
	}
	get() {
		return this.#e;
	}
	get pending() {
		return this.#o > 0;
	}
	set(t) {
		let n = this.#e, r = typeof t == "function" ? t(n) : t, i = this.#t(r, n);
		this.#n(i, n) || (this.#e = i, this.#r.forEach((t) => {
			try {
				t(i, n);
			} catch (t) {
				e(t);
			}
		}));
	}
	subscribe(e) {
		return this.#r.add(e), () => {
			this.#r.delete(e);
		};
	}
	select(e, t, n = Object.is) {
		let r = e(this.#e);
		return t(r), this.subscribe((i) => {
			let a = e(i);
			n(a, r) || (r = a, t(a));
		});
	}
	mutate(e) {
		this.#s(1);
		let t = async () => {
			try {
				return this.set(await e(this.#e)), this.#e;
			} finally {
				this.#s(-1);
			}
		}, n = this.#a.then(t, t);
		return this.#a = n.catch(() => void 0), n;
	}
	subscribePending(e) {
		return this.#i.add(e), e(this.pending), () => {
			this.#i.delete(e);
		};
	}
	#s(t) {
		let n = this.pending;
		this.#o += t, n !== this.pending && this.#i.forEach((t) => {
			try {
				t(this.pending);
			} catch (t) {
				e(t);
			}
		});
	}
};
//#endregion
export { t as Store };
