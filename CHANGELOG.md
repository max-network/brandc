# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Added

- **Opt-in `base.css`** — a separate stylesheet for the Tailwind v4 cursor ergonomic
  (v4 dropped the default `cursor: pointer` on `<button>`). Import with
  `@import "brandc/base.css";`. Low-specificity `:where(...)` rules, no tokens; never
  bundled into `theme.css` / `tailwind.css`.

### Changed

- **Renamed `@max-network/css` → `brandc`** and switched publishing to **public npm**.
  Consumers no longer need a `read:packages` token. Import from `brandc`
  (`import { toCss, type Brand } from "brandc"`, `@import "brandc/theme.css"`).
- CI now publishes to npm on merge to `main` (auto patch-bump + changelog stamp + tag +
  provenance publish).

## [0.1.1] — as `@max-network/css`

- Final releases under the old scoped name (design-token contract: `theme.css`,
  `tailwind.css`, `toCss` / `toTailwindCss` / `toPrefabTheme`, Max Health default brand).
