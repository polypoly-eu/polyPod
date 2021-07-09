import { html, LitElement, css } from "lit-element";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import globalTheme from "../globalTheme";
import { polyTabs } from "../constants";
import { listToStringReducer } from "../helpers";

const listOfTheme = Object.values(polyTabs.themes);

const validateTabTheme = value => listOfTheme.includes(value);

let __getTabContentBinded = null;

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
          align-items: flex-end;
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

    __getTabContentBinded = this.__getTabContent.bind(this);
  }

  __getTabContent(event) {
    this.tabContents = this.tabContents.concat(
      unsafeHTML(event.detail.innerContent)
    );
  }

  connectedCallback() {
    super.connectedCallback();

    for (const tab of this.children) {
      this.tabHeaders = this.tabHeaders.concat(tab);
    }

    document.addEventListener("poly-tab-connected", __getTabContentBinded);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("poly-tab-connected", __getTabContentBinded);
  }

  set theme(value) {
    if (!validateTabTheme(value)) {
      throw new Error(
        `Wrong value in type property. Supported values are: ${listOfTheme.reduce(
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

  __changeTab(event) {
    this.tabHeaders = this.tabHeaders.map(tabHeader => {
      tabHeader.active = tabHeader.tabId === event.detail.tabId;

      return tabHeader;
    });

    const tabContents = this.shadowRoot.querySelectorAll("poly-tab-content");

    for (const tabContent of tabContents) {
      tabContent.removeAttribute("active");
    }

    const tabActive = Array.from(tabContents).find(tabContent => {
      return tabContent.shadowRoot.querySelector(`#poly-${event.detail.tabId}`);
    });

    if (tabActive) {
      tabActive.setAttribute("active", true);
    }
  }

  render() {
    return html`<div class="tabs" @poly-tab-click=${this.__changeTab}>
      <div class="tabs-line">${this.__renderTabsLine()}</div>
      <div class="tabs-content">${this.tabContents}</div>
    </div>`;
  }
}
