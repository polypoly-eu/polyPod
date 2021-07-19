import { html, LitElement } from "lit-element";

const validateInnerHTML = innerDom =>
  /^<poly-tab-content>.*<\/poly-tab-content>$/gms.test(innerDom);

const addTabId = (innerDom, tabId) =>
  innerDom.replace(/<poly-tab-content/, `<poly-tab-content tabId="${tabId}"`);

const addAction = innerDom =>
  innerDom.replace(/<poly-tab-content/, "<poly-tab-content active");

export class Tab extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      tabId: { type: String },
      active: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.active = false;
  }

  connectedCallback() {
    super.connectedCallback();
    let innerConent = this.innerHTML.trim();
    if (!validateInnerHTML(innerConent)) {
      throw new Error(
        "Only <poly-tab-content> only tags are allowed and without any attribute"
      );
    }

    innerConent = addTabId(innerConent, this.tabId);
    if (this.active) {
      innerConent = addAction(innerConent);
    }

    const connectedEvent = new CustomEvent("poly-tab-connected", {
      detail: { innerContent: innerConent },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(connectedEvent);
  }

  redner() {
    return html``;
  }
}
