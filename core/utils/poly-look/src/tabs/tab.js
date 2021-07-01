import { html, LitElement, css, unsafeCSS } from "lit-element";
import { PREFIX, globalTheme } from "../globalTheme";

export class Tab extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .tab {
          width: 100%;
          color: var(--${unsafeCSS(PREFIX)}-color-medium);
          font-size: var(--${unsafeCSS(PREFIX)}-button-font-size);
          background-color: transparent;
          border: solid transparent 2px;
          border-bottom: solid 1px var(--${unsafeCSS(PREFIX)}-color-dark);
          text-align: center;
          cursor: pointer;
        }

        .tab:focus {
          outline: none;
        }

        .tab.active {
          color: var(--${unsafeCSS(PREFIX)}-color-dark);
          border-bottom: solid 4px var(--${unsafeCSS(PREFIX)}-color-dark);
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

  __onClick() {
    const tabEvent = new CustomEvent(`${PREFIX}-tab-selected`, {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(tabEvent);
  }

  render() {
    return html`<button
      class="tab ${this.active ? "active" : ""}"
      @click=${this.__onClick}
    >
      ${this.label}
    </button> `;
  }
}
