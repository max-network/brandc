/**
 * Docs-vs-code drift guard.
 *
 * Issue #13 was not found by a broken build — it was found by the README claiming one thing
 * ("the contract is the *names*, stable across kits") while the code did another (deriving those
 * names from one brand). That class of defect ships silently. The README is the contract's public
 * description, so the numbers and names it states are asserted here like any other output.
 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
import { CONTRACT, DEPRECATED_TOKENS, brandExtras, maxhealth, dashboard } from "../dist/index.js";

const README = readFileSync(new URL("../README.md", import.meta.url), "utf8");

test("the token count the README states is the real contract size", () => {
  const stated = /\b(\d+)\s+names\b/.exec(README);
  assert.ok(stated, "README no longer states the contract size — say how many names it declares");
  assert.equal(
    Number(stated[1]),
    CONTRACT.length,
    "README's token count is stale — the contract changed without the docs",
  );
});

test("every token the README documents as deprecated really is", () => {
  for (const [old, replacement] of Object.entries(DEPRECATED_TOKENS)) {
    assert.ok(README.includes(`--${old}`), `README does not document deprecated --${old}`);
    assert.ok(README.includes(`--${replacement}`) || README.includes(`-${replacement}`),
      `README does not point --${old} at its replacement --${replacement}`);
  }
});

test("the README's two shipped brands are the ones the package exports", () => {
  for (const brand of [maxhealth, dashboard]) {
    assert.ok(README.includes(`\`${brand.name}\``), `README does not document the ${brand.name} brand`);
  }
});

test("every brand-private extra is documented, because kits must know not to read it", () => {
  // An undocumented extra is how `--maxhealth` became load-bearing in a downstream kit in the
  // first place: it looked like contract vocabulary because nothing said otherwise.
  for (const brand of [maxhealth, dashboard]) {
    for (const extra of brandExtras(brand)) {
      assert.ok(
        README.includes(`--${extra}`),
        `${brand.name}'s private extra --${extra} is undocumented`,
      );
    }
  }
});
