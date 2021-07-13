import { html } from "lit-element";
import "../src/inputs";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Atoms/InputClear",
  component: "poly-input-clear",
};

function Template() {
  return html`
    ${themeConfiguration()}
    <poly-input-clear></poly-input-clear>
  `;
}

export const Regular = Template.bind({});
