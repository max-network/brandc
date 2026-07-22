/**
 * Optional base element ergonomics that pair with the contract but are NOT part of it.
 *
 * The contract ({@link "./tokens"}) is pure custom-property vocabulary. This file is a separate,
 * OPT-IN stylesheet for a cross-cutting framework quirk every Tailwind v4 consumer hits: Tailwind
 * v4 dropped the default `cursor: pointer` on `<button>` (it now follows the native browser
 * default, `default`). Import it explicitly if you want it:
 *
 *   import "@max-network/css/base.css";
 *
 * Plain CSS on element selectors — framework-agnostic, no tokens involved. SSR/string consumers
 * that set cursors inline, and non-CSS consumers (React Native), simply don't import it.
 */
export const BASE_CSS = `:where(button):not(:disabled),
:where([role="button"]):not([aria-disabled="true"]),
:where(a[href]),
:where(label[for]),
:where(summary),
:where(select):not(:disabled),
:where([type="button"], [type="submit"], [type="reset"]):not(:disabled) {
  cursor: pointer;
}
`;
