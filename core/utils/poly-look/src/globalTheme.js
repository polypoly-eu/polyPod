import { css, unsafeCSS } from "lit-element";

export const POLYPREFIX = "poly";

export const globalTheme = css`
  :host {
    /* Primary colors */
    --${unsafeCSS(POLYPREFIX)}-color-dark: var(--color-dark, #0f1938);
    --${unsafeCSS(POLYPREFIX)}-color-semi-dark: var(--color-semi-dark, #8d9caf);
    --${unsafeCSS(POLYPREFIX)}-color-medium: var(--color-medium, #a9b6c6);
    --${unsafeCSS(POLYPREFIX)}-color-light: var(--color-light, #f7fafc);

    /* Background colors */
    --${unsafeCSS(POLYPREFIX)}-background-dark: var(
      --color-background-dark,
      var(--${unsafeCSS(POLYPREFIX)}-color-dark)
    );
    --${unsafeCSS(POLYPREFIX)}-background-light: var(
      --color-background-light,
      var(--${unsafeCSS(POLYPREFIX)}-color-light)
    );

    /* Text colors */
    --${unsafeCSS(
      POLYPREFIX
    )}-color-text-dark: var(--color-text-dark, var(--${unsafeCSS(
  POLYPREFIX
)}-color-dark));
    --${unsafeCSS(
      POLYPREFIX
    )}-color-text-light: var(--color-text-light, var(--${unsafeCSS(
  POLYPREFIX
)}-color-light));

    /* Data exploration colors */
    --${unsafeCSS(
      POLYPREFIX
    )}-data-exp-data-types: var(--data-exp-data-types, #fe8988);
    --${unsafeCSS(
      POLYPREFIX
    )}-data-exp-purposes: var(--data-exp-purposes, #3ba6ff);
    --${unsafeCSS(
      POLYPREFIX
    )}-data-exp-companies: var(--data-exp-companies, #7ee8a2);
    --${unsafeCSS(
      POLYPREFIX
    )}-data-exp-data-regions: var(--data-exp-data-regions, #edf2f7);

    /* Size */
    --${unsafeCSS(POLYPREFIX)}-max-width: var(--max-width, 412px);
    --${unsafeCSS(POLYPREFIX)}-line-height: var(--line-height, 120%);
    --${unsafeCSS(POLYPREFIX)}-letter-spacing: var(--letter-spacing, -0.01em);

    /* Font */
    --${unsafeCSS(
      POLYPREFIX
    )}-font-family-regular-name: var(--font-family-regular-name, "Jost");
    --${unsafeCSS(
      POLYPREFIX
    )}-font-family-light-name: var(--font-family-light-name, "Jost Light");
    --${unsafeCSS(POLYPREFIX)}-font-family-medium-name: var(
      --font-family-medium-name,
      "Jost Medium"
    );
    --${unsafeCSS(POLYPREFIX)}-font-family-${unsafeCSS(
  POLYPREFIX
)}-display-name: var(
      --font-family-${unsafeCSS(POLYPREFIX)}-display-name,
      "${unsafeCSS(POLYPREFIX)}Display"
    );

    /* Font sizes */
    --${unsafeCSS(
      POLYPREFIX
    )}-headline-font-size: var(--headline-font-size, 38px);
    --${unsafeCSS(
      POLYPREFIX
    )}-body-text-font-size: var(--body-text-font-size, 20px);
    --${unsafeCSS(POLYPREFIX)}-button-font-size: var(--button-font-size, 18px);

    /* Font weight */
    --${unsafeCSS(
      POLYPREFIX
    )}-font-weight-regular: var(--font-weight-regular, 400);
    --${unsafeCSS(
      POLYPREFIX
    )}-font-weight-irrelevant: var(--font-weight-irrelevant, 200);
    --${unsafeCSS(
      POLYPREFIX
    )}-font-weight-important: var(--font-weight-important, 800);
  }
`;
