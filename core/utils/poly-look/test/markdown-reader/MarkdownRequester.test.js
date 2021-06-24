import { html, fixture, expect } from "@open-wc/testing";
import "../../src/markdown-reader";
import sinon from "sinon";

function testEvent(done, cb) {
  return function eventListener(event) {
    cb(event);
    done();
  };
}
describe("MarkdownRequester", () => {
  const fetchStub = sinon.stub(window, "fetch");

  afterEach(() => {
    fetchStub.reset();
  });

  it(`
    has to fired an event poly-markdown-error with 
    the message "Error in markdown request" if the error
    does not have any message`, done => {
    fetchStub.rejects(new Error());
    const eventTester = testEvent(done, event => {
      expect(event.detail.value).to.equal("Error in markdown request");
    });
    const src = "/public/test/path";

    fixture(html`<poly-markdown-requester
      .src=${src}
      @poly-markdown-error=${eventTester}
    ></poly-markdown-requester>`);
  });

  it(`
    has to fired an event poly-markdown-error with the error
    message
  `, done => {
    const errorMsg = "This is a error test";
    const eventTester = testEvent(done, event => {
      expect(event.detail.value).to.equal(errorMsg);
    });
    const src = "/public/test/path";

    fetchStub.rejects(new Error(errorMsg));

    fixture(html`<poly-markdown-requester
      .src=${src}
      @poly-markdown-error=${eventTester}
    ></poly-markdown-requester>`);
  });

  it(`
    has to fired an event poly-markdown-error if the http response
    has a code different than 200
  `, done => {
    const errorMsg = "Bad request";
    const response = {
      status: 400,
      text: () => Promise.resolve(errorMsg),
    };
    const eventTester = testEvent(done, event => {
      expect(event.detail.value).to.deep.equal({
        body: errorMsg,
        status: response.status,
      });
    });
    const src = "/public/test/path";
    fetchStub.resolves(response);

    fixture(html`
      <poly-markdown-requester
        .src=${src}
        @poly-markdown-error=${eventTester}
      ></poly-markdown-requester>
    `);
  });

  it(`
    has to fired an event poly-markdown-success with the markdown
    content of the file
  `, done => {
    const markdownFile = "# This is a test";
    const response = {
      status: 200,
      text: () => Promise.resolve(markdownFile),
    };
    const eventTester = testEvent(done, event => {
      expect(event.detail.value).to.equal(markdownFile);
    });
    const src = "/public/test/path";

    fetchStub.resolves(response);

    fixture(html`
      <poly-markdown-requester
        .src=${src}
        @poly-markdown-success=${eventTester}
      ></poly-markdown-requester>
    `);
  });
});
