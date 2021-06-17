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
  text: "The polyPedia team and our associated researchers at future404 looked into everything the companies behind those apps below say about the topic (and even a little further)",
  backgroundImage: "public/images/Frame77.png",
};
