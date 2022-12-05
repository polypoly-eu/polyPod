/**
 * This module contains the [[DataFactory]] implementation to be used with
 * [[PolyIn]].
 *
 * @packageDocumentation
 * @see [The RDF/JS spec](https://rdf.js.org/data-model-spec/).
 */

import * as RDFJS from "rdf-js";

/**
 * Abstract superclass for all term types defined in this module. It should not
 * be subclassed outside of this module.
 *
 * This class defines a generic [[equals]] function according to the RDFJS
 * specification.
 */
export abstract class Model {
    abstract termType: string;

    /**
     * Checks the equality of two terms.
     *
     * @param other - The term to compare against.
     * @returns `false` if the term is `null`, `undefined`, or of a different
     * type. Also `false` if one or more properties are not equal, otherwise
     * `true`.
     */
    equals(other: RDFJS.Term | null): boolean {
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
 * An implementation of RDF/JS' `NamedNode`.
 */
export class NamedNode<Iri extends string = string>
    extends Model
    implements RDFJS.NamedNode
{
    termType: "NamedNode" = "NamedNode";

    /**
     * Creates a new instance.
     * @param value - The value of the node.
     */
    constructor(public value: Iri) {
        super();
        Object.freeze(this);
    }
}

/**
 * An implementation of RDF/JS `BlankNode`.
 */
export class BlankNode extends Model implements RDFJS.BlankNode {
    private static nextId = 0;
    termType: "BlankNode" = "BlankNode";
    value: string;

    /**
     * Creates a new instance.
     * @param value - The value of the blank node. Generated if not specified.
     */
    constructor(value?: string) {
        super();

        if (value) this.value = value;
        else this.value = "b" + ++BlankNode.nextId;

        Object.freeze(this);
    }
}

/**
 * An implementation of RDF/JS' `Literal`.
 */
export class Literal extends Model implements RDFJS.Literal {
    language: string;
    datatype: RDFJS.NamedNode;
    termType: "Literal" = "Literal";

    static readonly langStringDatatype = new NamedNode(
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
    );
    static readonly stringDatatype = new NamedNode(
        "http://www.w3.org/2001/XMLSchema#string"
    );

    /**
     * Creates a new instance.
     *
     * @param value - The value of the literal.
     *
     * @param languageOrDatatype - Sets the datatype if either an
     * `RDFJS.NamedNode` or a `string` containing a datatype URI is
     * supplied. Sets the language if a valid language tag is supplied as a
     * `string`. If not specified, the default data type is
     * `Literal.stringDatatype`.
     */
    constructor(
        public value: string,
        languageOrDatatype?: string | RDFJS.NamedNode
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
 * An implementation of RDF/JS' `Variable`.
 */
export class Variable extends Model implements RDFJS.Variable {
    termType: "Variable" = "Variable";

    /**
     * Creates a new instance.
     *
     * @param value - The value of the variable.
     */
    constructor(public value: string) {
        super();
        Object.freeze(this);
    }
}

/**
 * A singleton that implements RDF/JS' `DefaultGraph`.
 * */
export class DefaultGraph extends Model implements RDFJS.DefaultGraph {
    static readonly instance: DefaultGraph = new DefaultGraph();
    termType: "DefaultGraph" = "DefaultGraph";
    value: "" = "";

    private constructor() {
        super();
        Object.freeze(this);
    }
}

/**
 * An implementation of RDF/JS' `Quad`.
 */
export class Quad implements RDFJS.Quad {
    termType: "Quad" = "Quad";
    value: "" = "";

    /**
     * Creates a new instance.
     *
     * @param subject - The subject of the quad.
     * @param predicate - The predicate of the quad.
     * @param object - The object of the quad.
     * @param graph - The graph of the quad.
     */
    constructor(
        public subject: RDFJS.Quad_Subject,
        public predicate: RDFJS.Quad_Predicate,
        public object: RDFJS.Quad_Object,
        public graph: RDFJS.Quad_Graph
    ) {
        Object.freeze(this);
    }

    /** @inheritdoc */
    equals(other: RDFJS.Term | null | undefined): boolean {
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
 * A spec-compliant implementation of RDF/JS' `DataFactory` that supports
 * variables. Used in conjunction with [[PolyIn]].
 */
export class DataFactory implements RDFJS.DataFactory<Quad, Quad> {
    /**
     * Creates a new instance.
     *
     * @param strict - Set to `true` for an instance that checks parameters for
     * validity at runtime.
     */
    constructor(private readonly strict: boolean) {
        Object.freeze(this);
    }

    /**
     * Creates a blank node, same parameters as [[BlankNode.constructor]].
     */
    blankNode(value?: string): BlankNode {
        if (this.strict) {
            if (value !== undefined && typeof value !== "string")
                throw new Error("Expected string or undefined");
        }

        return new BlankNode(value);
    }

    /**
     * @returns A reference to the default graph.
     */
    defaultGraph(): DefaultGraph {
        return DefaultGraph.instance;
    }

    /**
     * Creates a literal, same parameters as [[Literal.constructor]].
     */
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

    /**
     * Creates a named node, same parameters as [[NamedNode.constructor]].
     */
    namedNode<Iri extends string = string>(value: Iri): NamedNode<Iri> {
        if (this.strict) {
            if (typeof value !== "string") throw new Error("Expected string");
        }

        return new NamedNode(value);
    }

    /**
     * Creates a quad, same parameters as [[Quad.constructor]].
     */
    quad(
        subject: RDFJS.Quad_Subject,
        predicate: RDFJS.Quad_Predicate,
        object: RDFJS.Quad_Object,
        graph?: RDFJS.Quad_Graph
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

    /**
     * Creates a variable, same parameters as [[Variable.constructor]].
     */
    variable(value: string): Variable {
        if (this.strict) {
            if (typeof value !== "string") throw new Error("Expected string");
        }

        return new Variable(value);
    }
}
