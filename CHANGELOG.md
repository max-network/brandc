# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Fixed

- **Scheme overrides now work at any depth, so a page can render two schemes at once** ([#14]).
  `.dark` / `[data-theme="dark"]` — and a bare `color-scheme: dark` — used to be inert anywhere
  but the root element: every token stayed at the value `:root` had already resolved. The failure
  was silent and half-visible, since native controls and scrollbars in the subtree *did* flip,
  leaving a light panel holding a dark input.

  The cause was `@property` registration. Giving a custom property a syntax forces its value to
  resolve at computed-value time, so a `light-dark()` token declared on `:root` decides the scheme
  there for the whole document ([w3c/csswg-drafts#13836], where the spec editors describe this hole
  and note that staying unregistered is what keeps the value dynamic; open, no resolution).

  Registration is now applied only where it is free — to tokens whose light and dark values are
  equal, which carry no `light-dark()` to resolve late. For `maxhealth` that is 21 of 54 colours
  (the `--main-*` and `--chart-*` palettes plus the non-flipping foregrounds); `dashboard` keeps 25
  of 52. The split is derived from the values rather than a list of names, so a rebrand that makes
  a fixed token scheme-dependent drops out of registration on its own.

  **What this costs**, on the scheme-dependent half only: those tokens are no longer typed as
  `<color>` (an invalid override now breaks the declaration that reads it, instead of being
  ignored), no longer interpolate in a `transition`, and no longer carry an `initial-value` to fall
  back to in a browser without `light-dark()` — Baseline since May 2024. Nothing in the org relies
  on any of the three. Delivery formats, token names and values are otherwise unchanged.

[#14]: https://github.com/max-network/brandc/issues/14
[w3c/csswg-drafts#13836]: https://github.com/w3c/csswg-drafts/issues/13836

## [0.5.0] — 2026-07-31

### Changed

- **The contract is now DECLARED, not derived from a brand** ([#13]). `CONTRACT` and `TokenName`
  were `Object.keys(maxhealth.colors)`, so the "shared" vocabulary was really one brand's private
  key set — and `dashboard`, a brand this package ships itself, could not satisfy it (61 of 63
  names). Both now come from an explicit list in the new `src/contract.ts`, which owns the token
  names and no values.

  New exports: `CONTRACT_COLORS` / `CONTRACT_SCALARS` (the two halves), `ColorTokenName` /
  `ScalarTokenName`, `DEPRECATED_TOKENS`, `brandExtras(brand)`, and `BRANDS`.

- **`Brand` splits into `Brand` and `ContractBrand`.** `Brand` stays permissive — the documented
  Tailwind pattern `{ colors: {…}, scalars: {} }` still typechecks, and every generator emits
  exactly the keys it is given. `ContractBrand` is a brand that covers the WHOLE contract, so a
  shipped brand missing a token is now a compile error rather than a runtime surprise. Both shipped
  brands are `satisfies ContractBrand`, and `test/contract.test.mjs` re-checks coverage at runtime.

- **`--main` / `--main-foreground` are a scheme-dependent intent pair.** `--main` was a fixed
  alias of the solid `600` step; it now behaves like `--primary`, lifting in dark mode
  (`maxhealth` 0.75 → 0.78). `--main-50…900` stays the scheme-independent palette. `--main-foreground`
  is new: the contract had no brand-agnostic "legible on the accent" colour. A DRY.codes sweep found
  no consumer of any `--main*` token, so no consumer is affected.

### Deprecated

- **`--maxhealth` / `--maxhealth-foreground` left the contract**, because a vocabulary every brand
  must implement cannot carry one brand's name. They remain brand-private extras of the `maxhealth`
  brand and are still emitted in `theme.css` / `tailwind.css`, so nothing breaks today.

  **Migration:** rename to `--main` / `--main-foreground` (`text-maxhealth` → `text-main`,
  `bg-maxhealth/10` → `bg-main/10`). The replacements hold byte-identical values in the `maxhealth`
  brand — asserted by a test — so this is a rename with no visual change. `DEPRECATED_TOKENS`
  exports the mapping for codemods. Known consumers to migrate: `shared-ui`'s `app-header`,
  `legal-web`, `connect`, `trust`, and the `--color-maxhealth` re-mappings in consent-app, dtr-app,
  patient-portal and dicom-viewer.

[#13]: https://github.com/max-network/brandc/issues/13

## [0.4.0] — 2026-07-28

### Changed

- **The data-viz ramp is now CATEGORICAL, and has seven slots instead of five.**
  `maxhealth`'s `--chart-1…5` were a monochrome blue ramp (hues 251–265). A sequential
  ramp mislabels unordered series — status, category, cohort — and a blue-to-blue chart
  cannot be read without a legend. The seven slots are now distinct hues
  (emerald, amber, red, violet, cyan, pink, lime), and `dashboard` gains `--chart-6/7`
  in its own hues so both brands still cover the same contract.

  The values are the exact oklch of the palette `@max-health-inc/shared-ui` shipped
  hardcoded (Tailwind's 500 steps), carried to five decimals so consumers migrating off
  those hex literals are byte-identical rather than merely close.

  **Migration:** anything relying on `--chart-*` being a blue sequence should define its
  own sequential scale. A DRY.codes sweep found no such consumer — the apps that
  reference these tokens (consent-app, dtr-app, patient-portal, dicom-viewer, legal-web)
  only re-map them into Tailwind's namespace and never render with them.

## [0.3.1] — 2026-07-25

### Added

- **`main` brand-accent ramp** — a full `50→900` accent scale added to the contract, so apps get a
  themeable accent palette (`bg-main-*`, `text-main-*`, `border-main-*`, `from/to-main-*`) instead of
  only single-shade intents. Scheme-independent (the palette is fixed; pick the step per context);
  `main` aliases the solid `600` step. Shipped in both brands in their own hue — `maxhealth` green
  (162), `dashboard` blue (262). Rebrand by overriding the `--main-*` `:root` vars.

## [0.3.0] — 2026-07-24

### Added

- **Second shipped brand: `dashboard`** — a rounded, soft-shadowed, blue-primary, dark-sidebar
  identity (MIT), alongside the flat/sharp/green `maxhealth` brand, proving the contract is genuinely
  multi-brand. New exports: `dashboard`, `DASHBOARD_THEME_CSS`, `DASHBOARD_TAILWIND_CSS`.
- **Docs.** README now documents the Tailwind v4 `scalars: {}` gotcha (do not override Tailwind's
  `rounded-*` / `shadow-*` / font keys when branding a Tailwind app), how to start from a shipped
  brand, and real consumer examples (gaestehaus, secretspots, hono-ui).

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
