import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import { polyTabs } from "../../../src/lit-components/constants";
import "../../../src/lit-components/tabs";

describe("TabHeader", () => {
  let label;
  let tabId;
  let theme;
  let active;

  beforeEach(() => {
    label = "tab test";
    tabId = "01";
    theme = polyTabs.themes.LIGHT;
    active = true;
  });

  it(`should throw an exception if the value of the theme is not valid`, (done) => {
    theme = "test";
    fixture(html`
      <poly-tab-header
        .label=${label}
        .tabId=${tabId}
        .active=${active}
        .theme=${theme}
      ></poly-tab-header>
    `)
      .then(() => {
        done.fail("It should fail");
      })
      .catch((error) => {
        expect(error.message).to.be.equal(
          "Wrong value in type property. Supported values are: dark and light"
        );
        done();
      });
  });

  it(`should get the dark theme as default`, async () => {
    const el = await fixture(html`
      <poly-tab-header
        .label=${label}
        .tabId=${tabId}
        .active=${active}
      ></poly-tab-header>
    `);

    expect(el.label).to.be.equal(label);
    expect(el.tabId).to.be.equal(tabId);
    expect(el.active).to.be.equal(active);
    expect(el.theme).to.be.equal(polyTabs.themes.DARK);
  });

  it(`should update the parameters values with the html attributes values`, async () => {
    const el = await fixture(html`
      <poly-tab-header
        .label=${label}
        .tabId=${tabId}
        .active=${active}
        .theme=${theme}
      ></poly-tab-header>
    `);

    expect(el.label).to.be.equal(label);
    expect(el.tabId).to.be.equal(tabId);
    expect(el.active).to.be.equal(active);
    expect(el.theme).to.be.equal(theme);
  });

  it(`should fire the event "poly-tab-click" when the poly-tab-header is clicked`, async () => {
    const el = await fixture(html`
      <poly-tab-header
        .label=${label}
        .tabId=${tabId}
        .active=${active}
        .theme=${theme}
      ></poly-tab-header>
    `);
    const listener = oneEvent(el, "poly-tab-click");

    el.shadowRoot.querySelector("button").click();
    const { detail } = await listener;

    expect(detail).to.be.deep.equal({ tabId });
  });
});
