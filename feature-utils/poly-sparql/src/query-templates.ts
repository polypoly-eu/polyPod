import { polyNs, rdfNs, rdfsNs, xmlNs } from "./namespaces";

export function sparqleInsertTemplate({ graph, triples }): string {
    let tripleString = "";
    triples.forEach((triple) => (tripleString += triple));
    return `\
    PREFIX poly: ${polyNs} .\
    PREFIX rdf: ${rdfNs} .\
    PREFIX rdfs: ${rdfsNs} .\
    PREFIX xml: ${xmlNs} .\
    INSERT DATA {\
      ${(graph && `GRAPH ${graph} {`) || ""}\
      ${tripleString}\
    } ${(graph && "}") || ""}`;
}

export function sparqleDeleteTemplate({ graph, triples }): string {
    let tripleString = "";
    triples.forEach((triple) => (tripleString += triple));
    return `\
    PREFIX poly: ${polyNs} .\
    PREFIX rdf: ${rdfNs} .\
    PREFIX rdfs: ${rdfsNs} .\
    PREFIX xml: ${xmlNs} .\
    DELETE DATA {\
      ${(graph && `GRAPH ${graph} {`) || ""}\
      ${tripleString}\
    } ${(graph && "}") || ""}`;
}
