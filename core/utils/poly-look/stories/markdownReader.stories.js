import { html } from "lit-element";
import "../poly-look.js";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Molecule/MarkdownReader",
  component: "poly-markdown-reader",
  argTypes: {
    src: { control: "text" },
    backgroundImage: { control: "text" },
    onPolyMarkdownError: {
      action: "markdownFail",
    },
  },
};

function Template({
  src = "public/markdownFiles/messagers-apps.md",
  backgroundImage = null,
  onPolyMarkdownError,
}) {
  return html`
    ${themeConfiguration()}
    <poly-markdown-reader
      .src=${src}
      .backgroundImage=${backgroundImage}
      @poly-markdown-error=${onPolyMarkdownError}
    ></poly-markdown-reader>
  `;
}

export const Regular = Template.bind({});

export const imageInBackground = Template.bind({});
imageInBackground.args = {
  src: "public/markdownFiles/messagers-apps-02.md",
  backgroundImage: "public/images/Frame77.png",
};

export const errorLoadingMarkdownFile = Template.bind({});
errorLoadingMarkdownFile.args = {
  src: "public/markdownFiles/fake.md",
};
