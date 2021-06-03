import { html, LitElement, css } from "lit-element";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
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

  __renderMarkDown(text) {
    return html`
      <markdown-element class="mk-render" markdown=${text}></markdown-element>
    `;
  }

  __renderPolyCustomTags(text) {
    return html`${unsafeHTML(text)}`;
  }

  __renderArticle(text) {
    return text
      .split("@@")
      .map((pieceText, index) =>
        index % 2 === 0
          ? this.__renderMarkDown(pieceText)
          : this.__renderPolyCustomTags(pieceText)
      );
  }

  render() {
    return this.backgroundImage
      ? html`
          <div
            class="decorator"
            style="background-image:url(${this.backgroundImage})"
          >
            ${this.__renderArticle(this.text)}
          </div>
        `
      : html`${this.__renderArticle(this.text)}`;
  }
}
