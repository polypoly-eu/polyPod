import { LitElement } from "lit-element";
import { polyPrefix } from "../globalTheme";

const validateInnerHTML = innerDom =>
  RegExp(
    `^<${polyPrefix}-tab-content>.*</${polyPrefix}-tab-content>$`,
    "gms"
  ).test(innerDom);

const addTabId = (innerDom, tabId) =>
  innerDom.replace(
    RegExp(`<${polyPrefix}-tab-content`),
    `<${polyPrefix}-tab-content tabId="${tabId}"`
  );

const addAction = innerDom =>
  innerDom.replace(
    RegExp(`<${polyPrefix}-tab-content`),
    `<${polyPrefix}-tab-content active`
  );

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
        `Only <${polyPrefix}-tab-content> only tags are allowed and without any attribute`
      );
    }

    innerConent = addTabId(innerConent, this.tabId);
    if (this.active) {
      innerConent = addAction(innerConent);
    }

    const connectedEvent = new CustomEvent(`${polyPrefix}-tab-connected`, {
      detail: { innerContent: innerConent },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(connectedEvent);
  }
}
