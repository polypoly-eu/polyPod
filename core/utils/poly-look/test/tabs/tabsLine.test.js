import { html, fixture, expect } from "@open-wc/testing";
import "../../src/tabs";

describe("TabsLine", () => {
  let tabs = [];

  beforeEach(() => {
    tabs = [
      {
        id: "tab01",
        label: "Tab 01",
        active: true,
      },
      {
        id: "tab02",
        label: "Tab 03",
        active: false,
      },
      {
        id: "tab03",
        label: "Tab 03",
        active: false,
      },
    ];
  });

  afterEach(() => {
    tabs = [];
  });
  it(`
    must to throw an exception if the input data does not have
    the required info (less attributes)
  `, () => {
    delete tabs[2].label;
    fixture(html` <poly-tabs-line .tabs=${tabs}></poly-tabs-line> `)
      .then(() => {
        // If the exception is not fired we must make the test fail
        expect(true).to.equal(false);
      })
      .catch(error => {
        expect(error.message).to.equal("Wrong tabs schema");
      });
  });

  it(`
    must to throw an exception if the input data does not have
    the required info (not required attribute)
  `, () => {
    delete tabs[2].label;
    tabs[2].fake = "fake attribute";
    fixture(html` <poly-tabs-line .tabs=${tabs}></poly-tabs-line> `)
      .then(() => {
        // If the exception is not fired we must make the test fail
        expect(true).to.equal(false);
      })
      .catch(error => {
        expect(error.message).to.equal("Wrong tabs schema");
      });
  });

  it(`
    must to throw an exception if there is more than one tab active 
    at the same time
  `, () => {
    tabs[1].active = true;
    fixture(html` <poly-tabs-line .tabs=${tabs}></poly-tabs-line> `)
      .then(() => {
        // If the exception is not fired we must make the test fail
        expect(true).to.equal(false);
      })
      .catch(error => {
        expect(error.message).to.equal("Just one tab should be active");
      });
  });

  it(`
    must to throw an exception if there is not one tab active
    by default
  `, () => {
    tabs[0].active = false;
    fixture(html` <poly-tabs-line .tabs=${tabs}></poly-tabs-line> `)
      .then(() => {
        // If the exception is not fired we must make the test fail
        expect(true).to.equal(false);
      })
      .catch(error => {
        expect(error.message).to.equal("Just one tab should be active");
      });
  });

  it(`
    must render three tabs with its content
  `, async () => {
    const lengTabs = tabs.length;
    const tab01Content = "this is the tab01";
    const tab02Content = "this is the tab02";
    const tab03Content = "this is the tab03";

    const el = await fixture(html`
      <poly-tabs-line .tabs=${tabs}>
        <div class="tab-slot" slot="tab01">${tab01Content}</div>
        <div class="tab-slot" slot="tab02">${tab02Content}</div>
        <div class="tab-slot" slot="tab03">${tab03Content}</div>
      </poly-tabs-line>
    `);

    expect(tabs).to.eql(el.tabs);

    const renderTabs = el.shadowRoot.querySelectorAll("poly-tab");
    expect(renderTabs.length).to.equal(3);

    for (let i = 0; i < lengTabs; i++) {
      expect(renderTabs[i].label).to.equal(tabs[i].label);
      expect(renderTabs[i].value).to.equal(tabs[i].id);
      expect(renderTabs[i].active).to.equal(tabs[i].active);
    }

    const tabsContentActive = el.shadowRoot.querySelectorAll(
      ".tab-content.active"
    );
    expect(tabsContentActive.length).to.equal(1);

    const tabsContent = el.shadowRoot.querySelectorAll(".tab-content");
    expect(tabsContent.length).to.equal(3);
  });

  it(`
    must change the active content if a tab is clicked
  `, async () => {
    const tab01Content = "this is the tab01";
    const tab02Content = "this is the tab02";
    const tab03Content = "this is the tab03";

    const el = await fixture(html`
      <poly-tabs-line .tabs=${tabs}>
        <div class="tab-slot" slot="tab01">${tab01Content}</div>
        <div class="tab-slot" slot="tab02">${tab02Content}</div>
        <div class="tab-slot" slot="tab03">${tab03Content}</div>
      </poly-tabs-line>
    `);

    const renderTabs = el.shadowRoot.querySelectorAll("poly-tab");
    renderTabs[1].shadowRoot.querySelector(".tab").click();

    expect(el.tabs[1].active).to.equal(true);
  });
});
