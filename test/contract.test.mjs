/**
 * The contract itself — the guard whose absence let issue #13 through.
 *
 * `CONTRACT` used to be derived from the `maxhealth` brand (`Object.keys(maxhealth.colors)`), so
 * the shared vocabulary was whatever that one brand happened to declare, and the `dashboard` brand
 * this package ships could not satisfy it. These tests pin the contract as something DECLARED,
 * assert every shipped brand covers it, and keep brand-private extras (the deprecated
 * `--maxhealth` pair, still read by shared-ui / legal-web / connect / trust) compiling.
 */
import assert from "node:assert/strict";
import test from "node:test";
import {
  CONTRACT,
  CONTRACT_COLORS,
  CONTRACT_SCALARS,
  DEPRECATED_TOKENS,
  brandExtras,
  maxhealth,
  dashboard,
  THEME_CSS,
  DASHBOARD_THEME_CSS,
} from "../dist/index.js";

/** Every brand this package ships as first-class — each must cover the whole contract. */
const SHIPPED = [maxhealth, dashboard];

test("the contract is a pinned, declared list — changing it is a deliberate act", () => {
  // A published vocabulary must not drift as a side effect of editing a brand. Re-deriving it
  // from `maxhealth` (the old defect) puts that brand's two private tokens back and trips this.
  assert.equal(CONTRACT_COLORS.length, 52, "contract colour count changed — intentional?");
  assert.equal(CONTRACT_SCALARS.length, 10, "contract scalar count changed — intentional?");
  assert.equal(CONTRACT.length, 62);
});

test("no contract token is named after a brand", () => {
  for (const { name } of SHIPPED) {
    const branded = CONTRACT.filter((t) => t === name || t.startsWith(`${name}-`));
    assert.deepEqual(branded, [], `contract carries ${name}-specific token names`);
  }
});

test("CONTRACT is exactly its colour + scalar halves, with no duplicates", () => {
  assert.deepEqual([...CONTRACT], [...CONTRACT_COLORS, ...CONTRACT_SCALARS]);
  assert.equal(new Set(CONTRACT).size, CONTRACT.length, "duplicate token name in the contract");
  assert.equal(
    new Set([...CONTRACT_COLORS, ...CONTRACT_SCALARS]).size,
    CONTRACT_COLORS.length + CONTRACT_SCALARS.length,
    "a name appears as both a colour and a scalar",
  );
});

test("every shipped brand covers the whole contract", () => {
  for (const brand of SHIPPED) {
    const missingColors = CONTRACT_COLORS.filter((n) => brand.colors[n] === undefined);
    const missingScalars = CONTRACT_SCALARS.filter((n) => brand.scalars[n] === undefined);
    assert.deepEqual(missingColors, [], `${brand.name} is missing contract colours`);
    assert.deepEqual(missingScalars, [], `${brand.name} is missing contract scalars`);
  }
});

test("the brand-agnostic accent pair is part of the contract", () => {
  // `main`/`main-foreground` is what replaces the brand-named `maxhealth` pair: every brand can
  // supply an accent and a legible colour to sit on it without inheriting another brand's name.
  assert.ok(CONTRACT.includes("main"), "contract has no brand-agnostic accent");
  assert.ok(CONTRACT.includes("main-foreground"), "contract has no accent foreground");
  for (const brand of SHIPPED) {
    assert.ok(brand.colors["main-foreground"], `${brand.name} defines no main-foreground`);
  }
});

test("each deprecated token names a contract replacement that exists", () => {
  const entries = Object.entries(DEPRECATED_TOKENS);
  assert.ok(entries.length > 0, "nothing deprecated — the maxhealth pair should be");
  for (const [old, replacement] of entries) {
    assert.ok(!CONTRACT.includes(old), `deprecated ${old} is still in the contract`);
    assert.ok(CONTRACT.includes(replacement), `replacement ${replacement} is not a contract token`);
  }
});

test("migrating off a deprecated token is a rename, not a restyle", () => {
  // The promise that makes the deprecation safe to act on: in whichever brand still carries the
  // old name, the replacement holds byte-identical values. `text-maxhealth` → `text-main` must
  // not silently change a colour — including the dark-scheme value, which is why the accent pair
  // is scheme-dependent rather than a step of the fixed `main-50..900` palette.
  for (const brand of SHIPPED) {
    for (const [old, replacement] of Object.entries(DEPRECATED_TOKENS)) {
      const legacy = brand.colors[old];
      if (legacy === undefined) continue; // brand never carried it
      assert.deepEqual(
        legacy,
        brand.colors[replacement],
        `${brand.name}: --${old} and its replacement --${replacement} differ in value`,
      );
    }
  }
});

test("a brand may carry private extras, reported by brandExtras()", () => {
  assert.deepEqual(brandExtras(maxhealth), ["maxhealth", "maxhealth-foreground"]);
  assert.deepEqual(brandExtras(dashboard), [], "dashboard should be contract-only");
});

test("deprecated extras still compile, so existing consumers keep working", () => {
  // shared-ui's app-header (`text-maxhealth`), legal-web, connect and trust read these today.
  // Dropping them from the contract must not drop them from the brand's stylesheet.
  assert.ok(THEME_CSS.includes("--maxhealth:"), "maxhealth brand stopped emitting --maxhealth");
  assert.ok(THEME_CSS.includes("--maxhealth-foreground:"));
  // `--maxhealth` is scheme-dependent, so like every such token it is deliberately not
  // @property-registered; `--maxhealth-foreground` is fixed in both schemes, so it is.
  assert.doesNotMatch(THEME_CSS, /@property --maxhealth \{/);
  assert.match(THEME_CSS, /@property --maxhealth-foreground \{/);
  // ...and are not silently inherited by a brand that never asked for them.
  assert.ok(!DASHBOARD_THEME_CSS.includes("--maxhealth:"));
});
