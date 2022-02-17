import { html, fixture, expect } from "@open-wc/testing";
import "../../src/text-effects";

describe("FirstCapitalize renders", () => {
  it(`has to render the text that gets on the attribute paragraph`, async () => {
    const text = "This is a text for a test";

    const el = await fixture(html`
      <poly-first-capitalize .paragraph=${text}></poly-first-capitalize>
    `);
    const paragraph = el.shadowRoot.querySelector(
      `.${Object.keys(el.classes)}`
    );
    expect(paragraph.textContent).to.equal(text);
  });
});
