import { html, LitElement, css } from "lit-element";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import globalTheme from "../globalTheme";
import { polyTabs } from "../constants";
import { listToString } from "../helpers";

const listOfTheme = Object.values(polyTabs.themes);

function validateTabTheme(value) {
  return listOfTheme.includes(value);
}

export class Tabs extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .tabs {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .tabs-line {
          width: 100%;
          display: flex;
          justify-content: center;
          align_items: flex-end;
        }
      `,
    ];
  }

  static get properties() {
    return {
      tabHeaders: { type: Array },
      tabContents: { type: Array },
      theme: { type: String },
    };
  }

  constructor() {
    super();
    this.tabHeaders = [];
    this.tabContents = [];
    this.__theme = polyTabs.themes.DARK;
  }

  connectedCallback() {
    super.connectedCallback();

    for (const tab of this.children) {
      this.tabHeaders = this.tabHeaders.concat(tab);
      this.tabContents = this.tabContents.concat(unsafeHTML(tab.innerContent));
    }
  }

  set theme(value) {
    if (!validateTabTheme(value)) {
      throw new Error(
        `Wrong value in type property. Supported values are: ${listOfTheme.reduce(
          listToString,
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

  __renderTabsLine() {
    return this.tabHeaders.map(
      tab => html`
        <poly-tab-header
          .label=${tab.label}
          .tabId=${tab.tabId}
          .active=${tab.active}
          .theme=${this.theme}
        ></poly-tab-header>
      `
    );
  }
  render() {
    return html`<div class="tabs">
      <div class="tabs-line">${this.__renderTabsLine()}</div>
      <div class="tabs-content">${this.tabContents}</div>
    </div>`;
  }
}
