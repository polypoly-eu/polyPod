import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import { polyTabs } from "../../src/constants";
import "../../src/tabs";

describe("Tabs", () => {
  let theme;
  let tabs;

  function createTabs(tabs) {
    return tabs.map(
      (tab) => html`
        <poly-tab .label=${tab.label} .tabId=${tab.tabId} .active=${tab.active}>
          <poly-tab-content>
            <div>This is the content of the tab ${tab.tabId}</div>
          </poly-tab-content>
        </poly-tab>
      `
    );
  }

  beforeEach(() => {
    theme = polyTabs.themes.LIGHT;
    tabs = [
      {
        label: "tab 01",
        tabId: "01",
        active: true,
      },
      {
        label: "tab 02",
        tabId: "02",
        active: false,
      },
      {
        label: "tab 03",
        tabId: "03",
        active: false,
      },
    ];
  });

  it(`should build the tabHeads line`, async () => {
    const el = await fixture(html`<poly-tabs>${createTabs(tabs)}</poly-tabs>`);
    const tabHeaders = Array.from(
      el.shadowRoot.querySelectorAll("poly-tab-header")
    );

    const leng = tabs.length;

    expect(tabHeaders).not.to.be.undefined;
    expect(tabHeaders.length).to.be.equal(leng);

    for (let i = 0; i < leng; i++) {
      expect(tabHeaders[i].label).to.be.equal(tabs[i].label);
      expect(tabHeaders[i].tabId).to.be.equal(tabs[i].tabId);
      expect(tabHeaders[i].active).to.be.equal(tabs[i].active);
      expect(tabHeaders[i].theme).to.be.equal(polyTabs.themes.DARK);
    }
  });

  it(`should get the theme value from the html attribute`, async () => {
    const el = await fixture(
      html`<poly-tabs .theme=${theme}>${createTabs(tabs)}</poly-tabs>`
    );

    const tabHeaders = Array.from(
      el.shadowRoot.querySelector("poly-tab-header")
    );

    expect(tabHeaders.find((tabHeader) => tabHeader.theme !== theme)).to.be
      .undefined;
  });

  it(`should update the tab selected if another tab is clicked`, async () => {
    const el = await fixture(html`<poly-tabs>${createTabs(tabs)}</poly-tabs>`);
    const tabHeaders = Array.from(
      el.shadowRoot.querySelectorAll("poly-tab-header")
    );
    const tabHeaderNotSelected = tabHeaders.find((tab) => !tab.active);

    tabHeaderNotSelected.shadowRoot.querySelector("button").click();
    await waitUntil(() => tabHeaderNotSelected.active);
    const tabsSelected = tabHeaders.filter((tab) => tab.active);

    expect(tabsSelected.length).to.be.equal(1);
    expect(tabHeaderNotSelected.active).to.be.true;
  });
});
