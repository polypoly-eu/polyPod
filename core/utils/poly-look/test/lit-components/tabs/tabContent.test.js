import { html, fixture, expect } from "@open-wc/testing";
import "../../src/tabs";

describe("TabContent", () => {
  it(`should have the active attribute set to false by default`, async () => {
    const el = await fixture(html`
      <poly-tab-content tabId="01">
        <h1>This is a test</h1>
      </poly-tab-content>
    `);

    expect(el.active).to.be.false;
    expect(el.tabId).to.be.equal("01");
  });

  it(`should get the values from the attributes active and tabId`, async () => {
    const el = await fixture(html`
      <poly-tab-content tabId="01" active>
        <h1>This is a test</h1>
      </poly-tab-content>
    `);

    expect(el.active).to.be.true;
    expect(el.tabId).to.be.equal("01");
  });
});
