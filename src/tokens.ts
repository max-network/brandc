/**
 * The BRANDS — token VALUES as structured data. The names they fill in are declared, brand-free,
 * in {@link "./contract"}; every delivery format (the `theme.css` stylesheet, the Tailwind
 * `@theme` preset, the prefab wire `theme` JSON) is GENERATED from these by {@link "./compile"},
 * so the formats can never drift.
 *
 * This file ships two brands on that one contract: `maxhealth` (flat + sharp, neutral intents +
 * green accent) and `dashboard` (rounded + soft, blue, dark chrome). Rebrand = a new brand with
 * the same names, different values.
 */
import type { ContractBrand } from "./contract.js";

/**
 * The Max Health brand. `satisfies ContractBrand` checks it covers every contract token while
 * keeping the literal token names for tooling. Colours are oklch and byte-compatible with the
 * downstream UI kits' base, so those kits can consume this unchanged.
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
    // DEPRECATED brand-private extras, kept out of the contract because a shared
    // vocabulary may not carry one brand's name — `dashboard` would have to declare
    // `--maxhealth` too (issue #13). Still emitted, so the kits and apps reading
    // them today keep working unchanged.
    // `--main` / `--main-foreground` below hold these exact values, so the migration
    // is a pure rename — see `DEPRECATED_TOKENS`.
    maxhealth: { light: "oklch(0.75 0.17 162)", dark: "oklch(0.78 0.17 162)" },
    "maxhealth-foreground": { light: "oklch(0.09 0 0)", dark: "oklch(0.09 0 0)" },
    // Brand accent — the contract's brand-AGNOSTIC accent, and the reason the
    // `maxhealth`-named pair above is redundant. `main` / `main-foreground` are an
    // intent pair like `primary`: scheme-DEPENDENT, so the accent lifts in dark mode
    // (0.75 → 0.78) instead of sitting at one lightness for both.
    main: { light: "oklch(0.75 0.17 162)", dark: "oklch(0.78 0.17 162)" },
    "main-foreground": { light: "oklch(0.09 0 0)", dark: "oklch(0.09 0 0)" },
    // ...and `main-50..900` is the fixed PALETTE behind it: a full ramp so apps have
    // accent shades (bg-main-*, text-main-*, from/to-main-*), not just one. Scheme-
    // independent on purpose — pick the right step per context. Default here is the
    // Max Health green (hue 162); rebrand by overriding the `--main-*` :root vars.
    "main-50": { light: "oklch(0.97 0.02 162)", dark: "oklch(0.97 0.02 162)" },
    "main-100": { light: "oklch(0.945 0.035 162)", dark: "oklch(0.945 0.035 162)" },
    "main-200": { light: "oklch(0.905 0.06 162)", dark: "oklch(0.905 0.06 162)" },
    "main-300": { light: "oklch(0.855 0.09 162)", dark: "oklch(0.855 0.09 162)" },
    "main-400": { light: "oklch(0.8 0.13 162)", dark: "oklch(0.8 0.13 162)" },
    "main-500": { light: "oklch(0.75 0.16 162)", dark: "oklch(0.75 0.16 162)" },
    "main-600": { light: "oklch(0.68 0.16 162)", dark: "oklch(0.68 0.16 162)" },
    "main-700": { light: "oklch(0.585 0.14 162)", dark: "oklch(0.585 0.14 162)" },
    "main-800": { light: "oklch(0.49 0.115 162)", dark: "oklch(0.49 0.115 162)" },
    "main-900": { light: "oklch(0.41 0.09 162)", dark: "oklch(0.41 0.09 162)" },
    // Data viz — a CATEGORICAL ramp: seven distinct hues for series that have no
    // order (status, category, cohort). Was a five-step monochrome blue ramp, which
    // reads as a *sequence* and so mislabels unordered series; a blue-to-blue chart
    // also can't be told apart without a legend. Scheme-independent: these are
    // picked for contrast against both the light and dark background.
    //
    // The values are the exact oklch of the palette a downstream kit shipped hardcoded
    // (Tailwind's 500 steps), to five decimals so the migration off those hex
    // literals is byte-identical rather than merely close.
    "chart-1": { light: "oklch(0.69587 0.14907 162.5)", dark: "oklch(0.69587 0.14907 162.5)" }, // #10b981 emerald
    "chart-2": { light: "oklch(0.76859 0.16466 70.1)", dark: "oklch(0.76859 0.16466 70.1)" }, // #f59e0b amber
    "chart-3": { light: "oklch(0.63683 0.20785 25.3)", dark: "oklch(0.63683 0.20785 25.3)" }, // #ef4444 red
    "chart-4": { light: "oklch(0.60563 0.21892 292.7)", dark: "oklch(0.60563 0.21892 292.7)" }, // #8b5cf6 violet
    "chart-5": { light: "oklch(0.71484 0.12574 215.2)", dark: "oklch(0.71484 0.12574 215.2)" }, // #06b6d4 cyan
    "chart-6": { light: "oklch(0.65592 0.21177 354.3)", dark: "oklch(0.65592 0.21177 354.3)" }, // #ec4899 pink
    "chart-7": { light: "oklch(0.76814 0.2044 130.8)", dark: "oklch(0.76814 0.2044 130.8)" }, // #84cc16 lime
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
    // Typography — Geist is the Max Health brand face; the stack after it is the fallback
    // while @fontsource-variable/geist loads (each app imports the font file itself).
    "font-sans": '"Geist Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    "font-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
} satisfies ContractBrand;

/**
 * The `dashboard` brand — a second, deliberately DIFFERENT identity that proves the contract is
 * genuinely multi-brand: rounded + soft-shadowed, a blue primary, slate neutrals, and a dark
 * sidebar in both schemes (classic app chrome), versus Max Health's flat + sharp + green + light
 * sidebar. Same contract token NAMES, different VALUES. A good starting point to copy for a new
 * dashboard/admin app. Authored for this package, so it is MIT (unlike the CC BY `maxhealth` brand).
 */
