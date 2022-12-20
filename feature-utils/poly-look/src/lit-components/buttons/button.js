import { html, LitElement, css } from "lit-element";
import { globalTheme } from "../globalTheme";
import { polyButton } from "../constants";
import { reduceListToString } from "../helpers";

const listOfValidTypes = Object.values(polyButton.types);
const listOfValidSizes = Object.values(polyButton.sizes);

const validateButtonTypes = (type) => listOfValidTypes.includes(type);
const validateButtonSizes = (size) => listOfValidSizes.includes(size);

export class Button extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .btn {
          border: var(--poly-button-border, solid transparent 0px);
          border-radius: var(--poly-button-border-radius, 4px);
          font-weight: var(--poly-button-font-weight, 500);
        }

        .btn.dark {
          background-color: var(
            --poly-button-background-dark,
            var(--poly-background-dark)
          );
          color: var(--poly-button-text-light, var(--poly-color-text-light));
        }

        .btn.dark.disabled {
          background-color: var(
            --poly-button-background-dark-disabled,
            rgba(0, 0, 0, 0.4)
          );
        }

        .btn.light {
          background-color: var(
            --poly-button-background-light,
            var(--poly-background-light)
          );
          color: var(--poly-button-text-dark, var(--poly-color-text-dark));
        }

        .btn.light.disabled {
          border: var(
            --poly-button-border-light-disabled,
            solid 1px rgba(0, 0, 0, 0.4)
          );
          color: var(--poly-button-text-dark-disabled, rgba(0, 0, 0, 0.4));
        }

        .btn.big {
          width: var(--poly-button-big-width, 100%);
          height: var(--poly-button-big-height, 56px);
          font-size: var(
            --poly-button-big-font-size,
            var(--poly-button-font-size)
          );
        }

        .btn.medium {
          width: var(--poly-button-medium-width, 100%);
          height: var(--poly-button-medium-height, 48px);
          font-size: var(
            --poly-button-medium-font-size,
            var(--poly-button-font-size)
          );
        }

        .btn.small {
          width: var(--poly-button-small-width, 90px);
          height: var(--poly-button-small-width, 32px);
          font-size: var(
            --poly-button-small-font-size,
            var(--poly-button-small-font-size)
          );
        }

        .btn.round {
          width: var(--poly-button-round-width, 174px);
          height: var(--poly-button-round-height, 32px);
          border-radius: var(--poly-button-round-border-radious, 16px);
          font-size: var(
            --poly-button-small-font-size,
            var(--poly-button-small-font-size)
          );
        }
      `,
    ];
  }

  static get properties() {
    return {
      type: { type: String },
      disabled: { type: Boolean },
      size: { type: String },
    };
  }

  constructor() {
    super();
    this._type = polyButton.types.DARK;
    this._size = polyButton.sizes.MEDIUM;
    this.disabled = false;
  }

  _onClick() {
    const buttonEvent = new CustomEvent("poly-button-clicked", {
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(buttonEvent);
  }

  set type(value) {
    if (!validateButtonTypes(value)) {
      throw new Error(
        `Wrong value in type property. Supported values are: ${Object.values(
          polyButton.types
        ).reduce(reduceListToString, "")}`
      );
    }

    this._type = value;
    this.requestUpdate("type", value);
  }

  get type() {
    return this._type;
  }

  set size(value) {
    if (!validateButtonSizes(value)) {
      throw new Error(
        `Wrong value in size property. Supported values are: ${Object.values(
          polyButton.sizes
        ).reduce(reduceListToString, "")}`
      );
    }

    this._size = value;
    this.requestUpdate("size", value);
  }

  get size() {
    return this._size;
  }

  render() {
    return html`<button
      type="button"
      class="btn ${this.size} ${this.type} ${this.disabled ? "disabled" : ""}"
      ?disabled=${!!this.disabled}
      @click=${this._onClick}
    >
      <slot></slot>
    </button>`;
  }
}
