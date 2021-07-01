import { html } from "lit-element";
import "../src/buttons";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Atoms/Button",
  component: "poly-button",
  argTypes: {
    type: { control: "text" },
    size: { control: "text" },
    disabled: { control: "boolean" },
  },
};

function Template({ type = "dark", size = "medium", disabled }) {
  return html`
    ${themeConfiguration()}
    ${type === "light"
      ? html`<style>
          body {
            background-color: #0f1938;
          }
        </style>`
      : ""}
    <poly-button .type=${type} .size=${size} .disabled=${disabled}
      ><button type="button">Example</button></poly-button
    >
  `;
}

export const Regular = Template.bind({});

export const DarkSmall = Template.bind({});
DarkSmall.args = {
  type: "dark",
  size: "small",
};

export const DarkMedium = Template.bind({});
DarkMedium.args = {
  type: "dark",
  size: "medium",
};

export const DarkBig = Template.bind({});
DarkBig.args = {
  type: "dark",
  size: "big",
};

export const DarkRounded = Template.bind({});
DarkRounded.args = {
  type: "dark",
  size: "round",
};

export const LightSmall = Template.bind({});
LightSmall.args = {
  type: "light",
  size: "small",
};

export const LightMedium = Template.bind({});
LightMedium.args = {
  type: "light",
  size: "medium",
};

export const LightBig = Template.bind({});
LightBig.args = {
  type: "light",
  size: "big",
};

export const LightRounded = Template.bind({});
LightRounded.args = {
  type: "light",
  size: "round",
};
