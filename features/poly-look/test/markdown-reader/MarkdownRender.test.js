import { html, fixture, expect } from "@open-wc/testing";
import "../../poly-look.js";

describe("MarkdownRender", () => {
  it(`
    have to use the markdown-element for the markdown text and render
    the rest of the custom tags
  `, async () => {
    const text =
      '# This is a test @@<poly-first-capitalize paragraph="example of paragraph"></<poly-first-capitalize>@@';

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
    have to render a background image if the attribute backgroundImage has 
  `, () => {});
});
