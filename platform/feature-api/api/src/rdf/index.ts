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

    /**
     * It checks the `equality` of two models.
     *
     * If the other term is null, undefined, or of a different type, return false; otherwise, for each
     * property of this term, if the property is a Model, compare it to the other term's property;
     * otherwise, if the other term's property is not equal to this term's property, return false;
     * otherwise, return true
     * @param {RDF.Term | null} other - RDF.Term | null
     * @returns A boolean value.
     */
    equals(other: RDF.Term | null): boolean {
        if (
            other === null ||
            other === undefined ||
            other.termType !== this.termType
        )
            return false;

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

/**
 * @class `NamedNode`
 * @classdesc It is a class that represents an [[RDF.NamedNode]].
 * @implements RDF.NamedNode
 * @extends Model
 */
export class NamedNode<Iri extends string = string>
    extends Model
    implements RDF.NamedNode
{
    termType: "NamedNode" = "NamedNode";

    /**
     * A constructor function for the class NamedNode.
     * @param {Iri} value - The value of the literal.
     */
    constructor(public value: Iri) {
        super();
        Object.freeze(this);
    }
}

/**
 *  BlankNode is a class that implements the [[RDF.BlankNode]] interface
 */
export class BlankNode extends Model implements RDF.BlankNode {
    private static nextId = 0;
    termType: "BlankNode" = "BlankNode";
    value: string;

    /**
     * It takes an optional string parameter, and if it's not null or undefined,
     * assigns it to the value property. Otherwise, it assigns a new blank node identifier to the value
     * property
     * @param {string} [value] - The value of the blank node.
     */
    constructor(value?: string) {
        super();

        if (value) this.value = value;
        else this.value = "b" + ++BlankNode.nextId;

        Object.freeze(this);
    }
}

/**
 * @class Literal
 * A representation of a string with an optional language tag or datatype
 */
export class Literal extends Model implements RDF.Literal {
    language: string;
    datatype: RDF.NamedNode;
    termType: "Literal" = "Literal";

    static readonly langStringDatatype = new NamedNode(
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
    );
    static readonly stringDatatype = new NamedNode(
        "http://www.w3.org/2001/XMLSchema#string"
    );

    /**
     * It creates a new Literal instance.
     * If the languageOrDatatype parameter is a string, then it's either a language tag or a datatype URI.
     * If it's a language tag, then set the language property to the language tag and the datatype property
     * to the language string datatype.
     * If it's a datatype URI, then set the language property to an empty string and the datatype property
     * to a new NamedNode with the datatype URI.
     * If the languageOrDatatype parameter is not a string, then set the language property to an empty string
     * and the datatype property to the languageOrDatatype parameter or the string datatype if the languageOrDatatype
     * parameter is undefined.
     * @param {string} value - The value of the literal.
     * @param {string | RDF.NamedNode} [languageOrDatatype] - string | RDF.NamedNode
     */
    constructor(
        public value: string,
        languageOrDatatype?: string | RDF.NamedNode
    ) {
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

/**
 * A `Variable` @class is a `Model` that has a `termType` of `"Variable"` and a `value` that is a `string`
 * @extends `Model`
 * @implements RDF.Variable
 */
export class Variable extends Model implements RDF.Variable {
    termType: "Variable" = "Variable";

    /**
     * It creates a new [[Variable]] instance with the value passed.
     * @param {string} value - The value of the instance.
     */
    constructor(public value: string) {
        super();
        Object.freeze(this);
    }
}

/**
 * `DefaultGraph` is a Singleton class that implements [[RDF.DefaultGraph]] interface
 * @extends Model
 * @implements RDF.DefaultGraph
 * */
export class DefaultGraph extends Model implements RDF.DefaultGraph {
    static readonly instance: DefaultGraph = new DefaultGraph();
    termType: "DefaultGraph" = "DefaultGraph";
    value: "" = "";

    private constructor() {
        super();
        Object.freeze(this);
    }
}

/**
 * `Quad` is a class that implements the [[RDF.Quad]] interface
 * @implements RDF.Quad
 */
export class Quad implements RDF.Quad {
    termType: "Quad" = "Quad";
    value: "" = "";

    /**
     * It creates a new [[Quad]] instance.
     * @param {RDF.Quad_Subject} subject - The subject of the quad.
     * @param {RDF.Quad_Predicate} predicate - The predicate of the quad.
     * @param {RDF.Quad_Object} object - RDF.Quad_Object
     * @param {RDF.Quad_Graph} graph - The graph name of the quad.
     */
    constructor(
        public subject: RDF.Quad_Subject,
        public predicate: RDF.Quad_Predicate,
        public object: RDF.Quad_Object,
        public graph: RDF.Quad_Graph
    ) {
        Object.freeze(this);
    }

    /** @inheritdoc */
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

/**
 * Creating a map of the different types of nodes that can be used in a quad.
 * @const prototypes
 */
const prototypes = {
    subject: [NamedNode.prototype, BlankNode.prototype, Quad.prototype],
    predicate: [NamedNode.prototype],
    object: [
        NamedNode.prototype,
        Literal.prototype,
        BlankNode.prototype,
        Quad.prototype,
    ],
    graph: [DefaultGraph.prototype, NamedNode.prototype, BlankNode.prototype],
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
 *
 * @implements RDF.DataFactory<Quad, Quad>
 */
export class DataFactory implements RDF.DataFactory<Quad, Quad> {
    /**
     * It creates a new [[DataFactory]] instance with value `strict`
     * @param {boolean} strict - boolean
     */
    constructor(private readonly strict: boolean) {
        Object.freeze(this);
    }

    /**
     * It returns a new BlankNode with the given value.
     *
     * @param {string} [value] - The value of the blank node.
     * @throws {Error} If the strict flag is set and the `value` is not a string or undefined
     * @returns {BlankNode} - A blank node.
     */
    blankNode(value?: string): BlankNode {
        if (this.strict) {
            if (value !== undefined && typeof value !== "string")
                throw new Error("Expected string or undefined");
        }

        return new BlankNode(value);
    }

    /** @inheritdoc */
    defaultGraph(): DefaultGraph {
        return DefaultGraph.instance;
    }

    /** @inheritdoc */
    literal(value: string, languageOrDatatype?: string | NamedNode): Literal {
        if (this.strict) {
            if (typeof value !== "string")
                throw new Error("Expected string as value");

            if (
                languageOrDatatype !== undefined &&
                typeof languageOrDatatype !== "string" &&
                Object.getPrototypeOf(languageOrDatatype) !==
                    NamedNode.prototype
            )
                throw new Error(
                    "Expected undefined, string or NamedNode prototype as language/datatype"
                );
        }

        return new Literal(value, languageOrDatatype);
    }

    /** @inheritdoc */
    namedNode<Iri extends string = string>(value: Iri): NamedNode<Iri> {
        if (this.strict) {
            if (typeof value !== "string") throw new Error("Expected string");
        }

        return new NamedNode(value);
    }

    /** @inheritdoc */
    quad(
        subject: RDF.Quad_Subject,
        predicate: RDF.Quad_Predicate,
        object: RDF.Quad_Object,
        graph?: RDF.Quad_Graph
    ): Quad {
        if (this.strict) {
            if (!prototypes.subject.includes(Object.getPrototypeOf(subject)))
                throw new Error("Invalid prototype of subject");
            if (
                !prototypes.predicate.includes(Object.getPrototypeOf(predicate))
            )
                throw new Error("Invalid prototype of predicate");
            if (!prototypes.object.includes(Object.getPrototypeOf(object)))
                throw new Error("Invalid prototype of object");
            if (
                graph !== undefined &&
                !prototypes.graph.includes(Object.getPrototypeOf(graph))
            )
                throw new Error("Invalid prototype of graph");
        }

        return new Quad(
            subject,
            predicate,
            object,
            graph || this.defaultGraph()
        );
    }

    /** @inheritdoc */
    variable(value: string): Variable {
        if (this.strict) {
            if (typeof value !== "string") throw new Error("Expected string");
        }

        return new Variable(value);
    }
}
