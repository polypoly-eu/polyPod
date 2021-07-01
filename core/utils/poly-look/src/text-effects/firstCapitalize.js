import { html, LitElement, css } from "lit-element";
import { globalTheme } from "../globalTheme";
export class FirstCapitalize extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        p::first-letter {
          float: left;
          font-size: 75px;
          line-height: 60px;
          padding: 3px;
          margin-top: -20px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      paragraph: { type: String },
    };
  }

  render() {
    return html`<p class="paragraph">${this.paragraph}</p>`;
  }
}
