import { html, LitElement, css } from "lit-element";
import globalTheme from "../globalTheme";
import { buttons } from "../constants";

export class Button extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .btn ::slotted(button) {
          border: var(--poly-button-border, solid transparent 0px);
          border-radius: var(--poly-button-border-radius, 4px);
          font-weight: var(--poly-button-font-weight, 500);
        }

        .btn.dark ::slotted(button) {
          background-color: var(
            --poly-button-background-dark,
            var(--poly-background-dark)
          );
          color: var(--poly-button-text-light, var(--poly-color-text-light));
        }

        .btn.dark.disabled ::slotted(button) {
          background-color: var(
            --poly-button-background-dark-disabled,
            rgba(0, 0, 0, 0.4)
          );
        }

        .btn.light ::slotted(button) {
          background-color: var(
            --poly-button-background-light,
            var(--poly-background-light)
          );
          color: var(--poly-button-text-dark, var(--poly-color-text-dark));
        }

        .btn.light.disabled ::slotted(button) {
          border: var(
            --poly-button-border-light-disabled,
            solid 1px rgba(0, 0, 0, 0.4)
          );
          color: var(--poly-button-text-dark-disabled, rgba(0, 0, 0, 0.4));
        }

        .btn.big ::slotted(button) {
          width: var(--poly-button-big-width, 328px);
          height: var(--poly-button-big-height, 56px);
          font-size: var(
            --poly-button-big-font-size,
            var(--poly-button-font-size)
          );
        }

        .btn.medium ::slotted(button) {
          width: var(--poly-button-medium-width, 296px);
          height: var(--poly-button-medium-height, 48px);
          font-size: var(
            --poly-button-medium-font-size,
            var(--poly-button-font-size)
          );
        }

        .btn.small ::slotted(button) {
          width: var(--poly-button-small-width, 90px);
          height: var(--poly-button-small-width, 32px);
          font-size: var(
            --poly-button-small-font-size,
            var(--poly-button-small-font-size)
          );
        }

        .btn.round ::slotted(button) {
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

  __validateButtonTypes(type) {
    const listOfValidTypes = Object.values(buttons.types);

    return listOfValidTypes.includes(type);
  }

  __validateButtonSizes(size) {
    const listOfValidSizes = Object.values(buttons.sizes);

    return listOfValidSizes.includes(size);
  }

  __listToString(acc, value, index, list) {
    return index === list.length - 1
      ? `${acc} and ${value}`
      : index === 0
      ? value
      : `${acc}, ${value}`;
  }

  constructor() {
    super();

    this.__type = buttons.types.DARK_BUTTON;
    this.__size = buttons.sizes.MEDIUM_BUTTON;
    this.disabled = false;
  }

  set type(value) {
    if (!this.__validateButtonTypes(value)) {
      throw new Error(
        `Wrong value in type property. Supported values are: ${Object.values(
          buttons.types
        ).reduce(this.__listToString, "")}`
      );
    }

    this.__type = value;
    this.requestUpdate("type", value);
  }

  get type() {
    return this.__type;
  }

  set size(value) {
    if (!this.__validateButtonSizes(value)) {
      throw new Error(
        `Wrong value in size property. Supported values are: ${Object.values(
          buttons.sizes
        ).reduce(this.__listToString, "")}`
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
        ? buttons.states.DISABLED
        : ""}"
    >
      <slot></slot>
    </span>`;
  }
}
