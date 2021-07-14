import { html, LitElement, css } from "lit-element";
import globalTheme from "../globalTheme";
import { polyInput } from "../constants";
import { reduceListToString } from "../helpers";

const listOfValidTypes = Object.values(polyInput.types);

const validateInputTypes = type => listOfValidTypes.includes(type);

export class InputClear extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .input-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 40px;
          border-width: var(--poly-input-clear-border-width, 1px);
          border-style: var(--poly-input-clear-border-style, solid);
          border-radious: var(--poly-input-clear-border-radious, 20px);
          background-color: transparent;
        }

        .input-container.dark {
          border-color: var(
            --poly-input-clear-dark-color,
            var(--poly-color-dark)
          );
        }

        .input-container.light {
          border-color: var(
            --poly-input-clear-light-color,
            var(--poly-color-light)
          );
        }

        .clear {
          border: 0px solid transparent;
          background-color: transparent;
        }

        .text-field {
          font-family: var(
            --poly-input-clear-font-family,
            var(--poly-font-family-regular-name)
          );
          font-weight: var(--poly-input-clear-font-weight, 500);
          font-size: var(
            --poly-input-clear-font-size,
            var(--poly-button-font-size)
          );
        }

        .text-field:focus {
          outline: none;
        }

        .input-container.dark .text-field {
          color: var(--poly-input-clear-dark-color, var(--poly-color-dark));
        }

        .input-container.light .text-field {
          color: var(--poly-input-clear-light-color, var(--poly-color-light));
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="input-container">
        <input type="text" class="text-field clear" placeholder="text" />
        <button type="button" class="btn clear">
          <img src="public/icons/clear-search-dark.svg" alt="clear button" />
        </button>
      </div>
    `;
  }
}
