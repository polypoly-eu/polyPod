/**
 * [fast-check](https://github.com/dubzzz/fast-check/) generators for RDFJS entities. See [[gens]] for details.
 *
 * @packageDocumentation
 */

import fc, { Arbitrary } from "fast-check";
import * as RDF from "rdf-js";

export interface Gens<Q extends RDF.BaseQuad = RDF.Quad> {
    namedNode: Arbitrary<RDF.NamedNode>;
    blankNode: Arbitrary<RDF.BlankNode>;
    literal: Arbitrary<RDF.Literal>;
    variable?: Arbitrary<RDF.Variable>;
    term: Arbitrary<Exclude<RDF.Term, RDF.BaseQuad>>;
    triple: Arbitrary<Q>;
    quad: Arbitrary<Q>;
}

/**
 * Creates generators for RDFJS terms and quads based on a specified data factory.
 *
 * The generators adhere to the following rules:
 *
 * - named nodes contain web URLs
 * - blank nodes contain strings with hexadecimal digits (no anonymous blanks are generated, because that would be
 *   side-effecting)
 * - literals are hexadecimal strings with the datatype being left undefined or a named node
 * - variables are hexadecimal strings and are only generated if the data factory supports them
 */
export function gens<Q extends RDF.BaseQuad = RDF.Quad>(factory: RDF.DataFactory<Q>): Gens<Q> {
    const namedNode = fc.webUrl().map((url) => factory.namedNode(url));

    const blankNode = fc.hexaString().map((id) => factory.blankNode(id));

    const literal = fc
        .tuple(fc.hexaString(), fc.oneof(fc.constant(undefined), namedNode))
        .map(([value, datatype]) => factory.literal(value, datatype));

    const variable = factory.variable
        ? // @ts-ignore factory.variable does exist if it's true
          fc.hexaString().map((id) => factory.variable(id))
        : undefined;

    const variables = variable ? [variable] : [];

    const term = fc.oneof(
        namedNode,
        blankNode,
        literal,
        fc.constant(factory.defaultGraph()),
        ...variables
    );

    const subject = fc.oneof(namedNode, blankNode, ...variables);
    const predicate = fc.oneof(namedNode, ...variables);
    const object = fc.oneof(namedNode, literal, blankNode, ...variables);
    const graph = fc.oneof(fc.constant(factory.defaultGraph()), namedNode, blankNode, ...variables);

    const triple = fc.tuple(subject, predicate, object).map(([s, p, o]) => factory.quad(s, p, o));
    const quad = fc
        .tuple(subject, predicate, object, graph)
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
