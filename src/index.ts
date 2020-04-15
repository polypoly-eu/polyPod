/**
 * This module contains the entire implementation of the data factory. See [[dataFactory]] for an entrypoint.
 *
 * The implementation is assumed to be constrained by the type definitions. Use from non-typechecked code that passes
 * invalid arguments results in undefined behaviour.
 *
 * @packageDocumentation
 */

import * as RDF from "rdf-js";

export abstract class Model {
    abstract termType: string;

    equals(other: RDF.Term | null | undefined): boolean {
        if (!other || other.termType !== this.termType)
            return false;

        for (const [key, value] of Object.entries(this)) {
            const otherValue = (other as any)[key];
            if (value instanceof Model) {
                if (!value.equals(otherValue))
                    return false;
            }
            else if (otherValue !== value)
                return false;
        }

        return true;
    }
}

export class NamedNode extends Model implements RDF.NamedNode {
    termType: "NamedNode" = "NamedNode";

    constructor(
        public value: string
    ) { super(); }
}

export class BlankNode extends Model implements RDF.BlankNode {
    private static nextId = 0;

    termType: "BlankNode" = "BlankNode";

    value: string;

    constructor(
        value?: string
    ) {
        super();

        if (value)
            this.value = value;
        else
            this.value = "b" + (++BlankNode.nextId);
    }
}

export class Literal extends Model implements RDF.Literal {
    static readonly langStringDatatype = new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');
    static readonly stringDatatype = new NamedNode('http://www.w3.org/2001/XMLSchema#string');

    language: string;
    datatype: RDF.NamedNode;
    termType: "Literal" = "Literal";

    constructor(
        public value: string,
        languageOrDatatype?: string | RDF.NamedNode
    ) {
        super();

        if (typeof languageOrDatatype === "string") {
            if (languageOrDatatype.indexOf(":") === -1) {
                this.language = languageOrDatatype;
                this.datatype = Literal.langStringDatatype;
            }
            else {
                this.language = "";
                this.datatype = new NamedNode(languageOrDatatype);
            }
        }
        else {
            this.language = "";
            this.datatype = languageOrDatatype || Literal.stringDatatype;
        }
    }
}

export class Variable extends Model implements RDF.Variable {
    termType: "Variable" = "Variable";

    constructor(
        public value: string
    ) { super(); }
}

export class DefaultGraph extends Model implements RDF.DefaultGraph {
    static readonly instance: DefaultGraph = new DefaultGraph();

    private constructor() {
        super();
    }

    termType: "DefaultGraph" = "DefaultGraph";
    value: "" = "";
}

export class Quad implements RDF.Quad {
    termType = undefined;

    constructor(
        public subject: RDF.Quad_Subject,
        public predicate: RDF.Quad_Predicate,
        public object: RDF.Quad_Object,
        public graph: RDF.Quad_Graph
    ) {}

    equals(other: RDF.BaseQuad | null | undefined): boolean {
        return !!other && other.subject.equals(this.subject) && other.predicate.equals(this.predicate) &&
            other.object.equals(this.object) && other.graph.equals(this.graph);
    }
}

/**
 * A spec-compliant implementation of an RDFJS data factory supporting variables.
 *
 * The type of quads generated is [[Quad]], which restricts the term types of subject, predicate, object and graph
 * appropriately. For example, it is not permitted to use a [[Literal]] in subject position.
 *
 * The [[DataFactory.triple]] method is provided without guarantees since it is not covered by the spec, but mandated
 * by the types. Use [[DataFactory.quad]] instead with only three arguments.
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
 * For the semantics of the methods, refer to [the spec](https://rdf.js.org/data-model-spec/).
 */
export class DataFactory implements RDF.DataFactory<Quad> {
    blankNode(value?: string): BlankNode {
        return new BlankNode(value);
    }

    defaultGraph(): DefaultGraph {
        return DefaultGraph.instance;
    }

    literal(value: string, languageOrDatatype?: string | NamedNode): Literal {
        return new Literal(value, languageOrDatatype);
    }

    namedNode(value: string): NamedNode {
        return new NamedNode(value);
    }

    quad(subject: RDF.Quad_Subject, predicate: RDF.Quad_Predicate, object: RDF.Quad_Object, graph?: RDF.Quad_Graph): Quad {
        return new Quad(subject, predicate, object, graph || this.defaultGraph());
    }

    triple(subject: RDF.Quad_Subject, predicate: RDF.Quad_Predicate, object: RDF.Quad_Object): Quad {
        return this.quad(subject, predicate, object);
    }

    variable(value: string): Variable {
        return new Variable(value);
    }
}

/**
 * The default instance of [[DataFactory]].
 *
 * It is usually not necessary to create other instances of [[DataFactory]], except for when extending the class with
 * additional methods.
 */
export const dataFactory: DataFactory = new DataFactory();
