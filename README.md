# brandc

**Author a brand once, compile it everywhere.** `brandc` is a tiny brand compiler: describe a
`Brand` as structured data (design tokens) and generate a CSS custom-property contract, a Tailwind
v4 preset, and a prefab-wire theme from it. One variable vocabulary across any stack — SSR string
injection, bundler/CDN, plain HTML, React — so a brand is authored **once** and works everywhere.
Ships an example brand you can use as-is or override.

## Two axes

- **The contract** — the *names* of the variables (`--primary`, `--card`, `--radius`, `--success`,
  `--font-sans`, …). Stable across kits and stacks. Declared — not derived from any brand — in
  [`src/contract.ts`](src/contract.ts): 62 names, as `CONTRACT` / `CONTRACT_COLORS` /
  `CONTRACT_SCALARS` and the `TokenName` union. No token is named after a brand, so any brand can
  satisfy it.
- **A brand** — the *values*. This package ships two brands on that one contract, deliberately
  different so it is clear the vocabulary is brand-agnostic:
  - `maxhealth` — flat + sharp (`--radius: 0`, no shadows), neutral intents + green accent (CC BY 4.0).
  - `dashboard` — rounded + soft-shadowed, blue primary, slate neutrals, dark app sidebar (MIT).

  Rebrand = a new `Brand` with the same names, different values.

Two types express the axes. **`Brand`** is permissive: pass only the tokens you want to emit (the
Tailwind `scalars: {}` pattern below relies on this). **`ContractBrand`** is a brand that covers the
*whole* contract — what a first-class brand must be, and a compile error if a name is missing:

```ts
export const ocean = { name: "ocean", colors: { /* every contract colour */ }, scalars: { /* … */ } }
  satisfies ContractBrand;   // ← missing `--ring`? tsc tells you, at authoring time
```

A brand may also declare **private extras** beyond the contract. They compile into that brand's
CSS like any other token; `brandExtras(brand)` lists them. A *kit* must never read one — that is
what the contract is for.

### Deprecated tokens

`--maxhealth` / `--maxhealth-foreground` were once in the contract and are now brand-private
extras of the `maxhealth` brand: a vocabulary every brand has to implement cannot carry one
brand's name. They are still emitted, so nothing breaks — but migrate to the brand-agnostic
accent pair, which holds byte-identical values (a test asserts it), making this a pure rename:

```
text-maxhealth  →  text-main            bg-maxhealth/10  →  bg-main/10
--maxhealth-foreground  →  --main-foreground
```

`DEPRECATED_TOKENS` exports the mapping so a codemod can read it instead of hardcoding it.

## Authored once, generated many

The single source of truth is structured data in [`src/tokens.ts`](src/tokens.ts) (each colour as a
`{ light, dark }` pair). Every delivery format is **generated** from it by
[`src/compile.ts`](src/compile.ts), so they cannot drift:

| Output | For | Import |
| --- | --- | --- |
| `THEME_CSS` (string) | SSR string-injection | `import { THEME_CSS } from "brandc"` |
| `theme.css` (file) | bundler / CDN / plain HTML | `import "brandc/theme.css"` |
| `tailwind.css` (file) / `TAILWIND_CSS` | Tailwind v4 `@theme inline` preset | `import "brandc/tailwind.css"` |
| `toPrefabTheme(brand)` | prefab wire `theme` JSON | `import { toPrefabTheme } from "brandc"` |
| `base.css` (file) / `BASE_CSS` | **opt-in** element ergonomics (see below) | `import "brandc/base.css"` |

## Opt-in base ergonomics (`base.css`)

The contract is pure token vocabulary. `base.css` is a **separate, optional** stylesheet for one
cross-cutting framework quirk every Tailwind v4 consumer hits: Tailwind v4 dropped the default
`cursor: pointer` on `<button>` (it follows the native `default` now). Import it if you want it:

```css
@import "brandc/base.css";  /* restores pointer cursor on buttons, links, [role=button], … */
```

Plain low-specificity CSS (`:where(...)`) on element selectors — no tokens, easily overridden.
SSR/string consumers that set cursors inline, and non-CSS consumers (React Native), just don't
import it. It is never bundled into `theme.css` / `tailwind.css`.

## Modern CSS, on purpose

- **`light-dark()`** — each colour is one declaration (`--bg: light-dark(<light>, <dark>)`), not a
  duplicated dark block. `:root { color-scheme: light dark }` honours `prefers-color-scheme`
  automatically; `.dark` / `[data-theme="dark"]` (and `.light` / `[data-theme="light"]`) flip
  `color-scheme` for a manual override. Both class and `data-theme` conventions are supported.

  The override works at **any depth**, so a page can show two schemes at once — a dark panel in a
  light page, a preview pane rendering the opposite theme, an inverted hero band:

  ```css
  .panel-dark { color-scheme: dark; }   /* every token inside resolves dark */
  ```

  The classes are a convenience over that, not a replacement: a bare `color-scheme` works just as
  well, which keeps the mechanism generic rather than tied to two naming conventions.
