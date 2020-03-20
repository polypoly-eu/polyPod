import {Typeson, Handlers, builtin} from "@polypoly-eu/bubblewrap";
import * as RDF from "@polypoly-eu/rdf";
import {typesonHandlers} from "@polypoly-eu/postoffice";

const rdfHandlers: Handlers = {
    "eu.polypoly.rdf.NamedNode": RDF.NamedNode,
    "eu.polypoly.rdf.BlankNode": RDF.BlankNode,
    "eu.polypoly.rdf.Literal": RDF.Literal,
    "eu.polypoly.rdf.Variable": RDF.Variable,
    "eu.polypoly.rdf.DefaultGraph": RDF.DefaultGraph,
    "eu.polypoly.rdf.Quad": RDF.Quad,
};

export function typesonInstance(): Typeson {
    return new Typeson()
        .register(typesonHandlers)
        .register(builtin)
        .register(rdfHandlers);
}