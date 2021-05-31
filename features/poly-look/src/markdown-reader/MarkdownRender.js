import { html, LitElement, css } from "lit-element";
import "@intcreator/markdown-element";
import globalTheme from "../GlobalTheme";

export class MarkdownRender extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .decorator {
          height: 100vh;
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-position: center;
        }
      `,
    ];
  }

  static get properties() {
    return {
      text: { type: String },
      backgroundImage: {
        type: String,
        attribute: "background-image",
      },
    };
  }

  constructor() {
    super();

    this.backgroundImage = null;
  }

  render() {
    return this.backgroundImage
      ? html`
          <div
            class="decorator"
            style="background-image:url(${this.backgroundImage})"
          >
            <markdown-element
              class="mk-render"
              markdown=${this.text}
            ></markdown-element>
          </div>
        `
      : html`
          <markdown-element
            class="mk-render"
            markdown=${this.text}
          ></markdown-element>
        `;
  }
}
