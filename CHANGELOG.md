# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added

- **Dual license.** Source code (compiler + token contract + scripts) is **MIT**; the bundled
  `maxhealth` example brand is **CC BY 4.0** — ship that brand and you must credit Max Health Inc.
  and link https://maxhealth.tech. Adds `LICENSE` + `NOTICE`. (Previously `UNLICENSED`, which is
  wrong for a public package.)

### Changed

- Genericized the README for public npm: dropped the internal Max-Network-kit framing; `maxhealth`
  is described as the bundled *example* brand.

### Fixed

- `release.yml` startup failure — the job `if:` was an unquoted YAML scalar containing a
  colon-space (`'chore: release v'`), which failed validation ("mapping values are not allowed
  here"). Quoted it; auto-publish-on-merge works again (OIDC trusted publishing, no token).

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
