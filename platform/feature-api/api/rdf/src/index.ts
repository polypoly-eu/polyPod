/**
 * This module contains the entire implementation of the data factory. See [[dataFactory]] for an entrypoint.
 *
 * The implementation is assumed to be constrained by the type definitions. Use from non-typechecked code that passes
 * invalid arguments results in undefined behaviour.
 *
 * @packageDocumentation
 */

import * as RDF from "rdf-js";

/**
 * Abstract superclass for all term types defined in this module. It should not be subclassed outside of this module.
 *
 * This class defines a generic [[equals]] function according to the RDFJS specification.
 */
export abstract class Model {
  abstract termType: string;

  equals(other: RDF.Term | null): boolean {
    if (other === null || other === undefined || other.termType !== this.termType) return false;

    for (const [key, value] of Object.entries(this)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const otherValue = (other as any)[key];
      if (value instanceof Model) {
        if (!value.equals(otherValue)) return false;
      } else if (otherValue !== value) return false;
    }

    return true;
  }
}

export class NamedNode<Iri extends string = string> extends Model implements RDF.NamedNode {
  termType: "NamedNode" = "NamedNode";

  constructor(public value: Iri) {
    super();
    Object.freeze(this);
  }
}

export class BlankNode extends Model implements RDF.BlankNode {
  private static nextId = 0;

  termType: "BlankNode" = "BlankNode";

  value: string;

  constructor(value?: string) {
    super();

    if (value) this.value = value;
    else this.value = "b" + ++BlankNode.nextId;

    Object.freeze(this);
  }
}

export class Literal extends Model implements RDF.Literal {
  static readonly langStringDatatype = new NamedNode(
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
  );
  static readonly stringDatatype = new NamedNode("http://www.w3.org/2001/XMLSchema#string");

  language: string;
  datatype: RDF.NamedNode;
  termType: "Literal" = "Literal";

  constructor(public value: string, languageOrDatatype?: string | RDF.NamedNode) {
    super();

    if (typeof languageOrDatatype === "string") {
      if (languageOrDatatype.indexOf(":") === -1) {
        this.language = languageOrDatatype;
        this.datatype = Literal.langStringDatatype;
      } else {
        this.language = "";
        this.datatype = new NamedNode(languageOrDatatype);
      }
    } else {
      this.language = "";
      this.datatype = languageOrDatatype || Literal.stringDatatype;
    }

    Object.freeze(this);
  }
}

export class Variable extends Model implements RDF.Variable {
  termType: "Variable" = "Variable";

  constructor(public value: string) {
    super();
    Object.freeze(this);
  }
}

export class DefaultGraph extends Model implements RDF.DefaultGraph {
  static readonly instance: DefaultGraph = new DefaultGraph();

  private constructor() {
    super();
    Object.freeze(this);
  }

  termType: "DefaultGraph" = "DefaultGraph";
  value: "" = "";
}

export class Quad implements RDF.Quad {
  constructor(
    public subject: RDF.Quad_Subject,
    public predicate: RDF.Quad_Predicate,
    public object: RDF.Quad_Object,
    public graph: RDF.Quad_Graph
  ) {
    Object.freeze(this);
  }

  termType: "Quad" = "Quad";
  value: "" = "";

  equals(other: RDF.Term | null | undefined): boolean {
    // `|| !other.termType` is for backwards-compatibility with old factories without RDF* support.
    return (
      !!other &&
      (other.termType === "Quad" || !other.termType) &&
      other.subject.equals(this.subject) &&
      other.predicate.equals(this.predicate) &&
      other.object.equals(this.object) &&
      other.graph.equals(this.graph)
    );
  }
}

const prototypes = {
  subject: [NamedNode.prototype, BlankNode.prototype, Variable.prototype, Quad.prototype],
  predicate: [NamedNode.prototype, Variable.prototype],
  object: [
    NamedNode.prototype,
    Literal.prototype,
    BlankNode.prototype,
    Variable.prototype,
    Quad.prototype,
  ],
  graph: [DefaultGraph.prototype, NamedNode.prototype, BlankNode.prototype, Variable.prototype],
};

