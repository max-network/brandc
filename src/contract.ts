/**
 * THE CONTRACT — the shared variable vocabulary, declared here and owned by no brand.
 *
 * This file is deliberately value-free: it lists only NAMES. A {@link Brand} ({@link "./tokens"})
 * supplies the values. Keeping the two apart is the whole point of the split — while the contract
 * was derived from one brand (`Object.keys(maxhealth.colors)`) the "shared" vocabulary was really
 * that brand's private key set, and a second brand could not satisfy it (issue #13).
 *
 * Adding a name here is an additive contract change: every brand that claims to be a
 * {@link ContractBrand} must then supply it, which `satisfies ContractBrand` enforces at compile
 * time and `test/contract.test.mjs` re-checks at runtime.
 */

/** A colour token: its light-scheme and dark-scheme values (any CSS `<color>`). */
export interface ColorToken {
  light: string;
  dark: string;
}

/**
 * The scheme-dependent half of the contract: every name a kit may read as a `<color>`.
 * Grouped by role; the order is the order they are emitted in.
 */
export const CONTRACT_COLORS = [
  // Surfaces
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  // Intents
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  // Status
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  // Lines + focus
  "border",
  "input",
  "ring",
  // Brand accent — the brand-agnostic accent. `main` is the solid step, `main-foreground` the
  // colour that stays legible on it, `main-50..900` the full ramp for bg/text/gradient utilities.
  "main",
  "main-foreground",
  "main-50",
  "main-100",
  "main-200",
  "main-300",
  "main-400",
  "main-500",
  "main-600",
  "main-700",
  "main-800",
  "main-900",
  // Data viz — a CATEGORICAL ramp: seven slots for series with no inherent order.
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
  "chart-7",
  // Sidebar / app chrome
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const;

/** The scheme-independent half: shape, elevation, typography and rhythm. One value, both schemes. */
export const CONTRACT_SCALARS = [
  "radius",
  "radius-sm",
  "radius-md",
  "radius-lg",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "font-sans",
  "font-mono",
  // Type scale. Sizes, not roles: a kit picks the step, the brand sets how big it is.
  "text-xs",
  "text-sm",
  "text-base",
  "text-md",
  "text-lg",
  "text-xl",
  "text-2xl",
  // Spacing scale — the brand's density. Kits that set ad-hoc pixel gaps per stylesheet stop
  // sharing a rhythm, which is the drift this half exists to prevent.
  "space-1",
  "space-2",
  "space-3",
  "space-4",
  "space-5",
  "space-6",
  "space-7",
  "space-8",
  // Comfortable line length for long-form prose.
  "measure",
] as const;

/** A scheme-dependent contract token name (without the leading `--`). */
export type ColorTokenName = (typeof CONTRACT_COLORS)[number];

/** A scheme-independent contract token name (without the leading `--`). */
export type ScalarTokenName = (typeof CONTRACT_SCALARS)[number];

/** Any token name in the shared contract (without the leading `--`). */
export type TokenName = ColorTokenName | ScalarTokenName;

/** The full contract as a runtime list — every variable name a kit may read. */
export const CONTRACT: readonly TokenName[] = [...CONTRACT_COLORS, ...CONTRACT_SCALARS];

/**
 * A set of brand values. Partial on purpose: a Tailwind v4 app that only rebrands colours passes
 * `scalars: {}` (see the README gotcha), and every generator in {@link "./compile"} emits exactly
 * the keys it is given. Extra, brand-private names beyond the contract are allowed and are emitted
 * too — see {@link brandExtras}.
 */
export interface Brand {
  name: string;
  colors: Record<string, ColorToken>;
  scalars: Record<string, string>;
}

/**
 * A brand that covers the WHOLE contract — what a first-class, shippable brand must be. Applied
 * with `satisfies` (not `:`) so the literal token names survive for tooling while the missing-key
 * check still runs.
 */
export type ContractBrand = Brand & {
  colors: Record<ColorTokenName, ColorToken>;
  scalars: Record<ScalarTokenName, string>;
};

/**
 * Tokens that were once in the contract, mapped to the contract token to migrate to. They live on
 * as brand-private extras so nothing breaks mid-migration, and the mapping is exported so
 * consumers and codemods can read it instead of guessing it.
 *
 * Each replacement holds the SAME values as the token it replaces (asserted in
 * `test/contract.test.mjs`), so migrating is a rename with no visual change:
 * `text-maxhealth` → `text-main`, `bg-maxhealth/10` → `bg-main/10`.
 */
export const DEPRECATED_TOKENS: Readonly<Record<string, TokenName>> = {
  maxhealth: "main",
  "maxhealth-foreground": "main-foreground",
};

/**
 * The token names a brand declares BEYOND the contract — its private extras. Empty for a brand
 * that speaks only the shared vocabulary; a kit must never read from this list.
 */
export function brandExtras(brand: Brand): readonly string[] {
  const contract = new Set<string>(CONTRACT);
  return [...Object.keys(brand.colors), ...Object.keys(brand.scalars)].filter(
    (name) => !contract.has(name),
  );
}
