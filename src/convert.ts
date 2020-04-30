import * as RDF from "rdf-js";
import {DataFactory} from "rdf-js";
import {gens} from "./gen";
import fc from "fast-check";
import {assert} from "chai";

export function convert<T extends RDF.Term>(t: T, dataFactory: RDF.DataFactory<any>): T;
export function convert<InQuad extends RDF.BaseQuad, OutQuad extends RDF.BaseQuad>(quad: InQuad, dataFactory: RDF.DataFactory<InQuad, OutQuad>): OutQuad;

export function convert(input: RDF.BaseQuad | RDF.Term, dataFactory: RDF.DataFactory<any>): any {
    if ("termType" in input) {
        const term: RDF.Term = input;

        switch (term.termType) {
            case "BlankNode":
                return dataFactory.blankNode(term.value);
            case "DefaultGraph":
                return dataFactory.defaultGraph();
            case "Literal":
                return dataFactory.literal(term.value, term.language === "" ? term.datatype : term.language);
            case "NamedNode":
                return dataFactory.namedNode(term.value);
            case "Variable":
                if (dataFactory.variable)
                    return dataFactory.variable(term.value);
                else
                    throw new Error("Variables are not supported");
            default:
                throw new Error("Unknown term type");
        }
    }
    else {
        const quad: RDF.BaseQuad = input;

        return dataFactory.quad(
            convert(quad.subject, dataFactory),
            convert(quad.predicate, dataFactory),
            convert(quad.object, dataFactory),
            convert(quad.graph, dataFactory)
        );
    }
}

export class ConvertSpec<Q extends RDF.BaseQuad> {

    constructor(
        private readonly f1: DataFactory<Q>,
        private readonly f2: DataFactory<RDF.BaseQuad, Q>
    ) {}

    run(): void {
        const { term, quad } = gens(this.f1);

        it("Equal after conversion (term)", () => {
            fc.assert(fc.property(term, term => {
                const converted = convert(term, this.f2);
                assert.isTrue(term.equals(converted));
            }));
        });

        it("Equal after conversion (quad)", () => {
            fc.assert(fc.property(quad, quad => {
                const converted = convert(quad, this.f2);
                assert.isTrue(quad.equals(converted));
            }));
        });
    }

}