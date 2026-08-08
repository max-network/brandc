// Promotes the CHANGELOG's [Unreleased] section to a concrete version, or fails the release if
// nothing is documented there. Mirrors the release gate used across the org (see prefab).
//
//   node scripts/changelog-release.mjs <version>
//
// Sections are found by index rather than one lookahead regex. The previous
// `/## \[Unreleased\]\s*\n([\s\S]*?)(?=\n## \[|$)/` let `\s*\n` eat the newline the lookahead
// needed, so an EMPTY [Unreleased] captured the next release's section instead — non-empty, so
// the guard never fired, and the reinsert hid it. That shipped 0.6.1 with no notes.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** A `## [...]` heading at the start of a line. */
const HEADING = /^## \[/m;

/**
 * Promote `[Unreleased]` to `[version]`, dated today. Returns the new document.
 * Throws when there is no section or nothing documented in it.
 */
export function promoteChangelog(md, version, date) {
  const start = md.match(/^## \[Unreleased\][^\n]*\n/m);
  if (!start) throw new Error("CHANGELOG.md: no [Unreleased] section found.");

  const bodyAt = start.index + start[0].length;
  const rest = md.slice(bodyAt);
  // Body runs to the next heading; the search is on `rest`, so it can never reach past it.
  const nextAt = rest.search(HEADING);
  const body = nextAt === -1 ? rest : rest.slice(0, nextAt);
  const tail = nextAt === -1 ? "" : rest.slice(nextAt);

  if (!body.trim()) {
    throw new Error("Refusing to release: [Unreleased] is empty — document the changes first.");
  }

  return `${md.slice(0, start.index)}## [Unreleased]\n\n## [${version}] — ${date}\n\n${body.trim()}\n\n${tail}`;
}

// Run as a script (not when imported by a test).
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1].replace(/\\/g, "/")}`).href) {
  const version = process.argv[2];
  if (!version) {
    console.error("usage: node scripts/changelog-release.mjs <version>");
    process.exit(1);
  }
  const path = join(dirname(fileURLToPath(import.meta.url)), "..", "CHANGELOG.md");
  const date = new Date().toISOString().slice(0, 10);
  try {
    writeFileSync(path, promoteChangelog(readFileSync(path, "utf8"), version, date), "utf8");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log(`CHANGELOG.md: [Unreleased] → [${version}] (${date})`);
}
