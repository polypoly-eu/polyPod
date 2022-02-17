import { html } from "lit-element";
import "../../src/lit-components/text-effects/";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Atoms/FirstCapitalize",
  component: "poly-first-capitalize",
  argTypes: {
    paragraph: { control: "text" },
  },
};

function Template({
  paragraph = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut sem lacinia erat vestibulum placerat ut id est. Phasellus maximus cursus nibh non commodo. Proin risus augue, volutpat sit amet imperdiet a, elementum tristique ipsum. Aenean condimentum dolor ac risus tincidunt, eu vehicula dolor ultricies. In id ullamcorper felis. Duis ultrices, nisi nec malesuada cursus, ex libero finibus ex, eget congue eros augue quis orci. Maecenas eget luctus leo. Donec feugiat elit nec mauris ullamcorper, nec feugiat nibh accumsan.`,
}) {
  return html`
    ${themeConfiguration()}
    <poly-first-capitalize .paragraph=${paragraph}></poly-first-capitalize>
  `;
}

export const Regular = Template.bind({});
