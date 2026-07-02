import e from "fs-extra";
import { dirname as t, resolve as n } from "node:path";
import { fileURLToPath as r } from "node:url";
//#region src/plugin.ts
var i = t(r(import.meta.url));
function a() {
	return {
		name: "vite-plugin-cinq-drawer",
		async buildStart() {
			let r = n(i, "../src/drawer.html.liquid"), a = n(process.cwd(), "snippets/cinq-drawer.html.liquid");
			try {
				await e.pathExists(r) && (await e.ensureDir(t(a)), await e.copy(r, a), console.log("✅ CINQ : Liquid snippet copied."));
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
export { a as cinqDrawerPlugin };
