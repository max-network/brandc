/**
 * Delivery-format coverage: every shipped brand must reach every delivery format INTACT.
 *
 * The existing suite checks the maxhealth stylesheet against the contract and spot-checks the
 * Tailwind preset. That leaves the actual drift risk unguarded: a second shipped brand, or a
 * generator that skips a token group, is caught by nothing. These tests close the loop over
 * `BRANDS × formats` instead of over one brand and one format.
 */
import assert from "node:assert/strict";
import test from "node:test";
import {
  BRANDS,
  CONTRACT,
  CONTRACT_COLORS,
  CONTRACT_SCALARS,
  toCss,
  toTailwindCss,
  toPrefabTheme,
} from "../dist/index.js";

/** The declarations inside the `:root` block of a compiled stylesheet, as `name → value`. */
function rootDeclarations(css) {
  const start = css.indexOf(":root {");
  assert.notEqual(start, -1, "compiled CSS has no :root block");
  const body = css.slice(start, css.indexOf("}", start));
  const seen = [];
  for (const m of body.matchAll(/^\s*--([a-z0-9-]+)\s*:\s*(.+?);\s*$/gim)) seen.push([m[1], m[2]]);
  return seen;
}

test("every shipped brand declares the whole contract in :root", () => {
  for (const brand of BRANDS) {
    const declared = new Set(rootDeclarations(toCss(brand)).map(([name]) => name));
    const missing = CONTRACT.filter((name) => !declared.has(name));
    assert.deepEqual(missing, [], `${brand.name}'s stylesheet is missing contract tokens`);
  }
});

test("no shipped brand declares the same token twice", () => {
  // A name present in BOTH `colors` and `scalars` would emit two `--x:` lines and the later one
  // would silently win. Cheap to do by accident, invisible once compiled.
  for (const brand of BRANDS) {
    const names = rootDeclarations(toCss(brand)).map(([name]) => name);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    assert.deepEqual(dupes, [], `${brand.name} declares a token twice`);
  }
});

test("registration follows the values: fixed tokens typed, scheme-dependent ones left dynamic", () => {
  // A syntax forces the value to resolve at computed-value time, so registering a `light-dark()`
  // token resolves it once against `:root` and kills `color-scheme` anywhere below (csswg#13836).
  // Tokens whose two schemes are equal carry no `light-dark()`, so typing them costs nothing.
  // The split must be DERIVED from the values — a hardcoded list of names would rot on a rebrand.
  for (const brand of BRANDS) {
    const css = toCss(brand);
    for (const [name, { light, dark }] of Object.entries(brand.colors)) {
      const registered = css.includes(`@property --${name} {\n  syntax: "<color>";`);
      assert.equal(
        registered,
        light === dark,
        light === dark
          ? `${brand.name}: fixed token --${name} lost its free typed registration`
          : `${brand.name}: --${name} is scheme-dependent and must NOT be registered`,
      );
    }
  }
  // Guards the assertion itself: if a brand ever had no tokens of one kind, the loop above would
  // pass vacuously for that half.
  const kinds = Object.values(BRANDS[0].colors).map(({ light, dark }) => light === dark);
  assert.ok(kinds.includes(true) && kinds.includes(false), "brand has only one kind of token");
});

test("a registered token never carries a light-dark() value", () => {
  // The invariant behind the split, stated independently of how the split is computed.
  for (const brand of BRANDS) {
    const css = toCss(brand);
    for (const m of css.matchAll(/@property --([a-z0-9-]+) \{/g)) {
      const decl = new RegExp(`^  --${m[1]}: (.+);$`, "m").exec(css);
      assert.ok(decl, `${brand.name}: --${m[1]} is registered but never declared`);
      assert.ok(
        !decl[1].includes("light-dark("),
        `${brand.name}: --${m[1]} is registered AND carries light-dark() — it will resolve at :root`,
      );
    }
  }
});

test("the Tailwind preset maps every contract token for every shipped brand", () => {
  for (const brand of BRANDS) {
    const tw = toTailwindCss(brand);
    for (const name of CONTRACT_COLORS) {
      assert.ok(tw.includes(`--color-${name}: var(--${name});`), `${brand.name}: --color-${name}`);
    }
    for (const name of CONTRACT_SCALARS) {
      assert.ok(tw.includes(`--${name}: var(--${name});`), `${brand.name}: scalar ${name}`);
    }
  }
});

test("the prefab wire carries the whole contract for every shipped brand", () => {
  for (const brand of BRANDS) {
    const theme = toPrefabTheme(brand);
    // `light` compiles to `:root`, so it must cover everything — colours and scalars.
    const missingLight = CONTRACT.filter((name) => theme.light[name] === undefined);
    assert.deepEqual(missingLight, [], `${brand.name}: wire :root is missing contract tokens`);
    // `dark` only overrides scheme-dependent tokens; scalars correctly live in `:root` alone and
    // still apply under the dark selector via the cascade.
    const missingDark = CONTRACT_COLORS.filter((name) => theme.dark[name] === undefined);
    assert.deepEqual(missingDark, [], `${brand.name}: wire dark block is missing colours`);
    assert.deepEqual(
      CONTRACT_SCALARS.filter((name) => theme.dark[name] !== undefined),
      [],
      `${brand.name}: scheme-independent scalars must not be duplicated into the dark block`,
    );
  }
});

test("scheme-dependent tokens degrade to their light value without light-dark() support", () => {
  // Unregistering these tokens (see above) also dropped the `@property` `initial-value`, which was
  // the fallback a browser used when it could not parse `light-dark()`. Without a replacement,
  // such a browser substitutes an unparseable value and the declaration reading it falls back to
  // its INITIAL value — transparent backgrounds, invisible buttons — rather than to the light
  // theme. A feature query restores that: plain light values in `:root`, upgraded in `@supports`.
  // Same shape Tailwind v4 uses to back-fill `@property` on engines that lack it.
  for (const brand of BRANDS) {
    const css = toCss(brand);
    const query = css.indexOf("@supports (color: light-dark(");
    assert.notEqual(query, -1, `${brand.name}: no light-dark() feature query`);
    const base = css.slice(0, query);
    const upgrade = css.slice(query);
    for (const [name, { light, dark }] of Object.entries(brand.colors)) {
      if (light === dark) {
        assert.ok(!upgrade.includes(`--${name}:`), `${brand.name}: fixed --${name} needs no upgrade`);
        continue;
      }
      assert.ok(
        base.includes(`  --${name}: ${light};`),
        `${brand.name}: --${name} has no plain light fallback before the feature query`,
      );
      assert.ok(
        upgrade.includes(`  --${name}: light-dark(${light}, ${dark});`),
        `${brand.name}: --${name} is not upgraded inside the feature query`,
      );
    }
  }
});

test("a brand's scheme-dependent tokens survive as light-dark(), never collapsed", () => {
  // The collapse in `toCss` (`light === dark` → one value) is an optimisation for fixed palettes.
  // If it ever fired on a token whose two schemes differ, dark mode would silently lose it.
  for (const brand of BRANDS) {
    const css = toCss(brand);
    for (const [name, { light, dark }] of Object.entries(brand.colors)) {
      if (light === dark) continue;
      assert.ok(
        css.includes(`--${name}: light-dark(${light}, ${dark});`),
        `${brand.name}: --${name} lost its dark value`,
      );
    }
  }
});
