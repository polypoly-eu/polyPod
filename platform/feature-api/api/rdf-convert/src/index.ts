/**
 * Generic converter for RDF terms and quads. See [[convert]] for details.
 *
 * @packageDocumentation
 */

import * as RDF from "rdf-js";

export function convert<T extends Exclude<RDF.Term, RDF.BaseQuad>>(
  t: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataFactory: RDF.DataFactory<any>
): T;
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convert(input: RDF.Term, dataFactory: RDF.DataFactory<any>): RDF.Term {
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
    case "Quad":
    default:
      // backwards compatibility: term type should be "Quad", but some implementations don't
      // set it accordingly
      return dataFactory.quad(
        convert(term.subject, dataFactory),
        convert(term.predicate, dataFactory),
        convert(term.object, dataFactory),
        convert(term.graph, dataFactory)
      );
  }
}
