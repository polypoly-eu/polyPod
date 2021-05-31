import { html, LitElement, css } from "lit-element";
import globalTheme from "../GlobalTheme";

export class FirstCapitalize extends LitElement {
  static get styles() {
    return [
      globalTheme,
      css`
        .first-letter {
          font-size: var(--poly-headline-font-size);
          text-transform: capitalize;
          float: right;
          position: absolute;
          top: 0px;
          font-weight: var(--poly-font-weight-important);
        }

        .text {
          text-indent: var(--poly-headline-font-size);
        }

        .text:first-line {
          line-height: 30px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      paragraph: { type: String },
    };
  }

  constructor() {
    super();
    this.__text = "";
    this.firstLetter = "";
  }

  set paragraph(value) {
    if (value) {
      this.__text = value.slice(1);
      this.__firstLetter = value.slice(0, 1);

      this.requestUpdate("paragraph", value);
    }
  }

  get paragraph() {
    return `${this.__firstLetter}${this.__text}`;
  }

  render() {
    return html`
      <div class="paragraph">
        <div class="first-letter">${this.__firstLetter}</div>
        <p class="text">${this.__text}</p>
      </div>
    `;
  }
}
