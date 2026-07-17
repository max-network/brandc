import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import { CONTRACT, THEME_CSS, MAXHEALTH_CSS } from "../dist/index.js";

test("every contract token is defined in :root", () => {
  const root = THEME_CSS.slice(0, THEME_CSS.indexOf(".dark"));
  for (const name of CONTRACT) {
    assert.ok(root.includes(`--${name}:`), `missing --${name} in :root`);
  }
});

test("the dark scheme overrides scheme-dependent tokens", () => {
  // dark targets both conventions: `.dark` (class) and `[data-theme="dark"]` (attribute)
  assert.match(THEME_CSS, /\.dark,\s*\[data-theme="dark"\]\s*\{/);
  const dark = THEME_CSS.slice(THEME_CSS.indexOf(".dark"));
  for (const name of ["background", "foreground", "card", "primary", "border"]) {
    assert.ok(dark.includes(`--${name}:`), `dark scheme missing --${name}`);
  }
});

test("the Max Health brand is flat + sharp", () => {
  assert.ok(THEME_CSS.includes("--radius: 0rem"));
  assert.ok(THEME_CSS.includes("--shadow: none"));
});

test("THEME_CSS is the Max Health brand", () => {
  assert.equal(THEME_CSS, MAXHEALTH_CSS);
});

test("theme.css file is in sync with THEME_CSS (run `npm run build`)", () => {
  const css = readFileSync(new URL("../theme.css", import.meta.url), "utf8");
  assert.ok(css.endsWith(THEME_CSS), "theme.css is stale — regenerate via scripts/build-css.mjs");
});
