import { html } from "lit-element";
import "../src/tabs";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Molecule/Tabs",
  component: "poly-tabs",
  argTypes: {
    tabs: { control: "array" },
  },
};

function Template({
  tabs = [
    { id: "tab01", label: "tab 01", active: true },
    { id: "tab02", label: "tab 02", active: false },
    { id: "tab03", label: "tab 03", active: false },
  ],
}) {
  return html`
    ${themeConfiguration()}
    <poly-tabs .tabs=${tabs}>
      <div slot="tab01" style="color: black;"><h1>This is the tab 01</h1></div slot="tab01">
      <div slot="tab02" style="color: black;"><h1>This is the tab 02</h1></div slot="tab01">
      <div slot="tab03" style="color: black;"><h1>This is the tab 03</h1></div slot="tab01">
    </poly-tabs>
  `;
}

export const Regular = Template.bind({});
