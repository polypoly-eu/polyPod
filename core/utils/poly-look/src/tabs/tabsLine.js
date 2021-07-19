import { html, LitElement, css } from "lit-element";
import { globalTheme } from "../globalTheme";

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

  constructor() {
    super();
    this._tabs = [];
  }

  _validateTabsFields(tabs) {
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

  _validateOnlyOneActive(tabs) {
    return tabs.reduce((acc, tab) => (tab.active ? ++acc : acc), 0) === 1;
  }

  set tabs(value) {
    if (value.length <= 0) {
      throw new Error("There are no tabs");
    }

    if (!this._validateTabsFields(value)) {
      throw new Error("Wrong tabs schema");
    }

    if (!this._validateOnlyOneActive(value)) {
      throw new Error("At most, one tab should be active");
    }

    this._tabs = value.map(tab => ({ ...tab }));
    this.requestUpdate("tabs", value);
  }

  get tabs() {
    return this._tabs;
  }

  _activeTab(event) {
    this.tabs = this.tabs.map(tab => {
      const copyTab = { ...tab, active: false };
      if (tab.id === event.detail.value) {
        copyTab.active = true;
      }

      return copyTab;
    });
  }

  render() {
    return html`
      <div class="tabs-line">
        ${this.tabs.map(tab => {
          return html`<poly-tab
            class="single-tab"
            .label="${tab.label}"
            .value="${tab.id}"
            .active="${tab.active}"
            @poly-tab-selected=${this._activeTab}
          >
          </poly-tab>`;
        })}
      </div>
      ${this.tabs.map(
        tab => html`<div class="tab-content ${tab.active ? "active" : ""}">
          <slot name="${tab.id}"></slot>
        </div>`
      )}
    `;
  }
}
