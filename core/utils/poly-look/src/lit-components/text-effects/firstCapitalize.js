import { html, LitElement, css } from "lit-element";
import { globalTheme, polyPrefix } from "../globalTheme";
import { classMap } from "lit-html/directives/class-map";
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
      classes: { type: Object },
    };
  }

  constructor() {
    super();
    this.classes = {};
    this.classes[`${polyPrefix}-${this.constructor.name}`] = true;
  }

  render() {
    return html`<p class=${classMap(this.classes)}>${this.paragraph}</p>`;
  }
}
