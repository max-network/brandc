# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [SemVer](https://semver.org/).

## [Unreleased]

## [0.2.2] — 2026-07-23

### Added

- **Dual license.** Source code (compiler + token contract + scripts) is **MIT**; the bundled
  `maxhealth` example brand is **CC BY 4.0** — ship that brand and you must credit Max Health Inc.
  and link https://maxhealth.tech. Adds `LICENSE` + `NOTICE`. (Previously `UNLICENSED`, which is
  wrong for a public package.)
- Publishing with **provenance** (the repo is now public), via OIDC trusted publishing on npm.

### Changed

- Genericized the README for public npm: dropped the internal Max-Network-kit framing; `maxhealth`
  is described as the bundled *example* brand.

### Fixed

- `release.yml` startup failures: the job `if:` was an unquoted YAML scalar with a colon-space,
  then the third-party `softprops/action-gh-release` action was blocked by the repo's
  `allowed_actions: selected` policy. Quoted the `if:`, switched the release step to the built-in
  `gh` CLI (only allowlisted `actions/*` remain), and dropped the unicode/box-drawing decoration.
  Auto-publish-on-merge now validates and runs.

<!-- Note: 0.2.1 was tagged but never reached npm (provenance requires a public repo, which was
     only flipped afterwards); superseded by 0.2.2. -->

## [0.2.0]

### Added

- **Opt-in `base.css`** — a separate stylesheet for the Tailwind v4 cursor ergonomic
  (v4 dropped the default `cursor: pointer` on `<button>`). Import with
  `@import "brandc/base.css";`. Low-specificity `:where(...)` rules, no tokens; never
  bundled into `theme.css` / `tailwind.css`.

### Changed

- **Renamed `@max-network/css` → `brandc`** and switched publishing to **public npm**.
  Consumers no longer need a `read:packages` token. Import from `brandc`
  (`import { toCss, type Brand } from "brandc"`, `@import "brandc/theme.css"`).

## [0.1.1] — as `@max-network/css`

- Final releases under the old scoped name (design-token contract: `theme.css`,
  `tailwind.css`, `toCss` / `toTailwindCss` / `toPrefabTheme`, Max Health default brand).
