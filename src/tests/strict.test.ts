import { DataFactorySpec } from "@polypoly-eu/rdf-spec";
import { DataFactory } from "../index";
import * as Foreign from "@rdfjs/data-model";

const dataFactory = new DataFactory(true);

describe("Spec", () => {
    new DataFactorySpec(dataFactory).run();
});

describe("Strict", () => {
    it("Rejects foreign terms (quad)", () => {
        const s = Foreign.namedNode("http://example.org/s");
        const p = Foreign.namedNode("http://example.org/p");
        const o = Foreign.namedNode("http://example.org/o");

        expect(() => dataFactory.quad(s, p, o)).toThrowError(/prototype/);
    });

    it("Rejects foreign terms (literal)", () => {
        const dt = Foreign.namedNode("http://example.org/t");

        expect(() => dataFactory.literal("hi", dt)).toThrowError(/prototype/);
    });

    it("Rejects ill-typed invocations", () => {
        expect(() => dataFactory.variable(null!)).toThrowError();
    });
});
