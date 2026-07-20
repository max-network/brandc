// Generates the CSS delivery files from the single structured source (src/tokens.ts →
// dist/index.js). Run after `tsc`. Keeps the files bundler/CDN consumers link in sync with the
// strings SSR consumers inject — one source, generated targets.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { THEME_CSS, TAILWIND_CSS } from "../dist/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const banner = "/* GENERATED from src/tokens.ts by scripts/build-css.mjs — do not edit by hand. */\n";
writeFileSync(join(root, "theme.css"), banner + THEME_CSS, "utf8");
writeFileSync(join(root, "tailwind.css"), banner + TAILWIND_CSS, "utf8");
console.log("wrote theme.css + tailwind.css");
