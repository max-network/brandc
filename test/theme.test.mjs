import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTRACT,
  THEME_CSS,
  TAILWIND_CSS,
  BASE_CSS,
  maxhealth,
  toPrefabTheme,
} from "../dist/index.js";

test("every contract token is declared in :root", () => {
  const rootStart = THEME_CSS.indexOf(":root {");
  const root = THEME_CSS.slice(rootStart, THEME_CSS.indexOf("}", rootStart));
  for (const name of CONTRACT) {
    assert.ok(root.includes(`--${name}:`), `missing --${name} in :root`);
  }
});

test("colours use light-dark() (single declaration, no duplicated dark block)", () => {
  assert.ok(THEME_CSS.includes("--background: light-dark(oklch(1 0 0), oklch(0.145 0 0))"));
  // no second block re-declaring the dark values
  assert.equal(THEME_CSS.match(/--background:/g)?.length, 1);
});

test("scheme override flips color-scheme on both .dark and [data-theme=dark]", () => {
  assert.ok(THEME_CSS.includes(":root {\n  color-scheme: light dark;"));
  assert.match(THEME_CSS, /\.dark,\s*\[data-theme="dark"\]\s*\{\s*color-scheme:\s*dark;\s*\}/);
  assert.match(THEME_CSS, /\.light,\s*\[data-theme="light"\]\s*\{\s*color-scheme:\s*light;\s*\}/);
});

test("colour tokens are @property-registered as <color>", () => {
  assert.match(THEME_CSS, /@property --primary \{\s*syntax: "<color>";/);
  assert.ok(THEME_CSS.includes("initial-value: oklch(0.205 0 0)")); // primary light
});

test("scheme-independent scalars are single values (not light-dark)", () => {
  assert.ok(THEME_CSS.includes("--radius: 0rem;"));
  assert.ok(THEME_CSS.includes("--shadow: none;"));
  assert.ok(THEME_CSS.includes("--font-sans:"));
});

test("Tailwind preset maps the contract to Tailwind namespaces BY REFERENCE (runtime-switchable)", () => {
  assert.ok(TAILWIND_CSS.startsWith("@theme inline {"));
  assert.ok(TAILWIND_CSS.includes("--color-primary: var(--primary);"));
  assert.ok(TAILWIND_CSS.includes("--color-background: var(--background);"));
  assert.ok(TAILWIND_CSS.includes("--radius: var(--radius);"));
  assert.ok(TAILWIND_CSS.includes("--font-sans: var(--font-sans);"));
  // referenced, never baked
  assert.ok(!/--color-primary:\s*oklch/.test(TAILWIND_CSS));
});

test("prefab wire theme splits colours into light/dark maps + scalars in light", () => {
  const theme = toPrefabTheme(maxhealth);
  assert.equal(theme.light.background, "oklch(1 0 0)");
  assert.equal(theme.dark.background, "oklch(0.145 0 0)");
  assert.equal(theme.light.radius, "0rem");
  assert.equal(theme.dark.radius, undefined); // scalar is scheme-independent
});

test("generated theme.css + tailwind.css are in sync with the source (run `npm run build`)", () => {
  const css = readFileSync(new URL("../theme.css", import.meta.url), "utf8");
  const tw = readFileSync(new URL("../tailwind.css", import.meta.url), "utf8");
  assert.ok(css.endsWith(THEME_CSS), "theme.css is stale");
  assert.ok(tw.endsWith(TAILWIND_CSS), "tailwind.css is stale");
});

test("base.css is opt-in element ergonomics, not part of the token contract", () => {
  // Framework quirk fix (Tailwind v4 dropped button cursor), on element selectors — no tokens.
  assert.ok(BASE_CSS.includes("cursor: pointer;"));
  assert.ok(BASE_CSS.includes('[role="button"]'));
  assert.ok(!BASE_CSS.includes("--"), "base.css must not declare custom properties");
});

test("generated base.css is in sync with the source (run `npm run build`)", () => {
  const base = readFileSync(new URL("../base.css", import.meta.url), "utf8");
  assert.ok(base.endsWith(BASE_CSS), "base.css is stale");
});
