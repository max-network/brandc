import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTRACT,
  THEME_CSS,
  TAILWIND_CSS,
  BASE_CSS,
  DASHBOARD_THEME_CSS,
  maxhealth,
  dashboard,
  toCss,
  toPrefabTheme,
} from "../dist/index.js";

test("every contract token is declared in :root", () => {
  const rootStart = THEME_CSS.indexOf(":root {");
  const root = THEME_CSS.slice(rootStart, THEME_CSS.indexOf("}", rootStart));
  for (const name of CONTRACT) {
    assert.ok(root.includes(`--${name}:`), `missing --${name} in :root`);
  }
});

test("colours use light-dark(), with no duplicated dark block", () => {
  assert.ok(THEME_CSS.includes("--background: light-dark(oklch(1 0 0), oklch(0.145 0 0))"));
  // A token is declared exactly twice — the plain light fallback in `:root`, then the
  // light-dark() upgrade inside the feature query. Never a third time.
  assert.equal(THEME_CSS.match(/--background:/g)?.length, 2);
  // And the dark scheme is still never a re-declared block of values: the selector carries
  // `color-scheme` and nothing else, which is what keeps one value per token per scheme.
  const darkRule = /\.dark,\s*\[data-theme="dark"\]\s*\{([^}]*)\}/.exec(THEME_CSS);
  assert.ok(darkRule, "no dark selector block");
  assert.equal(darkRule[1].trim(), "color-scheme: dark;");
});

test("scheme override flips color-scheme on both .dark and [data-theme=dark]", () => {
  assert.ok(THEME_CSS.includes(":root {\n  color-scheme: light dark;"));
  assert.match(THEME_CSS, /\.dark,\s*\[data-theme="dark"\]\s*\{\s*color-scheme:\s*dark;\s*\}/);
  assert.match(THEME_CSS, /\.light,\s*\[data-theme="light"\]\s*\{\s*color-scheme:\s*light;\s*\}/);
});

test("scheme-independent colour tokens are @property-registered as <color>", () => {
  assert.match(THEME_CSS, /@property --chart-1 \{\s*syntax: "<color>";/);
  assert.ok(THEME_CSS.includes("initial-value: oklch(0.69587 0.14907 162.5)")); // chart-1
  // ...and the scheme-dependent ones deliberately are not: a syntax would resolve their
  // light-dark() once at :root and break `color-scheme` on any descendant (csswg#13836).
  assert.doesNotMatch(THEME_CSS, /@property --primary \{/);
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

test("the dashboard brand is a second, distinct identity on the same contract", () => {
  // Same core contract token names as maxhealth (minus the maxhealth-specific accent pair).
  const coreTokens = Object.keys(maxhealth.colors).filter(
    (n) => n !== "maxhealth" && n !== "maxhealth-foreground",
  );
  for (const name of coreTokens) {
    assert.ok(dashboard.colors[name], `dashboard missing core colour --${name}`);
  }
  // ...but a visibly DIFFERENT brand: rounded (not sharp) and softly shadowed (not flat).
  assert.equal(dashboard.scalars.radius, "0.5rem");
  assert.notEqual(dashboard.scalars.radius, maxhealth.scalars.radius);
  assert.ok(dashboard.scalars.shadow.includes("rgb("));
  assert.notEqual(dashboard.scalars.shadow, maxhealth.scalars.shadow);
  // Compiles cleanly to the same delivery format (real light+dark values → light-dark()).
  assert.ok(DASHBOARD_THEME_CSS.includes(":root {"));
  assert.ok(DASHBOARD_THEME_CSS.includes("--primary: light-dark("));
  assert.equal(toCss(dashboard), DASHBOARD_THEME_CSS);
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
