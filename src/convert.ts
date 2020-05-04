/**
 * Generic converter for RDF terms and quads. See [[convert]] for details.
 *
 * @packageDocumentation
 */

import * as RDF from "rdf-js";
import {DataFactory} from "rdf-js";
import {gens} from "./gen";
import fc from "fast-check";
import {assert} from "chai";

export function convert<T extends RDF.Term>(t: T, dataFactory: RDF.DataFactory<any>): T;
export function convert<InQuad extends RDF.BaseQuad, OutQuad extends RDF.BaseQuad>(quad: InQuad, dataFactory: RDF.DataFactory<InQuad, OutQuad>): OutQuad;

/**
 * This function converts an RDF term or a quad into another representation, specified by the given data factory.
 *
 * There are two overloads of this method; one for terms and another one for quads. It is guaranteed that – assuming
 * compliant factory implementations – the resulting object compares true with the input object using the `equals`
 * method. In code:
 *
 * ```javascript
 * const output = convert(input, factory);
 * assert.ok(output.equals(input));
 * ```
 *
 * Data factory implementers may want to check their implementation for cross-factory interoperability using
 * [[ConvertSpec]].
 */
export function convert(input: RDF.BaseQuad | RDF.Term, dataFactory: RDF.DataFactory<any>): any {
    if ("termType" in input) {
        const term: RDF.Term = input;

        switch (term.termType) {
            case "BlankNode":
                return dataFactory.blankNode(term.value);
            case "DefaultGraph":
                return dataFactory.defaultGraph();
            case "Literal":
                return dataFactory.literal(term.value, term.language === "" ? convert(term.datatype, dataFactory) : term.language);
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

/**
 * Class containing test cases for cross-factory interoperability of RDF terms and quads. Use [[ConvertSpec.run]] to
 * execute all tests.
 *
 * The test cases check that conversion from terms and quads from one factory into another factory preserves equality.
 * For that, [[gens]] is used with one data factory to create terms and quads. Those are then converted into a second
 * data factory using [[convert]].
 *
 * Tests in this class are written in the same style as [[DataFactorySpec]].
 */
export class ConvertSpec<Q extends RDF.BaseQuad> {

    /**
     * Create a new instance of the executable convert spec.
     * @param f1 the data factory _from which_ terms and quads are converted
     * @param f2 the data factory _into which_ terms and quads are converted
     */
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