export const dashboard = {
  name: "dashboard",
  colors: {
    // Surfaces (slate-tinted dark)
    background: { light: "oklch(1 0 0)", dark: "oklch(0.21 0.02 264)" },
    foreground: { light: "oklch(0.21 0.02 264)", dark: "oklch(0.98 0.003 248)" },
    card: { light: "oklch(1 0 0)", dark: "oklch(0.26 0.02 264)" },
    "card-foreground": { light: "oklch(0.21 0.02 264)", dark: "oklch(0.98 0.003 248)" },
    popover: { light: "oklch(1 0 0)", dark: "oklch(0.26 0.02 264)" },
    "popover-foreground": { light: "oklch(0.21 0.02 264)", dark: "oklch(0.98 0.003 248)" },
    // Intents (blue action colour)
    primary: { light: "oklch(0.55 0.2 262)", dark: "oklch(0.68 0.16 262)" },
    "primary-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.21 0.02 264)" },
    secondary: { light: "oklch(0.967 0.01 259)", dark: "oklch(0.3 0.02 264)" },
    "secondary-foreground": { light: "oklch(0.3 0.02 264)", dark: "oklch(0.98 0.003 248)" },
    muted: { light: "oklch(0.967 0.01 259)", dark: "oklch(0.3 0.02 264)" },
    "muted-foreground": { light: "oklch(0.55 0.02 257)", dark: "oklch(0.71 0.02 256)" },
    accent: { light: "oklch(0.967 0.01 259)", dark: "oklch(0.3 0.02 264)" },
    "accent-foreground": { light: "oklch(0.3 0.02 264)", dark: "oklch(0.98 0.003 248)" },
    // Brand accent — same contract pair as maxhealth, in the dashboard blue (hue 262).
    // Scheme-dependent intent pair: the accent lifts in dark mode and its foreground
    // flips with it (near-white on the dark-mode blue is too low-contrast).
    main: { light: "oklch(0.55 0.2 262)", dark: "oklch(0.68 0.16 262)" },
    "main-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.21 0.02 264)" },
    // The fixed accent palette behind it (scheme-independent, as in every brand).
    "main-50": { light: "oklch(0.97 0.02 262)", dark: "oklch(0.97 0.02 262)" },
    "main-100": { light: "oklch(0.93 0.04 262)", dark: "oklch(0.93 0.04 262)" },
    "main-200": { light: "oklch(0.88 0.07 262)", dark: "oklch(0.88 0.07 262)" },
    "main-300": { light: "oklch(0.8 0.1 262)", dark: "oklch(0.8 0.1 262)" },
    "main-400": { light: "oklch(0.7 0.15 262)", dark: "oklch(0.7 0.15 262)" },
    "main-500": { light: "oklch(0.62 0.19 262)", dark: "oklch(0.62 0.19 262)" },
    "main-600": { light: "oklch(0.55 0.2 262)", dark: "oklch(0.55 0.2 262)" },
    "main-700": { light: "oklch(0.48 0.19 262)", dark: "oklch(0.48 0.19 262)" },
    "main-800": { light: "oklch(0.42 0.16 262)", dark: "oklch(0.42 0.16 262)" },
    "main-900": { light: "oklch(0.37 0.13 262)", dark: "oklch(0.37 0.13 262)" },
    // Status
    destructive: { light: "oklch(0.58 0.22 27)", dark: "oklch(0.7 0.19 22)" },
    "destructive-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.985 0 0)" },
    success: { light: "oklch(0.63 0.17 149)", dark: "oklch(0.7 0.17 149)" },
    "success-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.145 0 0)" },
    warning: { light: "oklch(0.79 0.16 85)", dark: "oklch(0.83 0.16 85)" },
    "warning-foreground": { light: "oklch(0.28 0.02 264)", dark: "oklch(0.145 0 0)" },
    info: { light: "oklch(0.62 0.19 250)", dark: "oklch(0.71 0.16 254)" },
    "info-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.145 0 0)" },
    // Lines + focus
    border: { light: "oklch(0.92 0.01 256)", dark: "oklch(1 0 0 / 12%)" },
    input: { light: "oklch(0.92 0.01 256)", dark: "oklch(1 0 0 / 16%)" },
    ring: { light: "oklch(0.55 0.2 262)", dark: "oklch(0.68 0.16 262)" },
    // Data viz — categorical, same seven slots as maxhealth in this brand's own
    // hues (blue → teal → green → amber → red → violet → pink).
    "chart-1": { light: "oklch(0.62 0.19 260)", dark: "oklch(0.62 0.19 260)" },
    "chart-2": { light: "oklch(0.6 0.13 195)", dark: "oklch(0.6 0.13 195)" },
    "chart-3": { light: "oklch(0.7 0.15 160)", dark: "oklch(0.7 0.15 160)" },
    "chart-4": { light: "oklch(0.75 0.16 85)", dark: "oklch(0.75 0.16 85)" },
    "chart-5": { light: "oklch(0.64 0.2 25)", dark: "oklch(0.64 0.2 25)" },
    "chart-6": { light: "oklch(0.61 0.22 293)", dark: "oklch(0.61 0.22 293)" },
    "chart-7": { light: "oklch(0.66 0.21 354)", dark: "oklch(0.66 0.21 354)" },
    // Sidebar / app chrome — dark in BOTH schemes (the dashboard signature)
    sidebar: { light: "oklch(0.26 0.02 264)", dark: "oklch(0.18 0.02 264)" },
    "sidebar-foreground": { light: "oklch(0.98 0.003 248)", dark: "oklch(0.98 0.003 248)" },
    "sidebar-primary": { light: "oklch(0.68 0.16 262)", dark: "oklch(0.68 0.16 262)" },
    "sidebar-primary-foreground": { light: "oklch(0.985 0 0)", dark: "oklch(0.985 0 0)" },
    "sidebar-accent": { light: "oklch(0.32 0.02 264)", dark: "oklch(0.32 0.02 264)" },
    "sidebar-accent-foreground": { light: "oklch(0.98 0.003 248)", dark: "oklch(0.98 0.003 248)" },
    "sidebar-border": { light: "oklch(1 0 0 / 12%)", dark: "oklch(1 0 0 / 12%)" },
    "sidebar-ring": { light: "oklch(0.68 0.16 262)", dark: "oklch(0.68 0.16 262)" },
  },
  scalars: {
    // Shape + elevation — rounded and softly shadowed (the opposite of Max Health's flat/sharp).
    radius: "0.5rem",
    "radius-sm": "0.375rem",
    "radius-md": "0.5rem",
    "radius-lg": "0.75rem",
    "shadow-sm": "0 1px 2px 0 rgb(15 23 42 / 0.06)",
    shadow: "0 1px 3px 0 rgb(15 23 42 / 0.1), 0 1px 2px -1px rgb(15 23 42 / 0.1)",
    "shadow-md": "0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)",
    "shadow-lg": "0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)",
    // Brand-neutral system stack (no bundled webfont).
    "font-sans":
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    "font-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
} satisfies ContractBrand;

/** Every brand this package ships as first-class. Each covers the whole contract. */
export const BRANDS = [maxhealth, dashboard] as const;
