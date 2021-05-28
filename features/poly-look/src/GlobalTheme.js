import { css } from "lit-element";

const globalTheme = css`
  :host {
    /* Primary colors */
    --poly-color-dark: var(--color-dark, #0f1938);
    --poly-color-semi-dark: var(--color-semi-dark, #8d9caf);
    --poly-color-medium: var(--color-medium, #a9b6c6);
    --poly-color-light: var(--color-light, #f7fafc);

    /* Background colors */
    --poly-background-dark: var(
      --color-background-dark,
      var(--poly-color-dark)
    );
    --poly-background-light: var(
      --color-background-light,
      var(--poly-color-light)
    );

    /* Text colors */
    --poly-color-text-dark: var(--color-text-dark, var(--poly-color-dark));
    --poly-color-text-light: var(--color-text-light, var(--poly-color-light));

    /* Data exploration colors */
    --poly-data-exp-data-types: var(--data-exp-data-types, #fe8988);
    --poly-data-exp-purposes: var(--data-exp-purposes, #3ba6ff);
    --poly-data-exp-companies: var(--data-exp-companies, #7ee8a2);
    --poly-data-exp-data-regions: var(--data-exp-data-regions, #edf2f7);

    /* Size */
    --poly-max-width: var(--max-width, 412px);
    --poly-line-height: var(--line-height, 120%);
    --poly-letter-spacing: var(--letter-spacing, -0.01em);

    /* Font */
    --poly-font-family-regular-name: var(--font-family-regular-name, "Jost");
    --poly-font-family-regular-url: var(
      --font-family-regular-url,
      url("public/fonts/jost_regular.ttf")
    );
    --poly-font-family-light-name: var(--font-family-light-name, "Jost Light");
    --poly-font-family-light-url: var(
      --font-family-light-url,
      url("public/fonts/jost_light.ttf")
    );
    --poly-font-family-medium-name: var(
      --font-family-medium-name,
      "Jost Medium"
    );
    --poly-font-family-medium-url: var(
      --font-family-medium-url,
      url("public/fonts/jost_medium.ttf")
    );
    --poly-font-family-poly-display-name: var(
      --font-family-poly-display-name,
      "polyDisplay"
    );
    --poly-font-family-poly-display-url: var(
      --font-family-poly-display-url,
      url("public/fonts/polydisplay_semi_1_0.otf")
    );

    /* Font sizes */
    --poly-headline-font-size: var(--headline-font-size, 38px);
    --poly-body-text-font-size: var(--body-text-font-size, 20px);
    --poly-button-font-size: var(--button-font-size, 18px);

    /* Font weight */
    --poly-font-weight-regular: var(--font-weight-regular, 400);
    --poly-font-weight-irrelevant: var(--font-weight-irrelevant, 200);
    --poly-font-weight-important: var(--font-weight-important, 800);
  }

  @font-face {
    font-family: var(--poly-font-family-regular-name);
    src: var(--poly-font-family-regular-url);
  }

  @font-face {
    font-family: var(--poly-font-family-light-name);
    src: var(--poly-font-family-light-url);
  }

  @font-face {
    font-family: var(--poly-font-family-medium-name);
    src: var(--poly-font-family-medium-url);
  }

  @font-face {
    font-family: var(--poly-font-family-poly-display-name);
    src: var(--poly-font-family-poly-display-url);
  }

  * {
    font-family: var(--poly-font-family-regular-name);
    font-weight: var(--poly-font-weight-regular);
    letter-spacing: var(--poly-letter-spacing);
    color: var(--poly-color-text-light);
  }
`;

export default globalTheme;
