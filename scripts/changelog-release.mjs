// Promotes the CHANGELOG's [Unreleased] section to a concrete version, or fails the release if
// nothing is documented there. Mirrors the release gate used across the org (see prefab).
//
//   node scripts/changelog-release.mjs <version>
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const version = process.argv[2];
if (!version) {
  console.error("usage: node scripts/changelog-release.mjs <version>");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "CHANGELOG.md");
const md = readFileSync(path, "utf8");

// Capture the [Unreleased] body up to the next "## [" heading (or end of file).
const unreleased = /## \[Unreleased\]\s*\n([\s\S]*?)(?=\n## \[|$)/;
const match = md.match(unreleased);
if (!match) {
  console.error("CHANGELOG.md: no [Unreleased] section found.");
  process.exit(1);
}
if (!match[1].trim()) {
  console.error("Refusing to release: [Unreleased] is empty — document the changes first.");
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const promoted =
  `## [Unreleased]\n\n## [${version}] — ${date}\n\n${match[1].trim()}\n`;
writeFileSync(path, md.replace(unreleased, promoted), "utf8");
console.log(`CHANGELOG.md: [Unreleased] → [${version}] (${date})`);
