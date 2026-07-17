# @max-network/css

The shared **design-language contract** for every Max Network UI kit: one vocabulary of
CSS custom properties that the SSR kit (`@max-network/hono-ui`), the React kit
(`@max-health-inc/shared-ui`) and the MCP-app renderer (`@maxhealth.tech/prefab`) all read.
Different runtimes, one variable vocabulary, so a brand is authored **once** and works
everywhere.

## Two axes

- **The contract** — the *names* of the variables (`--primary`, `--card`, `--radius`,
  `--success`, …). Stable across kits and stacks. See `CONTRACT` in [`src/theme.ts`](src/theme.ts).
- **A brand** — the *values* for those names. This package ships the **Max Health** brand
  (flat + sharp: `--radius: 0`, no shadows, neutral grayscale intents + the Max Health green).
  Any app rebrands by overriding a handful of variables.

## Consume it

Two delivery formats from one source:

**SSR string-injection** (e.g. hono-ui folds it into the `<style>` it already emits):

```ts
import { THEME_CSS } from "@max-network/css";
const html = `<style>${THEME_CSS}${componentStyles}</style>`;
```

**Bundler / CDN** (e.g. shared-ui, prefab):

```ts
import "@max-network/css/theme.css";
```

Components never hardcode a colour — they read the contract:

```css
.badge-success { background: color-mix(in oklch, var(--success) 15%, transparent); color: var(--success); }
.card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); }
```

## Rebrand (override, once)

A brand is just an override block on the same contract. Example — the Gästehaus Schaub
teal, rounded, soft-shadow look:

```css
:root {
  --primary: oklch(0.58 0.06 195);      /* teal */
  --primary-foreground: oklch(0.99 0 0);
  --ring: oklch(0.58 0.06 195);
  --radius: 0.625rem;                    /* rounded, not Max Health's sharp 0 */
  --radius-lg: 0.875rem;
  --shadow: 0 1px 2px rgb(23 32 31 / 0.05), 0 4px 14px rgb(23 32 31 / 0.05);
  --shadow-md: 0 8px 24px rgb(23 32 31 / 0.12);
}
```

Because every kit reads the same names, that one block rebrands SSR pages, React apps, and
MCP-app UIs identically. Dark mode swaps the scheme-dependent values under either
`.dark` (class) or `[data-theme="dark"]` (attribute), matching prefab's renderer so one
compiled brand works whichever convention a host uses.

## Development

```sh
npm install
npm run check   # tsc --noEmit && build && node --test
npm run build   # tsc → dist/, then regenerate theme.css from THEME_CSS
```

`src/theme.ts` is the single source of truth; `theme.css` is generated from it by
`scripts/build-css.mjs` and kept in sync by a test. Edit the TypeScript, never `theme.css`.
