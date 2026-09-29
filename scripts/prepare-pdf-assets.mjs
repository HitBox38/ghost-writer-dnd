import { cpSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const pdfRequire = createRequire(require.resolve("react-pdf"));
const packagePath = pdfRequire.resolve("pdfjs-dist/package.json");
const { version } = JSON.parse(readFileSync(packagePath, "utf8"));
const source = dirname(packagePath);
const destination = new URL(`../public/pdfjs/${version}/`, import.meta.url);

for (const directory of ["cmaps", "standard_fonts", "wasm"]) {
  cpSync(join(source, directory), new URL(`${directory}/`, destination), { recursive: true });
}
cpSync(join(source, "build/pdf.worker.min.mjs"), new URL("pdf.worker.min.mjs", destination));
