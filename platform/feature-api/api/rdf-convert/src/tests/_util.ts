import * as RDF from "rdf-js";
import { DataFactory } from "rdf-js";
import { convert } from "../index";
import { gens } from "@polypoly-eu/rdf-spec";
import fc from "fast-check";
import RDFJS from "@rdfjs/data-model";
// @ts-ignore types not needed since it's going to be used from JS anyway
import Graphy from "@graphy/core.data.factory";
import { DataFactory as N3 } from "n3";

export const factories: Record<string, DataFactory> = {
    "@rdfjs/data-model": RDFJS,
    "@graphy/core.data.factory": Graphy,
    n3: N3,
};

export function convertSpec<Q extends RDF.BaseQuad>(
    f1: DataFactory<Q>,
    f2: DataFactory<RDF.BaseQuad, Q>
): void {
    const { term, quad } = gens(f1);

    it("Equal after conversion (term)", () => {
        fc.assert(
            fc.property(term, (term) => {
                const converted = convert(term, f2);
                expect(term.equals(converted)).toBe(true);
            })
        );
    });

    it("Equal after conversion (quad)", () => {
        fc.assert(
            fc.property(quad, (quad) => {
                const converted = convert(quad, f2);
                expect(quad.equals(converted)).toBe(true);
            })
        );
    });
}
