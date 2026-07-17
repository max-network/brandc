/**
 * @max-network/css — the shared design-language CONTRACT for every Max Network UI kit.
 *
 * Two orthogonal axes:
 *   1. The CONTRACT — the *names* of the CSS custom properties every kit reads
 *      (`--primary`, `--card`, `--radius`, `--success`, …). This is what unifies the
 *      SSR kit (hono-ui), the React kit (shared-ui) and the MCP-app renderer (prefab):
 *      they render different runtimes but speak ONE variable vocabulary.
 *   2. A BRAND — the *values* for those names. This file ships the Max Health brand
 *      ({@link THEME_CSS} / {@link MAXHEALTH_CSS}): flat + sharp (radius 0), a neutral
 *      grayscale intent scale plus the Max Health green accent. Any app rebrands by
 *      overriding a handful of variables (see the README), so a brand is authored ONCE
 *      and works across all three stacks.
 *
 * Delivered two ways from this one source so every stack can consume it:
 *   - `THEME_CSS` (a string) for SSR string-injection consumers (hono-ui folds it into
 *     the `<style>` it already emits — no bundler needed).
 *   - `theme.css` (a generated file, kept in sync by `scripts/build-css.mjs`) for
 *     bundler / CDN consumers (shared-ui imports it; prefab links it).
 */

/**
 * The contract: every CSS custom property a kit may read, grouped by role. A brand MUST
 * define a value for each in `:root`; the dark scheme overrides the scheme-dependent ones.
 * Exported so kits/tests can assert a brand is complete rather than silently missing a slot.
 */
export const CONTRACT = [
  // Surfaces
  "background", "foreground",
  "card", "card-foreground",
  "popover", "popover-foreground",
  // Intents
  "primary", "primary-foreground",
  "secondary", "secondary-foreground",
  "muted", "muted-foreground",
  "accent", "accent-foreground",
  // Status
  "destructive", "destructive-foreground",
  "success", "success-foreground",
  "warning", "warning-foreground",
  "info", "info-foreground",
  // Lines + focus
  "border", "input", "ring",
  // Brand accent
  "maxhealth", "maxhealth-foreground",
  // Data viz
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
  // Sidebar / app chrome
  "sidebar", "sidebar-foreground",
  "sidebar-primary", "sidebar-primary-foreground",
  "sidebar-accent", "sidebar-accent-foreground",
  "sidebar-border", "sidebar-ring",
  // Shape + elevation scales (per-brand; Max Health is flat + sharp)
  "radius", "radius-sm", "radius-md", "radius-lg",
  "shadow-sm", "shadow", "shadow-md", "shadow-lg",
] as const;

/** A CSS custom property name in the contract (without the leading `--`). */
export type TokenName = (typeof CONTRACT)[number];

/**
 * The Max Health brand: flat + sharp (radius 0, no shadows), a neutral grayscale intent
 * scale, the Max Health green accent, and the shared status + chart + sidebar palette.
 * Values are oklch and are byte-compatible with shared-ui's `theme.css` base, so the React
 * kit can drop its local copy and consume this unchanged.
 */
export const MAXHEALTH_CSS = `:root {
  /* Shape + elevation — Max Health is flat and sharp. Rebrand by overriding these. */
  --radius: 0rem;
  --radius-sm: 0rem;
  --radius-md: 0rem;
  --radius-lg: 0rem;
  --shadow-sm: none;
  --shadow: none;
  --shadow-md: none;
  --shadow-lg: none;

  /* Surfaces */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);

  /* Intents */
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);

  /* Status — subtle backgrounds are derived in component CSS via color-mix(), no -bg sprawl */
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --success: oklch(0.627 0.17 149);
  --success-foreground: oklch(0.985 0 0);
  --warning: oklch(0.79 0.16 85);
  --warning-foreground: oklch(0.205 0 0);
  --info: oklch(0.62 0.19 250);
  --info-foreground: oklch(0.985 0 0);

  /* Lines + focus */
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);

  /* Max Health accent */
  --maxhealth: oklch(0.75 0.17 162);
  --maxhealth-foreground: oklch(0.09 0 0);

  /* Data viz */
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);

  /* Sidebar / app chrome */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);

  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);

  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.985 0 0);
  --success: oklch(0.696 0.17 149);
  --success-foreground: oklch(0.145 0 0);
  --warning: oklch(0.828 0.16 85);
  --warning-foreground: oklch(0.145 0 0);
  --info: oklch(0.707 0.165 254);
  --info-foreground: oklch(0.145 0 0);

  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);

  --maxhealth: oklch(0.78 0.17 162);
  --maxhealth-foreground: oklch(0.09 0 0);

  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);

  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}
`;

/** The default brand shipped by this package (Max Health). Alias of {@link MAXHEALTH_CSS}. */
export const THEME_CSS = MAXHEALTH_CSS;
