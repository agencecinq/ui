import e from "fs-extra";
import { dirname as t, resolve as n } from "node:path";
import { fileURLToPath as r } from "node:url";
//#region src/plugin.ts
var i = r(import.meta.url), a = t(i);
function o() {
	return {
		name: "vite-plugin-cinq-drawer",
		async buildStart() {
			let r = n(a, "../src/drawer.html.liquid"), i = n(process.cwd(), "snippets/cinq-drawer.html.liquid");
			try {
				await e.pathExists(r) && (await e.ensureDir(t(i)), await e.copy(r, i), console.log("✅ CINQ : Liquid snippet copied."));
			} catch (e) {
				console.error("❌ CINQ : Copying error :", e);
			}
		},
		async handleHotUpdate({ file: t, server: r }) {
			if (t.endsWith("drawer.html.liquid")) {
				let i = n(process.cwd(), "snippets/cinq-drawer.html.liquid");
				await e.copy(t, i), r.ws.send({ type: "full-reload" });
			}
		}
	};
}
//#endregion
export { o as cinqDrawerPlugin };
