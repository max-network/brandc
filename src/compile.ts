/**
 * Generators: turn a {@link Brand} into each delivery format. One structured source, three
 * outputs that stay in lockstep — the CSS stylesheet, the Tailwind v4 preset, and the prefab
 * wire `theme` JSON.
 */
import type { Brand } from "./tokens.js";

/**
 * Typed registration of the colour tokens via `@property` — gives them a `<color>` contract
 * (so a bad override is ignored rather than breaking layout) and makes them animatable. The
 * light value is the `initial-value` fallback; `:root` always sets the real `light-dark()` value.
 */
function propertyRules(brand: Brand): string {
  return Object.entries(brand.colors)
    .map(
      ([name, { light }]) =>
        `@property --${name} {\n  syntax: "<color>";\n  inherits: true;\n  initial-value: ${light};\n}`,
    )
    .join("\n");
}

/**
 * The brand as a self-contained stylesheet:
 *   - `@property` typed colour tokens,
 *   - `:root` with `color-scheme: light dark` (so `prefers-color-scheme` is honoured
 *     automatically) and each colour as `light-dark(<light>, <dark>)` — one declaration, no
 *     duplicated dark block,
 *   - scheme-independent scalars (radius/shadow/font),
 *   - manual override: `.light` / `[data-theme="light"]` and `.dark` / `[data-theme="dark"]`
 *     flip `color-scheme`, which is what `light-dark()` resolves against (both conventions, to
 *     match prefab's renderer).
 */
export function toCss(brand: Brand): string {
  const colors = Object.entries(brand.colors)
    .map(([name, { light, dark }]) => {
      const value = light === dark ? light : `light-dark(${light}, ${dark})`;
      return `  --${name}: ${value};`;
    })
    .join("\n");
  const scalars = Object.entries(brand.scalars)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n");

  return `${propertyRules(brand)}

:root {
  color-scheme: light dark;
${colors}
${scalars}
}

.light, [data-theme="light"] { color-scheme: light; }
.dark, [data-theme="dark"] { color-scheme: dark; }
`;
}

/**
 * The brand as a Tailwind v4 `@theme inline` preset. Two-stage on purpose: the raw values live in
 * `:root`/dark (see {@link toCss}); this layer only MAPS them to Tailwind's namespaces
 * (`--color-*`, `--radius-*`, `--shadow-*`, `--font-*`) by REFERENCE. `inline` + `var()` means the
 * values are not baked at build time, so runtime light/dark switching keeps working.
 *
 * Consume after `@import "tailwindcss";` and `@import "@max-network/css/theme.css";`.
 */
export function toTailwindCss(brand: Brand): string {
  const colors = Object.keys(brand.colors)
    .map((name) => `  --color-${name}: var(--${name});`)
    .join("\n");
  const scalars = Object.keys(brand.scalars)
    .map((name) => `  --${name}: var(--${name});`)
    .join("\n");
  return `@theme inline {\n${colors}\n${scalars}\n}\n`;
}

/** A prefab wire `theme` object (`{ light, dark }` maps). prefab's compiler emits `:root` +
 *  `.dark,[data-theme="dark"]` from these. Scalars are scheme-independent, so they go in `light`. */
export function toPrefabTheme(brand: Brand): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};
  for (const [name, { light: l, dark: d }] of Object.entries(brand.colors)) {
    light[name] = l;
    dark[name] = d;
  }
  for (const [name, value] of Object.entries(brand.scalars)) light[name] = value;
  return { light, dark };
}
