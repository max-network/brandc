/**
 * The design-language tokens as STRUCTURED DATA — the single source of truth. Every delivery
 * format (the `theme.css` stylesheet, the Tailwind `@theme` preset, the prefab wire `theme`
 * JSON) is GENERATED from this by {@link "./compile"}, so the formats can never drift.
 *
 * A {@link Brand} is the values; the token NAMES are the shared contract every Max Network UI
 * kit reads. This file ships the Max Health brand (flat + sharp, neutral intents + green accent).
 * Rebrand = a new Brand with the same names, different values.
 */

/** A colour token: its light-scheme and dark-scheme values (any CSS `<color>`). */
export interface ColorToken {
  light: string;
  dark: string;
}

/** A complete brand: scheme-dependent colours + scheme-independent scalars (radius/shadow/font). */
export interface Brand {
  name: string;
  colors: Record<string, ColorToken>;
  scalars: Record<string, string>;
}

/**
 * The Max Health brand. `satisfies Brand` keeps the literal token names (so {@link TokenName} is
 * a precise union) while checking the shape. Colours are oklch and byte-compatible with the
 * shared-ui / prefab base so those kits can consume this unchanged.
 */
export const maxhealth = {
  name: "maxhealth",
  colors: {
    // Surfaces
    background: { light: "oklch(1 0 0)", dark: "oklch(0.145 0 0)" },
    foreground: { light: "oklch(0.145 0 0)", dark: "oklch(0.985 0 0)" },
    card: { light: "oklch(1 0 0)", dark: "oklch(0.205 0 0)" },
    "card-foreground": { light: "oklch(0.145 0 0)", dark: "oklch(0.985 0 0)" },
    popover: { light: "oklch(1 0 0)", dark: "oklch(0.205 0 0)" },
    "popover-foreground": { light: "oklch(0.145 0 0)", dark: "oklch(0.985 0 0)" },
    // Intents
    primary: { light: "oklch(0.205 0 0)", dark: "oklch(0.922 0 0)" },
    "primary-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.205 0 0)" },
    secondary: { light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
    "secondary-foreground": { light: "oklch(0.205 0 0)", dark: "oklch(0.985 0 0)" },
    muted: { light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
    "muted-foreground": { light: "oklch(0.556 0 0)", dark: "oklch(0.708 0 0)" },
    accent: { light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
    "accent-foreground": { light: "oklch(0.205 0 0)", dark: "oklch(0.985 0 0)" },
    // Status
    destructive: { light: "oklch(0.577 0.245 27.325)", dark: "oklch(0.704 0.191 22.216)" },
    "destructive-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.985 0 0)" },
    success: { light: "oklch(0.627 0.17 149)", dark: "oklch(0.696 0.17 149)" },
    "success-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.145 0 0)" },
    warning: { light: "oklch(0.79 0.16 85)", dark: "oklch(0.828 0.16 85)" },
    "warning-foreground": { light: "oklch(0.205 0 0)", dark: "oklch(0.145 0 0)" },
    info: { light: "oklch(0.62 0.19 250)", dark: "oklch(0.707 0.165 254)" },
    "info-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.145 0 0)" },
    // Lines + focus
    border: { light: "oklch(0.922 0 0)", dark: "oklch(1 0 0 / 10%)" },
    input: { light: "oklch(0.922 0 0)", dark: "oklch(1 0 0 / 15%)" },
    ring: { light: "oklch(0.708 0 0)", dark: "oklch(0.556 0 0)" },
    // Max Health accent
    maxhealth: { light: "oklch(0.75 0.17 162)", dark: "oklch(0.78 0.17 162)" },
    "maxhealth-foreground": { light: "oklch(0.09 0 0)", dark: "oklch(0.09 0 0)" },
    // Data viz
    "chart-1": { light: "oklch(0.809 0.105 251.813)", dark: "oklch(0.809 0.105 251.813)" },
    "chart-2": { light: "oklch(0.623 0.214 259.815)", dark: "oklch(0.623 0.214 259.815)" },
    "chart-3": { light: "oklch(0.546 0.245 262.881)", dark: "oklch(0.546 0.245 262.881)" },
    "chart-4": { light: "oklch(0.488 0.243 264.376)", dark: "oklch(0.488 0.243 264.376)" },
    "chart-5": { light: "oklch(0.424 0.199 265.638)", dark: "oklch(0.424 0.199 265.638)" },
    // Sidebar / app chrome
    sidebar: { light: "oklch(0.985 0 0)", dark: "oklch(0.205 0 0)" },
    "sidebar-foreground": { light: "oklch(0.145 0 0)", dark: "oklch(0.985 0 0)" },
    "sidebar-primary": { light: "oklch(0.205 0 0)", dark: "oklch(0.488 0.243 264.376)" },
    "sidebar-primary-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.985 0 0)" },
    "sidebar-accent": { light: "oklch(0.97 0 0)", dark: "oklch(0.269 0 0)" },
    "sidebar-accent-foreground": { light: "oklch(0.205 0 0)", dark: "oklch(0.985 0 0)" },
    "sidebar-border": { light: "oklch(0.922 0 0)", dark: "oklch(1 0 0 / 10%)" },
    "sidebar-ring": { light: "oklch(0.708 0 0)", dark: "oklch(0.556 0 0)" },
  },
  scalars: {
    // Shape + elevation — Max Health is flat and sharp. Rebrand by overriding these.
    radius: "0rem",
    "radius-sm": "0rem",
    "radius-md": "0rem",
    "radius-lg": "0rem",
    "shadow-sm": "none",
    shadow: "none",
    "shadow-md": "none",
    "shadow-lg": "none",
    // Typography
    "font-sans": 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    "font-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
} satisfies Brand;

/** A token name in the shared contract (without the leading `--`). */
export type TokenName = keyof typeof maxhealth.colors | keyof typeof maxhealth.scalars;

/** The full contract as a runtime list — every variable name a kit may read. */
export const CONTRACT: readonly string[] = [
  ...Object.keys(maxhealth.colors),
  ...Object.keys(maxhealth.scalars),
];
