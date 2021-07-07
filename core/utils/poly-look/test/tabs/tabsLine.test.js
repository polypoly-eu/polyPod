import { html, fixture, expect } from "@open-wc/testing";
import "../../src/tabs";
const TABS = [
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

describe("TabsLine", () => {
  let tabs;
  let el;

  before(async function () {
    let divs = [];
    for (let i = 0; i < TABS.length; i++) {
      divs[i] = `<div class="tab-slot" slot="tab0${i}">this is the tab0${i}`;
    }
    el = await fixture(html`
      <poly-tabs-line .tabs=${TABS}> ${divs.join("\n")} </poly-tabs-line>
    `);
  });

  beforeEach(() => {
    tabs = JSON.parse(JSON.stringify(TABS));
  });

  it(`
    must throw an exception if the input data does not have
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
        expect(error.message).to.equal("At most, one tab should be active");
      });
  });

  it(`
    must to throw an exception if one tab is not active by default
  `, () => {
    tabs[0].active = false;
    fixture(html` <poly-tabs-line .tabs=${tabs}></poly-tabs-line> `)
      .then(() => {
        // If the exception is not fired we must make the test fail
        expect(true).to.equal(false);
      })
      .catch(error => {
        expect(error.message).to.equal("At most, one tab should be active");
      });
  });

  it(`
    must render three tabs with its content
  `, async () => {
    const lengTabs = tabs.length;
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

  it("must change the active content if a tab is clicked", async () => {
    const renderTabs = el.shadowRoot.querySelectorAll("poly-tab");
    renderTabs[1].shadowRoot.querySelector(".tab").click();
    expect(el.tabs[1].active).to.equal(true);
  });
});
