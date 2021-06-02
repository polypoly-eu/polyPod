import { LitElement, html } from "lit-element";
import globalTheme from "../GlobalTheme";

export class MarkdownReader extends LitElement {
  static get styles() {
    return [globalTheme];
  }

  static get properties() {
    return {
      src: { type: String },
      backgroundImage: { type: String, attribute: "background-image" },
      text: { type: String },
    };
  }

  constructor() {
    super();

    this.text = "";
    this.backgroundImage = null;
  }

  __onMarkdownSuccess(event) {
    this.text = event.detail.value;
  }

  __onMarkdownError() {
    this.text = "# Error: Could not render the document";
  }

  render() {
    return html`
      <poly-markdown-render
        .text=${this.text}
        .backgroundImage=${this.backgroundImage}
      ></poly-markdown-render>
      <poly-markdown-requester
        .src=${this.src}
        @poly-markdown-success=${this.__onMarkdownSuccess}
        @poly-markdown-error=${this.__onMarkdownError}
      ></poly-markdown-requester>
    `;
  }
}
