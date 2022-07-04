/**
 * Builder for named nodes with a given base IRI. See [[namespace]] for details.
 *
 * @packageDocumentation
 */

import { BaseQuad, DataFactory, NamedNode } from "rdf-js";

/**
 * Produces an object that, when accessed at any property, generates a named node that's composed of the base IRI and
 * the name of the property.
 *
 * Example:
 *
 * ```
 * const ns = namespace("http://example.org/", dataFactory);
 * const nsFoo = ns.foo;
 * // nsFoo is a NamedNode with IRI http://example.org/foo
 * ```
 *
 * Implementation taken from [@rdfjs/namespace](https://github.com/rdfjs-base/namespace).
 *
 * @param baseIRI The base IRI that is prepended to the generated named nodes
 * @param dataFactory The data factory that is used to generate named nodes
 *
 * @returns A record (backed by a `Proxy`) that can be accessed at any property
 */
export function namespace<Q extends BaseQuad>(
    baseIRI: string,
    dataFactory: Pick<DataFactory<Q>, "namedNode">
): Record<string, NamedNode> {
    return new Proxy(
        {},
        {
            get: (target, property: string) =>
                dataFactory.namedNode(`${baseIRI}${property}`),
        }
    );
}
