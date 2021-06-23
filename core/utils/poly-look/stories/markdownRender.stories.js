import { html } from "lit-element";
import "../poly-look.js";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Atoms/MarkdownRender",
  component: "poly-markdown-render",
  argTypes: {
    text: { control: "text" },
    backgroundImage: { control: "text" },
  },
};

function Template({
  text = "# This is an example of MarkDown",
  backgroundImage = null,
}) {
  return html`
    ${themeConfiguration()}
    <poly-markdown-render
      .text=${text}
      .backgroundImage=${backgroundImage}
    ></poly-markdown-render>
  `;
}

export const Regular = Template.bind({});

export const BackgroundImage = Template.bind({});
BackgroundImage.args = {
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut sem lacinia erat vestibulum placerat ut id est. Phasellus maximus cursus nibh non commodo. Proin risus augue, volutpat sit amet imperdiet a, elementum tristique ipsum. Aenean condimentum dolor ac risus tincidunt, eu vehicula dolor ultricies. In id ullamcorper felis. Duis ultrices, nisi nec malesuada cursus, ex libero finibus ex, eget congue eros augue quis orci. Maecenas eget luctus leo. Donec feugiat elit nec mauris ullamcorper, nec feugiat nibh accumsan.",
  backgroundImage: "public/images/Frame77.png",
};
