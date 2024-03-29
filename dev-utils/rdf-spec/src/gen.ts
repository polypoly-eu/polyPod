/**
 * [fast-check](https://github.com/dubzzz/fast-check/) generators for RDFJS entities. See [[gens]] for details.
 *
 * @packageDocumentation
 */

import fc, { Arbitrary } from "fast-check";
import * as RDFJS from "rdf-js";

/**
 * @interface Gens
 */
export interface Gens<Q extends RDFJS.BaseQuad = RDFJS.Quad> {
    namedNode: Arbitrary<RDFJS.NamedNode>;
    blankNode: Arbitrary<RDFJS.BlankNode>;
    literal: Arbitrary<RDFJS.Literal>;
    variable?: Arbitrary<RDFJS.Variable>;
    term: Arbitrary<Exclude<RDFJS.Term, RDFJS.BaseQuad>>;
    triple: Arbitrary<Q>;
    quad: Arbitrary<Q>;
}

/**
 * Creates random generators for RDFJS terms and quads based on a specified data factory.
 *
 * The generators adhere to the following rules:
 *
 * - named nodes contain web URLs
 * - blank nodes contain strings with hexadecimal digits (no anonymous blanks are generated, because that would be
 *   side-effecting)
 * - literals are hexadecimal strings with the datatype being left undefined or a named node
 * - variables are hexadecimal strings and are only generated if the data factory supports them
 *
 * @param {RDFJS.DataFactory<Q>} factory - specified data factory
 * @returns {Gens.<Q>} - A Gens object generated based on the factory

 */
export function gens<Q extends RDFJS.BaseQuad = RDFJS.Quad>(
    factory: RDFJS.DataFactory<Q>
): Gens<Q> {
    const namedNode = fc.webUrl().map((url) => factory.namedNode(url));

    const blankNode = fc.hexaString().map((id) => factory.blankNode(id));

    const literal = fc
        .tuple(fc.hexaString(), fc.oneof(fc.constant(undefined), namedNode))
        .map(([value, datatype]) => factory.literal(value, datatype));

    const variable = factory.variable
        ? // @ts-ignore factory.variable does exist if it's true
          fc.hexaString().map((id) => factory.variable(id))
        : undefined;

    const term = fc.oneof(namedNode, blankNode, literal);
    const subject = fc.oneof(namedNode, blankNode);
    const graph = fc.oneof(
        fc.constant(factory.defaultGraph()),
        namedNode,
        blankNode
    );

    const triple = fc
        .tuple(subject, namedNode, term)
        .map(([s, p, o]) => factory.quad(s, p, o));
    const quad = fc
        .tuple(subject, namedNode, term, graph)
        .map(([s, p, o, g]) => factory.quad(s, p, o, g));

    return {
        namedNode,
        blankNode,
        literal,
        variable,
        term,
        triple,
        quad,
    };
}
