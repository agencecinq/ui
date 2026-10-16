//#region src/store.ts
var e = (e) => {
	typeof globalThis.reportError == "function" ? globalThis.reportError(e) : console.error(e);
}, t = 100, n = class {
	#e;
	#t;
	#n;
	#r = /* @__PURE__ */ new Set();
	#i = [];
	#a = /* @__PURE__ */ new Set();
	#o = Promise.resolve();
	#s = 0;
	constructor(e, t = {}) {
		let { normalize: n = (e) => e, equals: r = Object.is } = t;
		this.#e = e, this.#t = n, this.#n = r;
	}
	get() {
		return this.#e;
	}
	get pending() {
		return this.#s > 0;
	}
	set(n) {
		let r = this.#e, i = typeof n == "function" ? n(r) : n, a = this.#t(i, r);
		if (!this.#n(a, r)) {
			if (this.#i.length >= t) throw Error(`Store: over ${t} chained changes, a listener loops.`);
			if (this.#e = a, !(this.#i.push([a, r]) > 1)) try {
				for (let [t, n] of this.#i) this.#r.forEach((r) => {
					try {
						r(t, n);
					} catch (t) {
						e(t);
					}
				});
			} finally {
				this.#i = [];
			}
		}
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
		this.#c(1);
		let t = async () => {
			try {
				return this.set(await e(this.#e)), this.#e;
			} finally {
				this.#c(-1);
			}
		}, n = this.#o.then(t, t);
		return this.#o = n.catch(() => void 0), n;
	}
	subscribePending(e) {
		return this.#a.add(e), e(this.pending), () => {
			this.#a.delete(e);
		};
	}
	#c(t) {
		let n = this.pending;
		this.#s += t, n !== this.pending && this.#a.forEach((t) => {
			try {
				t(this.pending);
			} catch (t) {
				e(t);
			}
		});
	}
};
//#endregion
export { n as Store };
