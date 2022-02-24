import { expect, oneEvent } from "@open-wc/testing";
import "../../../src/lit-components/tabs";

describe("Tab", () => {
  it(`should throw an exception if the content of the tab is different than a single tag of <poly-tab-content>`, (done) => {
    const innerContent = document.createElement("div");
    const innerText = document.createTextNode("This is a test");
    const tabComponent = document.createElement(`poly-tab`);
    innerContent.append(innerText);
    tabComponent.append(innerContent);

    try {
      tabComponent.connectedCallback();
      done.fail("This should fail");
    } catch (error) {
      expect(error.message).to.be.equal(
        "Only <poly-tab-content> tags without any attributes are allowed"
      );
      done();
    }
  });

  it(`should fire an event with the innerContent of the tab`, async () => {
    const tabId = "01";
    let innerContent = document.createElement("poly-tab-content");
    const innerText = document.createTextNode("This is a test");
    const tabComponent = document.createElement(`poly-tab`);
    tabComponent.tabId = tabId;
    tabComponent.active = true;
    innerContent.append(innerText);
    tabComponent.append(innerContent);

    const eventPromise = oneEvent(tabComponent, "poly-tab-connected");

    tabComponent.connectedCallback();
    const event = await eventPromise;

    expect(event.detail.innerContent).to.be.equal(
      `<poly-tab-content tabId="${tabId}" active="">This is a test</poly-tab-content>`
    );
  });
});
