import e from "fs-extra";
import { dirname as o, resolve as n } from "node:path";
import { fileURLToPath as a } from "node:url";
const s = a(import.meta.url), c = o(s);
function u() {
  return {
    name: "vite-plugin-cinq-drawer",
    async buildStart() {
      const i = n(c, "../src/drawer.liquid"), r = n(process.cwd(), "snippets/cinq-drawer.liquid");
      try {
        await e.pathExists(i) && (await e.ensureDir(o(r)), await e.copy(i, r), console.log("✅ CINQ : Liquid snippet copied."));
      } catch (t) {
        console.error("❌ CINQ : Copying error :", t);
      }
    },
    async handleHotUpdate({ file: i, server: r }) {
      if (i.endsWith("drawer.liquid")) {
        const t = n(process.cwd(), "snippets/cinq-drawer.html.liquid");
        await e.copy(i, t), r.ws.send({ type: "full-reload" });
      }
    }
  };
}
export {
  u as cinqDrawerPlugin
};