- **`@property`** — colour tokens are registered as `<color>` (type-safety + animatable) wherever
  that is free, which is every token whose two schemes are equal: the `--main-*` and `--chart-*`
  palettes and the foregrounds that don't flip. Scheme-dependent tokens are deliberately left
  unregistered, because a *syntax* forces `light-dark()` to resolve at computed-value time — once,
  on `:root` — which would make the subtree theming above impossible. See
  [w3c/csswg-drafts#13836](https://github.com/w3c/csswg-drafts/issues/13836), where the spec
  editors describe exactly this and note that staying unregistered is what keeps the value dynamic.
  The split is derived from the values, so a rebrand never has to think about it.
- **oklch** everywhere; derived surfaces via `color-mix()` in the consuming component CSS (no `-bg`
  token sprawl).

## Tailwind v4 (two-stage, runtime-switchable)

Raw values live in `:root`/dark (`theme.css`); `tailwind.css` is a **non-inline-value** `@theme inline`
layer that maps them to Tailwind's namespaces **by reference** — so utilities like `bg-primary` exist
*and* runtime dark switching still works (mapping with `var()`, never baking values at build time):

```css
@import "tailwindcss";
@import "brandc/theme.css";
@import "brandc/tailwind.css";
```

## Rebrand (override, once)

```ts
import { toCss, type Brand } from "brandc";
import { maxhealth } from "brandc";

const ocean: Brand = {
  name: "ocean",
  colors: { ...maxhealth.colors, primary: { light: "oklch(0.58 0.06 195)", dark: "oklch(0.7 0.06 195)" } },
  scalars: { ...maxhealth.scalars, radius: "0.625rem", "radius-lg": "0.875rem", shadow: "0 1px 2px rgb(23 32 31 / 0.05)" },
};
const css = toCss(ocean); // teal, rounded, soft-shadow — same contract, works on every stack
```

Or start from a shipped brand: `import { dashboard, DASHBOARD_THEME_CSS } from "brandc"` for a
rounded, blue, dark-sidebar dashboard look, then override a few tokens.

## Tailwind v4: brand your own app (the `scalars` gotcha)

When a Tailwind v4 app defines its **own** brand and only wants to rebrand *colours* (keeping
Tailwind's own `rounded-*` / `shadow-*` / font scale), pass **`scalars: {}`**. The contract's
`--radius*` / `--shadow*` / `--font-*` names are the same keys Tailwind v4 uses in `@theme`, so
emitting them would override Tailwind's (e.g. Max Health's `--radius: 0` flattens every `rounded-*`).
Empty scalars keeps it colours-only:

```ts
const brand: Brand = { name: "secretspots", colors: { /* … */ }, scalars: {} };
// inject toCss(brand) + toTailwindCss(brand); bg-primary/text-foreground map to the brand,
// rounded-lg/shadow-md stay Tailwind's own.
```

Also add a `.light` class alongside your app's `.dark` toggle so `color-scheme` / `light-dark()`
resolve (otherwise OS dark can leak into light mode).

## Consumers in the wild

- **gaestehaus-schaub.at** — an SSR shell **and** a precompiled-Tailwind public site from one brand.
  `src/lib/brand.ts` defines the brand (teal); `toCss(brand)` is injected in each `<head>`, and
  `app.css` maps Tailwind utilities to it by reference (`--color-brand: var(--brand)`) — no build step,
  no hardcoded palette.
- **secretspots.guide** — its own brand on Tailwind v4 with `scalars: {}` (the pattern above).
- **hono-ui** — the admin theme is compiled from a `Brand` via `toCss`, so the kit's palette can never
  drift from the contract.

## Development

```sh
npm install
npm run check   # tsc --noEmit && build && node --test   (TypeScript 7)
npm run build   # tsc → dist/, then regenerate theme.css + tailwind.css from the source
```

`src/tokens.ts` is the single source of truth; the `.css` files are generated by
`scripts/build-css.mjs` and kept in sync by a test. Edit the TypeScript, never the `.css`.

## License

- **Code** — the compiler, the token contract, scripts: [MIT](LICENSE).
- **Bundled `maxhealth` example brand** — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/):
  if you ship that brand, credit **Max Health Inc.** and link <https://maxhealth.tech>.
  Author your own `Brand` and only the MIT terms apply. See [`LICENSE`](LICENSE) / [`NOTICE`](NOTICE).
