import fc, {Arbitrary} from "fast-check";
import * as RDF from "rdf-js";

export interface Gens<Q extends RDF.BaseQuad = RDF.Quad> {
    namedNode: Arbitrary<RDF.NamedNode>;
    blankNode: Arbitrary<RDF.BlankNode>;
    literal: Arbitrary<RDF.Literal>;
    variable?: Arbitrary<RDF.Variable>;
    triple: Arbitrary<Q>;
    quad: Arbitrary<Q>;
}

export function gens<Q extends RDF.BaseQuad = RDF.Quad>(factory: RDF.DataFactory<Q>): Gens<Q> {
    const namedNode = fc.webUrl().map(url => factory.namedNode(url));

    const blankNode = fc.hexaString().map(id => factory.blankNode(id));

    const literal =
        fc.tuple(fc.hexaString(), fc.oneof(fc.constant(undefined), namedNode))
            .map(([value, datatype]) => factory.literal(value, datatype));

    const variable =
        factory.variable ?
            // @ts-ignore
            fc.hexaString().map(id => factory.variable(id)) :
            undefined;

    const variables = variable ? [variable] : [];

    const subject = fc.oneof(namedNode, blankNode, ...variables);
    const predicate = fc.oneof(namedNode, ...variables);
    const object = fc.oneof(namedNode, literal, blankNode, ...variables);
    const graph = fc.oneof(fc.constant(factory.defaultGraph()), namedNode, blankNode, ...variables);

    const triple = fc.tuple(subject, predicate, object).map(([s, p, o]) => factory.quad(s, p, o));
    const quad = fc.tuple(subject, predicate, object, graph).map(([s, p, o, g]) => factory.quad(s, p, o, g));

    return {
        namedNode,
        blankNode,
        literal,
        variable,
        triple,
        quad
    };
}
