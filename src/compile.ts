/**
 * Generators: turn a {@link Brand} into each delivery format. One structured source, three
 * outputs that stay in lockstep — the CSS stylesheet, the Tailwind v4 preset, and the prefab
 * wire `theme` JSON.
 */
import type { Brand } from "./contract.js";

/**
 * Typed registration of the colour tokens via `@property` — gives them a `<color>` contract (so a
 * bad override is ignored rather than breaking layout) and makes them animatable.
 *
 * Registered ONLY where it is free. Giving a custom property a syntax forces its value to resolve
 * at computed-value time, i.e. once, on the element that declares it. For a `light-dark()` token
 * declared on `:root` that means the scheme is decided there for the whole document, and setting
 * `color-scheme` on any descendant does nothing — see w3c/csswg-drafts#13836, where the spec
 * editors describe this hole and note that staying unregistered is what keeps the value dynamic.
 *
 * A token whose two schemes are equal compiles to a plain value with no `light-dark()` in it, so
 * nothing is left to resolve late and the typed contract costs it nothing. That is the split, and
 * it is DERIVED from the values rather than a list of token names: a rebrand that gives a fixed
 * token distinct light and dark values drops out of registration on its own.
 */
function propertyRules(brand: Brand): string {
  return Object.entries(brand.colors)
    .filter(([, { light, dark }]) => light === dark)
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
 *
 * The override works at ANY depth, not just on `:root` — a `.dark` on a panel themes that panel.
 * That is why {@link propertyRules} leaves the scheme-dependent tokens unregistered (issue #14):
 * they keep their `light-dark()` unresolved until use, so each one resolves against the
 * `color-scheme` of the element actually reading it. The two selector conventions below are a
 * convenience over that mechanism, never a replacement for it — a bare `color-scheme: dark` on a
 * container themes its subtree just as well, with no class involved.
 */
export function toCss(brand: Brand): string {
  const entries = Object.entries(brand.colors);
  // `:root` carries the LIGHT value of every colour — plain, parseable by anything. Scheme-
  // dependent ones are upgraded below; this is what they degrade to otherwise.
  const colors = entries.map(([name, { light }]) => `  --${name}: ${light};`).join("\n");
  const scalars = Object.entries(brand.scalars)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n");
  const dynamic = entries
    .filter(([, { light, dark }]) => light !== dark)
    .map(([name, { light, dark }]) => `    --${name}: light-dark(${light}, ${dark});`)
    .join("\n");

  const rules = propertyRules(brand);
  return `${rules === "" ? "" : `${rules}\n\n`}:root {
  color-scheme: light dark;
${colors}
${scalars}
}
${dynamic === "" ? "" : `
@supports (color: light-dark(red, blue)) {
  :root {
${dynamic}
  }
}
`}
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