/**
 * A spec-compliant implementation of an RDFJS data factory supporting variables.
 *
 * The type of quads generated is [[Quad]], which restricts the term types of subject, predicate, object and graph
 * appropriately. For example, it is not permitted to use a [[Literal]] in subject position.
 *
 * The values returned by this factory satisfy two additional assumptions:
 *
 * 1. They are direct instances of exported classes, such as [[BlankNode]].
 *    There is no manual fiddling with prototypes.
 * 2. Those exported classes are subclasses of [[Model]] (except [[Quad]]).
 *
 * These guarantees are important for users of the data factory who want to transmit the values across serialization
 * boundaries. The spec mandates that all entities come with a JVM-style `equals` method. Unfortunately, when
 * transporting JS objects through any kind of channel (`JSON.stringify`, `MessagePort`, `postMessage`, ...) they lose
 * their methods and prototype. It is hence crucial that the prototype can be restored by the receiver of such an
 * object. Sadly, the reference implementation makes that hard by not having dedicated classes; instead, when entities
 * are created, the prototype is manually constructed and subsequently not exposed. This implementation solves the
 * problem through the exported classes that can reattached after deserialization.
 *
 * All objects returned by this factory are frozen. The factory itself is frozen too.
 *
 * Optionally, strict validation of input can be enabled. This enforces that all terms that are passed in have been
 * generated by this library and that the types of the inputs are correct (which would otherwise be enforced through
 * TypeScript).
 *
 * For the semantics of the methods, refer to [the spec](https://rdf.js.org/data-model-spec/).
 */
export class DataFactory implements RDF.DataFactory<Quad, Quad> {
  constructor(private readonly strict: boolean) {
    Object.freeze(this);
  }

  blankNode(value?: string): BlankNode {
    if (this.strict) {
      if (value !== undefined && typeof value !== "string")
        throw new Error("Expected string or undefined");
    }

    return new BlankNode(value);
  }

  defaultGraph(): DefaultGraph {
    return DefaultGraph.instance;
  }

  literal(value: string, languageOrDatatype?: string | NamedNode): Literal {
    if (this.strict) {
      if (typeof value !== "string") throw new Error("Expected string as value");

      if (
        languageOrDatatype !== undefined &&
        typeof languageOrDatatype !== "string" &&
        Object.getPrototypeOf(languageOrDatatype) !== NamedNode.prototype
      )
        throw new Error("Expected undefined, string or NamedNode prototype as language/datatype");
    }

    return new Literal(value, languageOrDatatype);
  }

  namedNode<Iri extends string = string>(value: Iri): NamedNode<Iri> {
    if (this.strict) {
      if (typeof value !== "string") throw new Error("Expected string");
    }

    return new NamedNode(value);
  }

  quad(
    subject: RDF.Quad_Subject,
    predicate: RDF.Quad_Predicate,
    object: RDF.Quad_Object,
    graph?: RDF.Quad_Graph
  ): Quad {
    if (this.strict) {
      if (!prototypes.subject.includes(Object.getPrototypeOf(subject)))
        throw new Error("Invalid prototype of subject");
      if (!prototypes.predicate.includes(Object.getPrototypeOf(predicate)))
        throw new Error("Invalid prototype of predicate");
      if (!prototypes.object.includes(Object.getPrototypeOf(object)))
        throw new Error("Invalid prototype of object");
      if (graph !== undefined && !prototypes.graph.includes(Object.getPrototypeOf(graph)))
        throw new Error("Invalid prototype of graph");
    }

    return new Quad(subject, predicate, object, graph || this.defaultGraph());
  }

  variable(value: string): Variable {
    if (this.strict) {
      if (typeof value !== "string") throw new Error("Expected string");
    }

    return new Variable(value);
  }
}

/**
 * The default instance of [[DataFactory]].
 *
 * This instance does not perform strict validation of input.
 */
export const dataFactory: DataFactory = new DataFactory(false);
