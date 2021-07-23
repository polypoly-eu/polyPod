import { html, LitElement, css } from "lit-element";
import { globalTheme } from "../globalTheme";

export class TabContent extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .tab-content {
          opacity: 0;
          display: none;
          width: 100%;
        }

        @keyframes fadeInTab {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .tab-content.active {
          display: block;
          opacity: 1;
          animation-name: fadeInTab;
          animation-timing-function: ease-in;
          animation-duration: 0.5s;
          animation-iteration-count: 1;
        }
      `,
    ];
  }

  static get properties() {
    return {
      active: { type: Boolean },
      tabId: { type: String },
    };
  }

  constructor() {
    super();
    this.active = false;
  }

  render() {
    return html`
      <div
        id="poly-${this.tabId}"
        class="tab-content ${this.active ? "active" : ""}"
      >
        <slot></slot>
      </div>
    `;
  }
}
