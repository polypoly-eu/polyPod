import { html, LitElement, css } from "lit-element";
import globalTheme from "../globalTheme";
import { polyButton } from "../constants";

function validateButtonTypes(type) {
  const listOfValidTypes = Object.values(polyButton.types);

  return listOfValidTypes.includes(type);
}

function validateButtonSizes(size) {
  const listOfValidSizes = Object.values(polyButton.sizes);

  return listOfValidSizes.includes(size);
}

function listToString(acc, value, index, list) {
  return index === list.length - 1
    ? `${acc} and ${value}`
    : index === 0
    ? value
    : `${acc}, ${value}`;
}
export class Button extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .btn ::slotted(button) {
          border: var(--poly-button-border, solid transparent 0px) !important;
          border-radius: var(--poly-button-border-radius, 4px) !important;
          font-weight: var(--poly-button-font-weight, 500) !important;
        }

        .btn.dark ::slotted(button) {
          background-color: var(
            --poly-button-background-dark,
            var(--poly-background-dark)
          ) !important;
          color: var(
            --poly-button-text-light,
            var(--poly-color-text-light)
          ) !important;
        }

        .btn.dark.disabled ::slotted(button) {
          background-color: var(
            --poly-button-background-dark-disabled,
            rgba(0, 0, 0, 0.4)
          ) !important;
        }

        .btn.light ::slotted(button) {
          background-color: var(
            --poly-button-background-light,
            var(--poly-background-light)
          ) !important;
          color: var(
            --poly-button-text-dark,
            var(--poly-color-text-dark)
          ) !important;
        }

        .btn.light.disabled ::slotted(button) {
          border: var(
            --poly-button-border-light-disabled,
            solid 1px rgba(0, 0, 0, 0.4)
          ) !important;
          color: var(
            --poly-button-text-dark-disabled,
            rgba(0, 0, 0, 0.4)
          ) !important;
        }

        .btn.big ::slotted(button) {
          width: var(--poly-button-big-width, 100%) !important;
          height: var(--poly-button-big-height, 56px) !important;
          font-size: var(
            --poly-button-big-font-size,
            var(--poly-button-font-size)
          ) !important;
        }

        .btn.medium ::slotted(button) {
          width: var(--poly-button-medium-width, 100%) !important;
          height: var(--poly-button-medium-height, 48px) !important;
          font-size: var(
            --poly-button-medium-font-size,
            var(--poly-button-font-size)
          ) !important;
        }

        .btn.small ::slotted(button) {
          width: var(--poly-button-small-width, 90px) !important;
          height: var(--poly-button-small-width, 32px) !important;
          font-size: var(
            --poly-button-small-font-size,
            var(--poly-button-small-font-size)
          ) !important;
        }

        .btn.round ::slotted(button) {
          width: var(--poly-button-round-width, 174px) !important;
          height: var(--poly-button-round-height, 32px) !important;
          border-radius: var(
            --poly-button-round-border-radious,
            16px
          ) !important;
          font-size: var(
            --poly-button-small-font-size,
            var(--poly-button-small-font-size)
          ) !important;
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

    this.__type = polyButton.types.DARK;
    this.__size = polyButton.sizes.MEDIUM;
    this.disabled = false;
  }

  set type(value) {
    if (!validateButtonTypes(value)) {
      throw new Error(
        `Wrong value in type property. Supported values are: ${Object.values(
          polyButton.types
        ).reduce(listToString, "")}`
      );
    }

    this.__type = value;
    this.requestUpdate("type", value);
  }

  get type() {
    return this.__type;
  }

  set size(value) {
    if (!validateButtonSizes(value)) {
      throw new Error(
        `Wrong value in size property. Supported values are: ${Object.values(
          polyButton.sizes
        ).reduce(listToString, "")}`
      );
    }

    this.__size = value;
    this.requestUpdate("size", value);
  }

  get size() {
    return this.__size;
  }

  render() {
    return html`<span
      class="btn ${this.size} ${this.type} ${this.disabled
        ? polyButton.states.DISABLED
        : ""}"
    >
      <slot></slot>
    </span>`;
  }
}
