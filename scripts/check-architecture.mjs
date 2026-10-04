import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const roots = ["app", "components", "hooks", "lib", "stores", "tests", "scripts"];
const componentLimit = 100;
const violations = [];

const checkDirectory = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await checkDirectory(file);
      continue;
    }
    if (!/\.(?:tsx?|mjs|mts)$/.test(file)) continue;
    const source = await readFile(file, "utf8");
    const lines = source.trimEnd().split(/\r?\n/).length;
    if (file.endsWith(".tsx") && !file.includes("__tests__") && lines > componentLimit) {
      violations.push(`${file}: ${lines} lines (component limit: ${componentLimit})`);
    }
    if (/^\s*(?:export\s+(?:default\s+)?)?(?:async\s+)?function\b/m.test(source)) {
      violations.push(`${file}: use an arrow function instead of a function declaration`);
    }
  }
};

await Promise.all(roots.map(checkDirectory));
if (violations.length) {
  console.error(violations.sort().join("\n"));
  process.exitCode = 1;
} else {
  console.log("Architecture checks passed: components ≤100 lines; arrow functions throughout.");
}
