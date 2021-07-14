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
    onPolyButtonClicked: {
      action: "polyButtonClicked",
    },
  },
};

function Template({
  type = "dark",
  size = "medium",
  disabled,
  onPolyButtonClicked,
}) {
  return html`
    ${themeConfiguration()}
    ${type === "light"
      ? html`<style>
          body {
            background-color: #0f1938;
          }
        </style>`
      : ""}
    <style>
      .button-area {
        width: 80%;
        padding-left: 32px;
        padding-right: 32px;
        padding-bottom: 32px;
        height: 200px;
      }
    </style>
    <div class="button-area">
      <poly-button
        .type=${type}
        .size=${size}
        .disabled=${disabled}
        @poly-button-clicked=${onPolyButtonClicked}
        >Example</poly-button
      >
    </div>
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
