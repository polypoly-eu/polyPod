import { html, LitElement, css } from "lit-element";
import globalTheme from "../globalTheme";

const tabRequiredAttributes = ["id", "label", "active"];

export class TabsLine extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .tabs-line {
          width: 100%;
          display: flex;
          align-items: flex-end;
        }

        .single-tab {
          width: 100%;
        }

        .tab-content {
          display: none;
          width: 100%;
          opacity: 0;
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
      tabs: { type: Array },
    };
  }

  __validateTabsFields(tabs) {
    return tabs.reduce((acc, tab) => {
      const keys = Object.keys(tab);

      return (
        acc &&
        keys.length > 2 &&
        keys.reduce(
          (acc2, key) => acc2 && tabRequiredAttributes.includes(key),
          true
        )
      );
    }, true);
  }

  __validateOnlyOneActive(tabs) {
    const actives =
      tabs.length > 0
        ? tabs.reduce((acc, tab) => (tab.active ? ++acc : acc), 0)
        : 1;

    return actives === 1;
  }

  set tabs(value) {
    if (!this.__validateTabsFields(value)) {
      throw new Error("Wrong tabs schema");
    }

    if (!this.__validateOnlyOneActive(value)) {
      throw new Error("One tab must be active but only one");
    }

    this._tabs = value.map(tab => ({ ...tab }));
    this.requestUpdate("tabs", value);
  }

  get tabs() {
    return this._tabs;
  }

  __activeTab(event) {
    this.tabs = this.tabs.map(tab => {
      const copyTab = { ...tab, active: false };
      if (tab.id === event.detail.value) {
        copyTab.active = true;
      }

      return copyTab;
    });
  }

  constructor() {
    super();

    this._tabs = [];
  }

  __renderTabsLine() {
    return this.tabs
      ? this.tabs.map(
          tab =>
            html`<poly-tab
              class="single-tab"
              .label=${tab.label}
              .value=${tab.id}
              .active=${tab.active}
              @poly-tab-selected=${this.__activeTab}
            ></poly-tab>`
        )
      : html``;
  }

  __renderTabsContent() {
    return this.tabs
      ? this.tabs.map(
          tab => html`<div class="tab-content ${tab.active ? "active" : ""}">
            <slot name="${tab.id}"></slot>
          </div>`
        )
      : html``;
  }

  render() {
    return html`
      <div class="tabs-line">${this.__renderTabsLine()}</div>
      ${this.__renderTabsContent()}
    `;
  }
}
