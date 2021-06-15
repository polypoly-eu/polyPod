import { html } from "lit-element";
import "../poly-look.js";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Data/MarkdownRequester",
  component: "poly-markdown-requester",
  argTypes: {
    src: { control: "text" },
    onPolyMarkdownSuccess: {
      action: "markdownObtained",
    },
    onPolyMarkdownError: {
      action: "markdownFail",
    },
  },
};

function Template({
  src = "public/markdownFiles/messenger-apps.md",
  onPolyMarkdownSuccess,
  onPolyMarkdownError,
}) {
  return html`
    ${themeConfiguration()}
    <poly-markdown-requester
      .src=${src}
      @poly-markdown-success=${onPolyMarkdownSuccess}
      @poly-markdown-error=${onPolyMarkdownError}
    ></poly-markdown-requester>
  `;
}

export const Regular = Template.bind({});

export const ErrorExample = Template.bind({});
ErrorExample.args = {
  src: "public/markdownFile/fake.md",
};
