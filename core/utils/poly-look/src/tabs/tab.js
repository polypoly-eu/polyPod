import { LitElement } from "lit-element";
import { polyPrefix } from "../globalTheme";

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

  _findTabContent() {
    const child = this.children.length === 1 ? this.children[0] : null;
    if (
      child?.nodeName?.toLowerCase() !== `${polyPrefix}-tab-content` ||
      child.attributes.length > 0
    ) {
      throw new Error(
        `Only <${polyPrefix}-tab-content> tags without any attributes are allowed`
      );
    }
    return child;
  }

  connectedCallback() {
    super.connectedCallback();

    const tabContent = this._findTabContent();
    // setAttributeNS retains character case in attribute names
    tabContent.setAttributeNS(null, "tabId", this.tabId);
    if (this.active) {
      tabContent.setAttribute("active", "");
    }

    const connectedEvent = new CustomEvent(`${polyPrefix}-tab-connected`, {
      detail: { innerContent: this.innerHTML },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(connectedEvent);
  }
}
