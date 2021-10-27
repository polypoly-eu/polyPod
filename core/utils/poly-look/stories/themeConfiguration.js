import { html } from "lit-element";

export function themeConfiguration() {
  return html`
    <style>
      @font-face {
        font-family: "Jost Light";
        src: url("public/fonts/jost_light.ttf");
      }

      @font-face {
        font-family: "Jost Medium";
        src: url("public/fonts/jost_medium.ttf");
      }

      @font-face {
        font-family: "polyDisplay";
        src: url("public/fonts/jost_medium.ttf");
      }

      @font-face {
        font-family: "Jost";
        src: url("public/fonts/jost_regular.ttf");
      }

      * {
        font-family: var(--poly-font-family-regular-name);
        font-weight: var(--poly-font-weight-regular);
        letter-spacing: var(--poly-letter-spacing);
        color: var(--poly-color-text-dark);
      }
    </style>
  `;
}
