import { html, fixture, expect } from "@open-wc/testing";
import "../../src/markdown-reader";

describe("MarkdownRender", () => {
  const text =
    '# This is a test @@<poly-first-capitalize paragraph="example of paragraph"></<poly-first-capitalize>@@';

  it(`
    have to use the markdown-element for the markdown text and render
    the rest of the custom tags
  `, async () => {
    const el = await fixture(
      html`<poly-markdown-render .text=${text}></poly-markdown-render>`
    );

    const markdownElement = el.shadowRoot.querySelector("markdown-element");
    const customTag = el.shadowRoot.querySelector("poly-first-capitalize");

    expect(markdownElement.attributes[1].value.trim()).to.equal(
      "# This is a test"
    );
    expect(customTag).not.to.null;
  });

  it(`
    have to render a background image if the attribute backgroundImage has value
  `, async () => {
    const image = "/public/image/test.jpg";
    const el = await fixture(
      html`<poly-markdown-render
        .text=${text}
        .backgroundImage=${image}
      ></poly-markdown-render>`
    );

    const imageBackground = el.shadowRoot.querySelector(".decorator");

    expect(imageBackground.attributes[1].value).to.equal(
      `background-image:url(${image})`
    );
  });
});
