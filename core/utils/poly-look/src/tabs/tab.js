import { html, LitElement, css } from "lit-element";
import { polyPrefix, globalTheme } from "../globalTheme";

export class Tab extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .tab {
          width: 100%;
          color: var(--${polyPrefix}-color-medium);
          font-size: var(--${polyPrefix}-button-font-size);
          background-color: transparent;
          border: solid transparent 2px;
          border-bottom: solid 1px var(--${polyPrefix}-color-dark);
          text-align: center;
          cursor: pointer;
        }

        .tab:focus {
          outline: none;
        }

        .tab.active {
          color: var(--${polyPrefix}-color-dark);
          border-bottom: solid 4px var(--${polyPrefix}-color-dark);
        }
      `,
    ];
  }

  static get properties() {
    return {
      label: { type: String },
      value: { type: String },
      active: { type: Boolean },
    };
  }

  constructor() {
    super();

    this.active = false;
  }

  #onClick() {
    const tabEvent = new CustomEvent(`${polyPrefix}-tab-selected`, {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(tabEvent);
  }

  render() {
    return html`<button
      class="tab ${this.active ? "active" : ""}"
      @click=${this.#onClick}
    >
      ${this.label}
    </button> `;
  }
}
