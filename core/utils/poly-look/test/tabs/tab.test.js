import { defineCE, expect, oneEvent } from "@open-wc/testing";
import { Tab } from "../../src/tabs/tab";

describe("Tab", () => {
  it(`should fire an event with its content once it's connected`, async () => {
    const tabCreated = defineCE(Tab);
    const innerContent = document.createElement("div");
    const innerText = document.createTextNode("This is a test");
    const tabComponent = document.createElement(`${tabCreated}`);
    innerContent.append(innerText);
    tabComponent.append(innerContent);

    setTimeout(() => {
      tabComponent.connectedCallback();
    });

    const event = await oneEvent(tabComponent, "poly-tab-connected");
    expect(event.detail.innerContent).to.be.equal("<div>This is a test</div>");
  });
});
