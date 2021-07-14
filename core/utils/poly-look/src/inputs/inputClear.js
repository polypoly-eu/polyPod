import { html, LitElement, css } from "lit-element";
import { globalTheme, polyPrefix } from "../globalTheme";
import { polyInput } from "../constants";
import { reduceListToString } from "../helpers";

const listOfValidTypes = Object.values(polyInput.types);

const validateInputTypes = type => listOfValidTypes.includes(type);

export class InputClear extends LitElement {
  #theme = polyInput.types.DARK;

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
          border-radius: var(--poly-input-clear-border-radious, 20px);
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
          width: 100%;
          margin-left: 23px;
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

        .input-container.light .text-field::placeholder {
          opacity: 0.7;
          color: var(--poly-input-clear-light-color, var(--poly-color-light));
        }

        .input-container.light .text-field {
          color: var(--poly-input-clear-light-color, var(--poly-color-light));
        }

        @keyframes fadeInClearButton {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .btn {
          margin-right: 9px;
          opacity: 0;
        }

        .btn.active {
          opacity: 1;
          animation-name: fadeInClearButton;
          animation-timing-function: ease-in;
          animation-duration: 0.25s;
        }
      `,
    ];
  }

  static get properties() {
    return {
      theme: { type: String },
      placeHolder: { type: String },
      activeClear: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.activeClear = false;
  }

  set theme(value) {
    if (!validateInputTypes(value)) {
      throw new Error(
        `Wrong value in type property. Supported values are: ${listOfValidTypes.reduce(
          reduceListToString,
          ""
        )}`
      );
    }

    this.#theme = value;
    this.requestUpdate("theme", value);
  }

  get theme() {
    return this.#theme;
  }

  #onInputChange(event) {
    const value = event.target.value;
    const customInputEvent = new CustomEvent(`${polyPrefix}-input`, {
      detail: { inputValue: value },
      composed: true,
      bubbles: true,
    });

    this.activeClear = !!value;
    this.dispatchEvent(customInputEvent);
  }

  #clearInput() {
    const input = this.shadowRoot.querySelector(".text-field");
    input.value = "";
    this.activeClear = false;
  }

  render() {
    return html`
      <div class="input-container ${this.theme}">
        <input
          type="text"
          class="text-field clear"
          placeholder=${this.placeHolder}
          @input=${this.#onInputChange}
        />
        <button
          type="button"
          class="btn clear ${this.activeClear ? "active" : ""}"
          ?disabled=${!this.activeClear}
          @click=${this.#clearInput}
        >
          <img
            src="public/icons/clear-search-${this.theme}.svg"
            alt="clear button"
          />
        </button>
      </div>
    `;
  }
}
