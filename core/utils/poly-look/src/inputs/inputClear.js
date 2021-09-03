import { html, LitElement, css } from "lit-element";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { globalTheme, polyPrefix } from "../globalTheme";
import { polyInput } from "../constants";
import { reduceListToString } from "../helpers";
import clearSearchDark from "../static/images/icons/clear-search-dark.svg";
import clearSearchLight from "../static/images/icons/clear-search-light.svg";

const listOfValidTypes = Object.values(polyInput.types);

const validateInputTypes = (type) => listOfValidTypes.includes(type);

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
          border-radius: var(--poly-input-clear-border-radius, 20px);
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
    this._theme = polyInput.types.DARK;
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

    this._theme = value;
    this.requestUpdate("theme", value);
  }

  get theme() {
    return this._theme;
  }

  _onInputChange(event) {
    const value = event.target.value;
    const customInputEvent = new CustomEvent(`${polyPrefix}-input`, {
      detail: { inputValue: value },
      composed: true,
      bubbles: true,
    });

    this.activeClear = !!value;
    this.dispatchEvent(customInputEvent);
  }

  _clearInput() {
    const input = this.shadowRoot.querySelector(".text-field");
    input.value = "";
    this.activeClear = false;
  }

  _getButtonImage(imageLigth, imageDark) {
    return this.theme === polyInput.types.DARK
      ? unsafeHTML(imageDark)
      : unsafeHTML(imageLigth);
  }

  render() {
    return html`
      <div class="input-container ${this.theme}">
        <input
          type="text"
          class="text-field clear"
          placeholder=${this.placeHolder}
          @input=${this._onInputChange}
        />
        <button
          type="button"
          class="btn clear ${this.activeClear ? "active" : ""}"
          ?disabled=${!this.activeClear}
          @click=${this._clearInput}
        >
          ${this._getButtonImage(clearSearchLight, clearSearchDark)}
        </button>
      </div>
    `;
  }
}
