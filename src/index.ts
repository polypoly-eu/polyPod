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
    static readonly langStringDatatype = new NamedNode( 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString');
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

export const dataFactory: DataFactory = new DataFactory();