/**
 * Generic converter for RDF terms and quads. See [[convert]] for details.
 *
 * @packageDocumentation
 */

import * as RDF from "rdf-js";

export function convert<T extends RDF.Term>(t: T, dataFactory: RDF.DataFactory<any>): T;
export function convert<InQuad extends RDF.BaseQuad, OutQuad extends RDF.BaseQuad>(
    quad: InQuad,
    dataFactory: RDF.DataFactory<InQuad, OutQuad>
): OutQuad;

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
 */
export function convert(input: RDF.BaseQuad | RDF.Term, dataFactory: RDF.DataFactory<any>): any {
    // @ts-ignore
    if ("termType" in input && input.termType !== "Quad") {
        const term: RDF.Term = input;

        switch (term.termType) {
            case "BlankNode":
                return dataFactory.blankNode(term.value);
            case "DefaultGraph":
                return dataFactory.defaultGraph();
            case "Literal":
                return dataFactory.literal(
                    term.value,
                    term.language === "" ? convert(term.datatype, dataFactory) : term.language
                );
            case "NamedNode":
                return dataFactory.namedNode(term.value);
            case "Variable":
                if (dataFactory.variable) return dataFactory.variable(term.value);
                else throw new Error("Variables are not supported");
            default:
                throw new Error("Unknown term type");
        }
    } else {
        const quad = input as RDF.BaseQuad;

        return dataFactory.quad(
            convert(quad.subject, dataFactory),
            convert(quad.predicate, dataFactory),
            convert(quad.object, dataFactory),
            convert(quad.graph, dataFactory)
        );
    }
}
