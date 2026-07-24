/**
 * @max-network/css — the shared design-language contract for the Max Network UI kits.
 *
 * One structured source ({@link "./tokens".maxhealth}), three generated delivery formats
 * ({@link "./compile"}): a CSS stylesheet ({@link THEME_CSS}), a Tailwind v4 preset
 * ({@link TAILWIND_CSS}), and a prefab wire `theme` ({@link toPrefabTheme}). Author a brand once,
 * render it on any stack.
 */
export type { Brand, ColorToken, TokenName } from "./tokens.js";
export { maxhealth, dashboard, CONTRACT } from "./tokens.js";
export { toCss, toTailwindCss, toPrefabTheme } from "./compile.js";
export { BASE_CSS } from "./base.js";

import { maxhealth, dashboard } from "./tokens.js";
import { toCss, toTailwindCss } from "./compile.js";

/** The Max Health brand as a stylesheet string — for SSR string-injection (e.g. hono-ui). */
export const THEME_CSS = toCss(maxhealth);

/** The Max Health brand as a Tailwind v4 `@theme inline` preset string. */
export const TAILWIND_CSS = toTailwindCss(maxhealth);

/** The `dashboard` brand as a stylesheet string (SSR string-injection). */
export const DASHBOARD_THEME_CSS = toCss(dashboard);

/** The `dashboard` brand as a Tailwind v4 `@theme inline` preset string. */
export const DASHBOARD_TAILWIND_CSS = toTailwindCss(dashboard);

/** @deprecated use {@link THEME_CSS}. Kept as an alias for early consumers. */
export const MAXHEALTH_CSS = THEME_CSS;
