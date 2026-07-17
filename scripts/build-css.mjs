// Generates theme.css from the single source of truth (src/theme.ts → dist/index.js).
// Run after `tsc` so dist exists. Keeps the .css file consumers link in sync with the
// THEME_CSS string that SSR consumers inject — one source, two delivery formats.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { THEME_CSS } from "../dist/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const banner = "/* GENERATED from src/theme.ts by scripts/build-css.mjs — do not edit by hand. */\n";
writeFileSync(join(root, "theme.css"), banner + THEME_CSS, "utf8");
console.log("wrote theme.css");
