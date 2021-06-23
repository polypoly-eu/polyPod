import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../../poly-look.js";
import sinon from "sinon";

describe("MarkdownReader", () => {
  const fetchStub = sinon.stub(window, "fetch");

  afterEach(() => {
    fetchStub.reset();
  });

  it(`
    has to render the error message if the MarkdownRequester fired a poly-markdown-error
  `, async () => {
    const src = "/public/markdownFiles/test.md";
    const image = "/public/images/test.jpg";

    fetchStub.rejects(new Error());

    const el = await fixture(html`
      <poly-markdown-reader
        .src=${src}
        .backgroundImage=${image}
      ></poly-markdown-reader>
    `);

    const markdownRender = el.shadowRoot.querySelector("poly-markdown-render");
    const markdownRequester = el.shadowRoot.querySelector(
      "poly-markdown-requester"
    );

    await waitUntil(
      () => markdownRender.text,
      "The markdown text has not arrived"
    );

    expect(markdownRender.text).to.equal(
      "# Error: Could not render the document"
    );
    expect(markdownRender.backgroundImage).to.equal(image);
    expect(markdownRequester.src).to.equal(src);
  });

  it(`
    has to render the markdown text if the poly-markdown-requester
    fire an event poly-markdown-success
  `, async () => {
    const markdownFile = "# This is a test";
    const src = "/public/markdownFiles/test.md";
    const image = "/public/images/test.jpg";
    fetchStub.resolves({
      status: 200,
      text: () => Promise.resolve(markdownFile),
    });

    const el = await fixture(html`
      <poly-markdown-reader
        .src=${src}
        .backgroundImage=${image}
      ></poly-markdown-reader>
    `);

    const markdownRender = el.shadowRoot.querySelector("poly-markdown-render");
    const markdownRequester = el.shadowRoot.querySelector(
      "poly-markdown-requester"
    );

    await waitUntil(
      () => markdownRender.text,
      "The markdown text has not arrived"
    );

    expect(markdownRender.text.trim()).to.equal(markdownFile);
    expect(markdownRender.backgroundImage).to.equal(image);
    expect(markdownRequester.src).to.equal(src);
  });
});
