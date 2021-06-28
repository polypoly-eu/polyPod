import { html } from "lit-element";
import "../src/poly-look.js";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Atoms/Tab",
  component: "poly-tab",
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    active: { control: "boolean" },
    onPolyTabPressed: {
      action: "polyTabPressed",
    },
  },
};

function Template({
  label = "I'm a tab",
  value = "tabEvent",
  active = false,
  onPolyTabPressed,
}) {
  return html`
    ${themeConfiguration()}
    <poly-tab
      .label=${label}
      .value=${value}
      .active=${active}
      @poly-tab-selected=${onPolyTabPressed}
    ></poly-tab>
  `;
}

export const Regular = Template.bind({});
