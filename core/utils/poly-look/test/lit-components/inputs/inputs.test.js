import { html, fixture, expect, oneEvent, waitUntil } from "@open-wc/testing";
import "../../src/inputs";
import { polyInput } from "../../src/constants";

describe("Clear input", () => {
  it(`should throw an exception if the theme has an invalid value`, (done) => {
    const theme = "This is a test";
    const placeHolder = "Test placeHolder";

    fixture(html`
      <poly-input-clear
        .theme=${theme}
        .placeHoler=${placeHolder}
      ></poly-input-clear>
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

  it(`should get the properties from the attributes values`, async () => {
    const theme = polyInput.types.LIGHT;
    const placeHolder = "This is a test";

    const el = await fixture(html`
      <poly-input-clear
        .theme=${theme}
        .placeHolder=${placeHolder}
      ></poly-input-clear>
    `);

    expect(el.theme).to.be.equal(theme);
    expect(el.placeHolder).to.be.equal(placeHolder);
  });

  it(`should show the button if the input has some value and the event input is fired`, async () => {
    const theme = polyInput.types.LIGHT;
    const placeHolder = "This is a test";
    const inputValue = "Text inside the input";

    const el = await fixture(html`
      <poly-input-clear
        .theme=${theme}
        .placeHolder=${placeHolder}
      ></poly-input-clear>
    `);

    const listener = oneEvent(el, "poly-input");
    const inputEvent = new CustomEvent("input", {
      composed: true,
      bubbles: true,
    });
    const innerInput = el.shadowRoot.querySelector("input");
    innerInput.value = inputValue;
    innerInput.dispatchEvent(inputEvent);

    const { detail } = await listener;
    const button = el.shadowRoot.querySelector("button");
    await waitUntil(() => el.activeClear);
    expect(detail.inputValue).to.be.equal(inputValue);
    expect(innerInput.value).to.be.equal(inputValue);
    expect(button.classList.contains("active")).to.be.true;
    expect(button.disabled).to.be.false;
  });

  it(`should disable the button if the input is empty and the event input is fired`, async () => {
    const theme = polyInput.types.LIGHT;
    const placeHolder = "This is a test";

    const el = await fixture(html`
      <poly-input-clear
        .theme=${theme}
        .placeHolder=${placeHolder}
      ></poly-input-clear>
    `);

    const listener = oneEvent(el, "poly-input");
    const inputEvent = new CustomEvent("input", {
      composed: true,
      bubbles: true,
    });
    const innerInput = el.shadowRoot.querySelector("input");
    innerInput.value = "";
    innerInput.dispatchEvent(inputEvent);

    const { detail } = await listener;
    const button = el.shadowRoot.querySelector("button");

    await waitUntil(() => !el.activeClear);

    expect(detail.inputValue).to.be.equal("");
    expect(button.classList.contains("active")).to.be.false;
    expect(button.disabled).to.be.true;
  });

  it(`should clear the input value and disable the button if the user clicks the button`, async () => {
    const theme = polyInput.types.LIGHT;
    const placeHolder = "This is a test";

    const el = await fixture(html`
      <poly-input-clear
        .theme=${theme}
        .placeHolder=${placeHolder}
      ></poly-input-clear>
    `);

    const innerInput = el.shadowRoot.querySelector("input");
    const inputEvent = new CustomEvent("input", {
      composed: true,
      bubbles: true,
    });
    innerInput.value = "Test";
    innerInput.dispatchEvent(inputEvent);
    await waitUntil(() => el.activeClear);

    const button = el.shadowRoot.querySelector("button");
    button.click();

    await waitUntil(() => !el.activeClear);

    expect(innerInput.value).to.be.equal("");
    expect(button.classList.contains("active")).to.be.false;
    expect(button.disabled).to.be.true;
  });
});
