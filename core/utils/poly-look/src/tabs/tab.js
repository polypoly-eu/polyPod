import { html, LitElement } from "lit-element";
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
    const connectedEvent = new CustomEvent("poly-tab-connected", {
      detail: { innerContent: this.innerHTML.trim() },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(connectedEvent);
  }

  redner() {
    return html``;
  }
}
