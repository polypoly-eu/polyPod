import { polyNs, rdfNs, rdfsNs, xmlNs } from "./namespaces";

export function sparqleInsertTemplate({ graph, triples }) {
    return `PREFIX poly: ${polyNs} PREFIX rdf: ${rdfNs} PREFIX rdfs: ${rdfsNs} PREFIX xml: ${xmlNs} INSERT DATA { ${
        (graph && `GRAPH ${graph} {`) || ""
    } ${triples} } ${(graph && "}") || ""}`;
}

export function sparqleDeleteTemplate(graph, triples) {
    return `\
    PREFIX poly: ${polyNs} \
    PREFIX rdf: ${rdfNs} \
    PREFIX rdfs: ${rdfsNs} \
    PREFIX xml: ${xmlNs} \
    DELETE DATA {\
      ${(graph && `GRAPH ${graph} {`) || ""}\
      ${triples}\
    } ${(graph && "}") || ""}`;
}
