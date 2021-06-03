import { html } from "lit-element";
import "../poly-look.js";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Atoms/FirstCapitalize",
  component: "poly-first-capitalize",
  argTypes: {
    paragraph: { control: "text" },
  },
};

function Template({
  paragraph = `we all use messenger apps, all the time. We write about life, love, business and some of that is personal or even secret. So let's find out how safe the messengers are, how they make money, and how they treat our data privacy.`,
}) {
  return html`
    ${themeConfiguration()}
    <poly-first-capitalize .paragraph=${paragraph}></poly-first-capitalize>
  `;
}

export const Regular = Template.bind({});
