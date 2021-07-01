import { html, fixture, expect } from "@open-wc/testing";
import "../../src/buttons";
import { buttons } from "../../src/constants";

describe("Button", () => {
  it(`should throw an exception if the size value isn't valid`, done => {
    const type = "dark";
    const disabled = false;
    const size = "test value";

    fixture(html`
      <poly-button .type=${type} .size=${size} .disabled=${disabled}>
        <button type="button">Example</button>
      </poly-button>
    `)
      .then(() => {
        done.fail("It should fail");
      })
      .catch(error => {
        expect(error.message).to.be.equal(
          "Wrong value in size property. Supported values are: big, medium, small and round"
        );
        done();
      });
  });

  it(`should throw an exception if the type value isn't valid`, done => {
    const type = "test value";
    const disabled = false;
    const size = "small";

    fixture(html`
      <poly-button .type=${type} .size=${size} .disabled=${disabled}>
        <button type="button">Example</button>
      </poly-button>
    `)
      .then(() => {
        done.fail("It should fail");
      })
      .catch(error => {
        expect(error.message).to.be.equal(
          "Wrong value in type property. Supported values are: dark and light"
        );
        done();
      });
  });

  it(`should configure a button with the default values if there is not any input parameter`, done => {
    fixture(html`
      <poly-button><button type="button">Example</button></poly-button>
    `)
      .then(el => {
        expect(el.type).to.be.equal(buttons.types.DARK_BUTTON);
        expect(el.size).to.be.equal(buttons.sizes.MEDIUM_BUTTON);
        expect(el.disabled).to.be.false;
        done();
      })
      .catch(() => {
        done.fail("It should not fail");
      });
  });

  it(`should update the configuration parameters if their values are valid`, done => {
    const type = "light";
    const disabled = true;
    const size = "small";

    fixture(html`
      <poly-button .type=${type} .disabled=${disabled} .size=${size}>
        <button type="button">Example</button>
      </poly-button>
    `)
      .then(el => {
        expect(el.type).to.be.equal(type);
        expect(el.size).to.be.equal(size);
        expect(el.disabled).to.be.true;
        done();
      })
      .catch(() => {
        done.fail("It should not fail");
      });
  });
});
