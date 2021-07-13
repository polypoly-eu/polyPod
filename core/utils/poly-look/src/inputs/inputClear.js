import { html, LitElement } from "lit-element";
import globalTheme from "../globalTheme";

export class InputClear extends LitElement {
  static get styles() {
    return [globalTheme];
  }

  render() {
    return html`
      <div class="input-container">
        <input type="text" class="text-field" placeholder="text" />
        <button type="button" class="btn-clear">Clear</button>
      </div>
    `;
  }
}
