import { html, fixture, expect } from "@open-wc/testing";
import "../../poly-look.js";

describe("FirstCapitalize", () => {
  it(`
    has to render all the text that gets on the attribute
    paragraph
  `, async () => {
    const text = "This is a text for a test";

    const el = await fixture(html`
      <poly-first-capitalize .paragraph=${text}></poly-first-capitalize>
    `);

    const paragraph = el.shadowRoot.querySelector(".paragraph");
    expect(paragraph.textContent).to.equal(text);
  });
});
