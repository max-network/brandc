# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Changed

- **`maxhealth` gets a real radius ladder above `lg`: 0.75 / 1 / 1.5 / 2rem.** 0.7.0 set the
  new `radius-xl` … `radius-4xl` steps to `0rem` on the reasoning that a flat brand is flat
  all the way down. It turned out those steps had never rendered flat: they fell through to
  Tailwind's own defaults, which are the values restored here, so every component built on
  this brand had been designed against them for as long as the brand has existed.

  Setting them to `0rem` squared 24 corners on maxhealth.tech (product cards, the countdown
  page) and every chat bubble in AIHR, and both read as broken rather than as flat. The brand
  is flat at the sizes that trim a CONTROL — button, input, badge, table cell, everything
  through `lg`, all still `0rem` — and soft at the sizes that shape a SURFACE, where the step
  is drawing a card or a bubble rather than an edge.

  `dashboard` is unchanged. No consumer needs an edit: the values are what they already
  rendered before 0.7.0.

## [0.7.0] — 2026-08-30

### Added

- **The radius ladder is complete: `radius-xl`, `radius-2xl`, `radius-3xl`, `radius-4xl`.**
  The contract stopped at `radius-lg`, and a step a brand does not define falls through to
  Tailwind's own default — so `maxhealth`, which is flat by design, still rendered
  `rounded-xl` at 0.75rem and `rounded-3xl` at 1.5rem. Every consumer re-zeroed the tail by
  hand in its own `@theme inline` block (proxy-smart-admin-ui, patient-portal, consent-app),
  which is exactly the drift a shared contract exists to prevent. `maxhealth` sets all four
  to `0rem`; `dashboard` continues its ladder at 1 / 1.5 / 2 / 2.5rem.

  Contract size is now 82 tokens (52 colours + 30 scalars).

- **The rhythm half of the contract: a type scale and a spacing scale** ([#18]). Documented here
  rather than under 0.6.1 because that release went out with no notes; the code itself shipped in
  0.6.1, as a patch, which is the mislabelling the release-gate and workflow fixes below address.

  The contract carried shape, elevation and typeface but nothing for size or density, so every
  consumer invented its own and pages stopped sharing a rhythm. Adds 16 scalars — `--text-xs` …
  `--text-2xl`, `--space-1` … `--space-8`, and `--measure` — taking the contract from 62 to 78 names.

  Values are plain `rem` on purpose: `toPrefabTheme` and the React Native path read scalars as
  values, so a `clamp()` with viewport units would be unreadable there. A kit that wants fluid
  headings clamps these itself. Both shipped brands start from one shared `RHYTHM` and override
  any step to change density, exactly as they override `--radius` to change shape.

  Additive for consumers: only a brand typed `satisfies ContractBrand` must supply the new names.

### Fixed

- **The release gate no longer fails open** ([#19]). `changelog-release.mjs` refused to release an
  undocumented change in principle only. Its regex let `\s*\n` consume the newline the lookahead
  needed, so an EMPTY `[Unreleased]` captured the *next* release's section instead — non-empty, so
  the guard passed, and reinserting it hid the damage. That is how 0.6.1 shipped with no notes at
  all. Sections are now found by index, and the behaviour is pinned by `test/changelog.test.mjs`.

### Changed

- **`develop` is the integration branch; releasing is bumping the version in your PR** ([#19]).
  `main` used to be the working branch, so every PR targeted it and merging published on the spot.
  A push to `develop` now keeps a standing promote PR open (`auto-pr.yml`, the same file
  `worker-utils` and `mcp-http` use). `release.yml` no longer auto-increments the patch — that is
  why 0.6.1 went out as a patch when it added 16 contract names. `package.json` is the release, and
  a merge whose version is already published is a green no-op.
- `ci.yml` → `check.yml`, named for the script it runs.

[#18]: https://github.com/max-network/brandc/issues/18
[#19]: https://github.com/max-network/brandc/issues/19

## [0.6.1] — 2026-08-08

Released by a workflow that stamped the version without notes; see the release-gate fix above.
The contract additions listed under Unreleased are the content that actually shipped here.

## [0.6.0] — 2026-07-31

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
  `<color>`, and no longer interpolate in a `transition`. No consumer transitions a custom property
  (checked across every app's source), and the typing is a smaller loss than it looks — it made a
  mistyped override *silently* do nothing, where now it visibly breaks the declaration that reads
  it. Delivery formats, token names and values are unchanged, and `color-mix()` opacity modifiers
  (`bg-primary/90`) keep working, now resolving against the subtree's scheme.

- **Scheme-dependent tokens degrade to their light value on browsers without `light-dark()`.**
  Unregistering them also dropped the `@property` `initial-value`, which had been the fallback for
  those browsers. Nothing in the *code* depended on it, but it was a passive safety net for end
  users: without a replacement they would substitute an unparseable value and get each declaration's
  initial — transparent backgrounds, invisible buttons — rather than the light theme.

  `:root` now carries plain light values and a `@supports (color: light-dark(red, blue))` query
  upgrades the scheme-dependent ones, the same shape Tailwind v4 uses to back-fill `@property`.
  Costs 1.3 KB uncompressed (5.9 → 7.2 KB) of near-identical text that gzips away. Verified both
  paths in Chrome 141: with the query unsatisfiable, the page renders the full light theme.

  The cohort this protects is real — iOS 16.4–16.7 supports `@property`, `oklch()` and
  `color-mix()` but not `light-dark()`, and devices that cannot update past iOS 16 are still in
  use.

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
  exports the mapping for codemods. Consumers to migrate: a shared UI kit that reads the pair in a
  component, three apps that style with it directly, and several more that only re-map it into
  Tailwind's namespace via `--color-maxhealth`.

[#13]: https://github.com/max-network/brandc/issues/13

## [0.4.0] — 2026-07-28

### Changed

- **The data-viz ramp is now CATEGORICAL, and has seven slots instead of five.**
  `maxhealth`'s `--chart-1…5` were a monochrome blue ramp (hues 251–265). A sequential
  ramp mislabels unordered series — status, category, cohort — and a blue-to-blue chart
  cannot be read without a legend. The seven slots are now distinct hues
  (emerald, amber, red, violet, cyan, pink, lime), and `dashboard` gains `--chart-6/7`
  in its own hues so both brands still cover the same contract.

  The values are the exact oklch of the palette a downstream UI kit shipped hardcoded
  (Tailwind's 500 steps), carried to five decimals so consumers migrating off those hex
  literals are byte-identical rather than merely close.

  **Migration:** anything relying on `--chart-*` being a blue sequence should define its
  own sequential scale. A sweep of the downstream consumers found no such case — the apps
  that reference these tokens only re-map them into Tailwind's namespace and never render
  with them.

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
