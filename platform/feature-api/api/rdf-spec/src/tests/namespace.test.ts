import { namespace } from "../namespace";
import DataFactory from "@rdfjs/data-model";
import assert from "assert";

describe("Namespace", () => {
  it("Namespace", () => {
    const ex = namespace("http://example.org/", DataFactory);
    assert.deepStrictEqual(ex.subject, DataFactory.namedNode("http://example.org/subject"));
    assert(ex.subject.equals(DataFactory.namedNode("http://example.org/subject")));
  });
});
