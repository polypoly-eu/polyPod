import { html } from "lit-element";
import "../src/tabs";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Atoms/TabHeader",
  component: "poly-tab-header",
  argTypes: {
    label: { control: "text" },
    tabId: { control: "text" },
    active: { control: "boolean" },
    theme: { control: "text" },
    onPolyTabClicked: {
      action: "polyTabClicked",
    },
  },
};

function Template({
  label = "Test tab",
  tabId = "01",
  active = false,
  theme = "dark",
  onPolyTabClicked,
}) {
  return html`
    ${themeConfiguration()}
    ${theme === "light"
      ? html` <style>
          body {
            background-color: #0f1938;
          }
        </style>`
      : ""}
    <poly-tab-header
      .label=${label}
      .tabId=${tabId}
      .active=${active}
      .theme=${theme}
      @poly-tab-click=${onPolyTabClicked}
    ></poly-tab-header>
  `;
}

export const Regular = Template.bind({});

export const DarkTab = Template.bind({});
DarkTab.args = {
  theme: "dark",
};

export const LightTab = Template.bind({});
LightTab.args = {
  theme: "light",
};
