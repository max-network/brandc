/**
 * The release gate that did not gate. An empty [Unreleased] silently captured the NEXT release's
 * section, so the "refuse to release undocumented changes" check passed and 0.6.1 shipped with
 * no notes. A guard that fails open is worse than no guard, so its behaviour is pinned here.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { promoteChangelog } from "../scripts/changelog-release.mjs";

const HEAD = `# Changelog\n\nFormat: Keep a Changelog.\n\n`;
const PRIOR = `## [0.6.0] — 2026-07-31\n\n### Fixed\n\n- Something real.\n`;

test("refuses to release when [Unreleased] is empty", () => {
  const md = `${HEAD}## [Unreleased]\n\n${PRIOR}`;
  assert.throws(() => promoteChangelog(md, "0.6.1", "2026-08-08"), /\[Unreleased\] is empty/);
});

test("an empty [Unreleased] never swallows the previous release's section", () => {
  // The exact defect: the old regex captured "## [0.6.0] …" as the Unreleased body.
  const md = `${HEAD}## [Unreleased]\n\n${PRIOR}`;
  assert.throws(() => promoteChangelog(md, "0.6.1", "2026-08-08"));
  // And the prior section is still intact in the source it refused to touch.
  assert.match(md, /## \[0\.6\.0\] — 2026-07-31/);
});

test("promotes documented changes and keeps the history below", () => {
  const md = `${HEAD}## [Unreleased]\n\n### Added\n\n- A thing.\n\n${PRIOR}`;
  const out = promoteChangelog(md, "0.7.0", "2026-08-08");
  assert.match(out, /## \[Unreleased\]\n\n## \[0\.7\.0\] — 2026-08-08\n\n### Added\n\n- A thing\./);
  assert.match(out, /## \[0\.6\.0\] — 2026-07-31/, "previous release survived");
  assert.equal(out.match(/## \[0\.7\.0\]/g).length, 1, "version stamped exactly once");
});

test("leaves an empty [Unreleased] heading behind for the next cycle", () => {
  const out = promoteChangelog(`${HEAD}## [Unreleased]\n\n- Fixed a thing.\n\n${PRIOR}`, "0.7.0", "2026-08-08");
  assert.match(out, /## \[Unreleased\]\n\n## \[0\.7\.0\]/);
});

test("works when [Unreleased] is the only section", () => {
  const out = promoteChangelog(`${HEAD}## [Unreleased]\n\n- First release.\n`, "0.1.0", "2026-08-08");
  assert.match(out, /## \[0\.1\.0\] — 2026-08-08\n\n- First release\./);
});

test("fails loudly when there is no [Unreleased] section at all", () => {
  assert.throws(() => promoteChangelog(`${HEAD}${PRIOR}`, "0.7.0", "2026-08-08"), /no \[Unreleased\] section/);
});
