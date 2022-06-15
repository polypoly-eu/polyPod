import { html, LitElement, css } from "lit-element";
import { globalTheme, polyPrefix } from "../globalTheme";
import { polyTabs } from "../constants";
import { listToStringReducer } from "../../helpers";

const validThemes = Object.values(polyTabs.themes);

const validateTabTheme = (value) => validThemes.includes(value);

export class TabHeader extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        :host {
          width: 100%;
        }
        .tab {
          width: 100%;
          color: var(--poly-tab-color-medium, var(--poly-color-medium));
          font-size: var(--poly-tab-font-size, var(--poly-button-font-size));
          background-color: transparent;
          border: solid transparent 2px;
          text-align: center;
          cursor: pointer;
        }

        .tab:focus {
          outline: none;
        }

        .tab.dark {
          border-bottom: var(
            --poly-tab-border-dark,
            solid 1px var(--poly-tab-color-dark, var(--poly-color-dark))
          );
        }

        .tab.light {
          border-bottom: var(
            --poly-tab-border-light,
            solid 1px var(--poly-tab-color-light, var(--poly-color-light))
          );
        }

        .tab.active.dark {
          color: var(--poly-tab-color-dark, var(--poly-color-dark));
          border-bottom: var(
            --poly-tab-active-border-dark,
            solid 4px var(--poly-tab-color-dark, var(--poly-color-dark))
          );
        }

        .tab.active.light {
          color: var(--poly-tab-color-light, var(--poly-color-light));
          border-bottom: var(
            --poly-tab-active-border-light,
            solid 4px var(--poly-tab-color-light, var(--poly-color-light))
          );
        }
      `,
    ];
  }

  static get properties() {
    return {
      label: { type: String },
      tabId: { type: String },
      active: { type: Boolean },
      theme: { type: String },
    };
  }

  constructor() {
    super();
    this.__theme = polyTabs.themes.DARK;
  }

  set theme(value) {
    if (!validateTabTheme(value)) {
      throw new Error(
        `Wrong value in type property. Supported values are: ${validThemes.reduce(
          listToStringReducer,
          ""
        )}`
      );
    }

    this.__theme = value;
    this.requestUpdate("theme", value);
  }

  get theme() {
    return this.__theme;
  }

  __onTabClick() {
    const tabClickEvent = new CustomEvent(`${polyPrefix}-tab-click`, {
      detail: { tabId: this.tabId },
      composed: true,
      bubbles: true,
    });

    this.dispatchEvent(tabClickEvent);
  }

  render() {
    return html`<button
      class="tab ${this.theme} ${this.active ? "active" : ""}"
      @click=${this.__onTabClick}
    >
      ${this.label}
    </button>`;
  }
}
