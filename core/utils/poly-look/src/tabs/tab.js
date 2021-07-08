import { html, LitElement } from "lit-element";
export class Tab extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      tabId: { type: String },
      active: { type: Boolean },
      innerContent: { type: String },
    };
  }

  constructor() {
    super();
    this.active = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.innerContent = this.innerHTML.trim();
  }

  redner() {
    return html``;
  }
}
