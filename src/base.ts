/**
 * Opt-in base stylesheet, not part of the token contract: restores `cursor: pointer` on buttons,
 * which Tailwind v4 dropped. `import "brandc/base.css";`
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
