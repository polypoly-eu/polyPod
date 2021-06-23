import { LitElement, html } from "lit-element";

export class MarkdownRequester extends LitElement {
  static get properties() {
    return {
      src: { type: String },
    };
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    fetch(this.src, {
      method: "GET",
      headers: {
        "Content-Type": "text/markdown",
      },
    })
      .then(response => {
        return response
          .text()
          .then(text => ({ body: text, status: response.status }));
      })
      .then(content => {
        let event;
        if (content.status === 200) {
          event = new CustomEvent("poly-markdown-success", {
            detail: { value: content.body },
            bubbles: true,
            composed: true,
          });
        } else {
          event = new CustomEvent("poly-markdown-error", {
            detail: { value: { ...content } },
            bubbles: true,
            composed: true,
          });
        }

        this.dispatchEvent(event);
      })
      .catch(error => {
        const errorEvent = new CustomEvent("poly-markdown-error", {
          detail: { value: error.message || "Error in markdown request" },
          bubbles: true,
          composed: true,
        });

        this.dispatchEvent(errorEvent);
      });
  }

  render() {
    return html``;
  }
}
