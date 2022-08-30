import { polyNs, rdfNs, rdfsNs, xmlNs } from "./namespaces";

const namespacePrefixes = `\
    PREFIX poly: ${polyNs} \
    PREFIX rdf: ${rdfNs} \
    PREFIX rdfs: ${rdfsNs} \
    PREFIX xml: ${xmlNs}`;

export function sparqleInsertTemplate({ graph, triples }) {
    return `\
    ${namespacePrefixes}\
    INSERT DATA {\
        ${(graph && `GRAPH ${graph} {`) || ""}\
        ${triples}\
    } ${(graph && "}") || ""}`;
}

export function sparqleDeleteTemplate(graph, triples) {
    return `\
    ${namespacePrefixes}\
    DELETE DATA {\
      ${(graph && `GRAPH ${graph} {`) || ""}\
      ${triples}\
    } ${(graph && "}") || ""}`;
}
