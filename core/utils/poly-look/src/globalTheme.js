import { css, unsafeCSS } from "lit-element";

const PREFIX = 'poly'

const globalTheme = css`
  :host {
    /* Primary colors */
    --${unsafeCSS(PREFIX)}-color-dark: var(--color-dark, #0f1938);
    --${unsafeCSS(PREFIX)}-color-semi-dark: var(--color-semi-dark, #8d9caf);
    --${unsafeCSS(PREFIX)}-color-medium: var(--color-medium, #a9b6c6);
    --${unsafeCSS(PREFIX)}-color-light: var(--color-light, #f7fafc);

    /* Background colors */
    --${unsafeCSS(PREFIX)}-background-dark: var(
      --color-background-dark,
      var(--${unsafeCSS(PREFIX)}-color-dark)
    );
    --${unsafeCSS(PREFIX)}-background-light: var(
      --color-background-light,
      var(--${unsafeCSS(PREFIX)}-color-light)
    );

    /* Text colors */
    --${unsafeCSS(PREFIX)}-color-text-dark: var(--color-text-dark, var(--${unsafeCSS(PREFIX)}-color-dark));
    --${unsafeCSS(PREFIX)}-color-text-light: var(--color-text-light, var(--${unsafeCSS(PREFIX)}-color-light));

    /* Data exploration colors */
    --${unsafeCSS(PREFIX)}-data-exp-data-types: var(--data-exp-data-types, #fe8988);
    --${unsafeCSS(PREFIX)}-data-exp-purposes: var(--data-exp-purposes, #3ba6ff);
    --${unsafeCSS(PREFIX)}-data-exp-companies: var(--data-exp-companies, #7ee8a2);
    --${unsafeCSS(PREFIX)}-data-exp-data-regions: var(--data-exp-data-regions, #edf2f7);

    /* Size */
    --${unsafeCSS(PREFIX)}-max-width: var(--max-width, 412px);
    --${unsafeCSS(PREFIX)}-line-height: var(--line-height, 120%);
    --${unsafeCSS(PREFIX)}-letter-spacing: var(--letter-spacing, -0.01em);

    /* Font */
    --${unsafeCSS(PREFIX)}-font-family-regular-name: var(--font-family-regular-name, "Jost");
    --${unsafeCSS(PREFIX)}-font-family-light-name: var(--font-family-light-name, "Jost Light");
    --${unsafeCSS(PREFIX)}-font-family-medium-name: var(
      --font-family-medium-name,
      "Jost Medium"
    );
    --${unsafeCSS(PREFIX)}-font-family-${unsafeCSS(PREFIX)}-display-name: var(
      --font-family-${unsafeCSS(PREFIX)}-display-name,
      "${unsafeCSS(PREFIX)}Display"
    );

    /* Font sizes */
    --${unsafeCSS(PREFIX)}-headline-font-size: var(--headline-font-size, 38px);
    --${unsafeCSS(PREFIX)}-body-text-font-size: var(--body-text-font-size, 20px);
    --${unsafeCSS(PREFIX)}-button-font-size: var(--button-font-size, 18px);

    /* Font weight */
    --${unsafeCSS(PREFIX)}-font-weight-regular: var(--font-weight-regular, 400);
    --${unsafeCSS(PREFIX)}-font-weight-irrelevant: var(--font-weight-irrelevant, 200);
    --${unsafeCSS(PREFIX)}-font-weight-important: var(--font-weight-important, 800);
  }
`;

export default globalTheme;
