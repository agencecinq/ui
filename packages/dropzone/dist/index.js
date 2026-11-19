import { EVENTS as e, dispatchEvent as t } from "@agencecinq/utils";
//#region src/filter.ts
function n(e, t) {
	let n = t.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean), r = e.name.toLowerCase(), i = e.type.toLowerCase();
	return !n.length || n.some((e) => e.startsWith(".") ? r.endsWith(e) : e.endsWith("/*") ? i.startsWith(e.slice(0, -1)) : i === e);
}
function r(e, { accept: t, maxSize: r, multiple: i }) {
	let a = [], o = [];
	return e.forEach((e) => {
		n(e, t) ? r && e.size > r ? o.push({
			file: e,
			reason: "size"
		}) : !i && a.length ? o.push({
			file: e,
			reason: "multiple"
		}) : a.push(e) : o.push({
			file: e,
			reason: "accept"
		});
	}), {
		accepted: a,
		rejected: o
	};
}
//#endregion
//#region src/dropzone.ts
var i = class extends HTMLElement {
	$label = null;
	$input = null;
	#e = 0;
	connectedCallback() {
		this.init();
	}
	disconnectedCallback() {
		this.destroy(), this.$label = null, this.$input = null;
	}
	init() {
		this.$label = this.querySelector("label");
		let e = this.$label?.control, t = this.querySelector("input[type=\"file\"]") ?? (e instanceof HTMLInputElement ? e : null);
		if (!t || t.type !== "file") throw Error("cinq-dropzone: needs an input[type=\"file\"] inside, or a label[for] pointing to one.");
		this.$input = t, this.addEventListener("dragenter", this.#n), this.addEventListener("dragover", this.#r), this.addEventListener("dragleave", this.#i), this.addEventListener("drop", this.#a), this.$input.addEventListener("change", this.#o);
	}
	destroy() {
		this.removeEventListener("dragenter", this.#n), this.removeEventListener("dragover", this.#r), this.removeEventListener("dragleave", this.#i), this.removeEventListener("drop", this.#a), this.$input?.removeEventListener("change", this.#o), this.#l();
	}
	get maxSize() {
		let e = Number(this.getAttribute("data-max-size"));
		return Number.isFinite(e) && e > 0 ? e : 0;
	}
	get files() {
		return Array.from(this.$input?.files ?? []);
	}
	clear() {
		this.$input && (this.$input.value = "", this.#c());
	}
	#t(e) {
		return Array.from(e.dataTransfer?.types ?? []).includes("Files") && !this.$input?.disabled;
	}
	#n = (e) => {
		this.#t(e) && (e.preventDefault(), this.#e += 1, this.toggleAttribute("dragover", !0));
	};
	#r = (e) => {
		this.#t(e) && (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "copy"));
	};
	#i = () => {
		this.#e = Math.max(0, this.#e - 1), this.#e || this.#l();
	};
	#a = (e) => {
		let t = Array.from(e.dataTransfer?.files ?? []);
		if (this.#l(), !this.$input || !this.#t(e) || !t.length) return;
		e.preventDefault();
		let { accepted: n } = this.#s(t);
		if (!n.length) return;
		let r = new DataTransfer();
		n.forEach((e) => r.items.add(e)), this.$input.files = r.files, this.#c();
	};
	#o = () => {
		if (!this.$input) return;
		let { accepted: n, rejected: r } = this.#s(this.files);
		if (r.length) {
			let e = new DataTransfer();
			n.forEach((t) => e.items.add(t)), this.$input.files = e.files;
		}
		t(this, e.DROPZONE_CHANGE, {
			files: n,
			$input: this.$input
		}, { cancelable: !1 });
	};
	#s(n) {
		let i = this.$input, a = r(n, {
			accept: i.accept,
			maxSize: this.maxSize,
			multiple: i.multiple
		});
		return a.rejected.length && t(this, e.DROPZONE_REJECT, {
			rejected: a.rejected,
			$input: i
		}, { cancelable: !1 }), a;
	}
	#c() {
		this.$input && (this.$input.dispatchEvent(new Event("input", { bubbles: !0 })), this.$input.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
	#l() {
		this.#e = 0, this.removeAttribute("dragover");
	}
};
customElements.get("cinq-dropzone") || customElements.define("cinq-dropzone", i);
//#endregion
export { i as Dropzone, n as accepts, r as filter };
