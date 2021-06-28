import { html, fixture, expect } from "@open-wc/testing";
import "../../src/tabs";

function testEvent(done, cb) {
  return function eventListener(event) {
    cb(event);
    done();
  };
}

describe("Tab", () => {
  it(`has to return its value when it is clicked`, done => {
    const label = "tab test";
    const value = "tabTest";
    const eventTester = testEvent(done, event => {
      expect(event.detail.value).to.equal(value);
    });
    fixture(html`
      <poly-tab
        @poly-tab-selected=${eventTester}
        .label=${label}
        .value=${value}
      ></poly-tab>
    `).then(el => {
      expect(el.label).to.equal(label);
      expect(el.value).to.equal(value);
      expect(el.active).to.equal(false);

      el.shadowRoot.querySelector(".tab").click();
    });
  });

  it(`has the class active if the flag active is true`, async () => {
    const label = "tab test";
    const value = "tabTest";
    const active = true;

    const el = await fixture(html`
      <poly-tab .label=${label} .value=${value} .active=${active}></poly-tab>
    `);

    expect(el.label).to.equal(label);
    expect(el.value).to.equal(value);
    expect(el.active).to.equal(active);

    const buttonActive = el.shadowRoot.querySelector(".tab.active");
    expect(buttonActive).to.not.null;
  });
});
