'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var uuid = require('uuid');

const polyNs = "<http://polypoly.coop/schema/#>";
const rdfNs = "<http://www.w3.org/1999/02/22-rdf-syntax-ns#>";
const rdfsNs = "<http://www.w3.org/2000/01/rdf-schema#>";
const xmlNs = "<http://www.w3.org/2001/XMLSchema#>";

function sparqleInsertTemplate({ graph, triples }) {
    let tripleString = "";
    triples.forEach((triple) => (tripleString += triple + " . "));
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

function sparqleDeleteTemplate({ graph, triples }) {
    let tripleString = "";
    triples.forEach((triple) => (tripleString += triple + " . "));
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

function jsObjectToTriplesString(
    subject,
    predicate,
    jsObj,
    blankNodeString = "_:" + uuid.v4()
) {
    let triplesString = `${subject} ${predicate} ${blankNodeString} `;
    for (let [key, value] of Object.entries(jsObj)) {
        const keyPredicate = "poly:" + key;
        if (typeof value === "object") {
            if (Array.isArray(value)) {
                triplesString += jsArrayToTriplesString(
                    blankNodeString,
                    keyPredicate,
                    value
                );
                continue;
            }
            triplesString += jsObjectToTriplesString(
                blankNodeString,
                keyPredicate,
                value
            );
            continue;
        }
        triplesString += `${blankNodeString} ${keyPredicate} ${
            typeof value === "string" ? `"${value}"` : value
        } `;
    }
    return triplesString;
}

function jsArrayToTriplesString(
    subject,
    predicate,
    arr
) {
    let triplesString = "";
    const objectsToStore = [];
    const elementsToJoin = [];
    for (let element of arr) {
        if (!element) continue;
        if (typeof element === "object") {
            //array[] is not supported
            if (Array.isArray(element)) {
                throw Error("Array[] is not supported");
            }
            objectsToStore.push(element);
            continue;
        }

        elementsToJoin.push(
            typeof element === "string" ? `"${element}"` : element
        );
    }
    if (elementsToJoin.length > 0) {
        triplesString += `${subject} ${predicate} ` + elementsToJoin.join(", ");
    }

    if (elementsToJoin.length > 0 && objectsToStore.length > 0)
        triplesString += " ";

    triplesString += objectsToStore
        .map((obj) => jsObjectToTriplesString(subject, predicate, obj))
        .join(" ");

    return triplesString;
}

exports.jsArrayToTriplesString = jsArrayToTriplesString;
exports.jsObjectToTriplesString = jsObjectToTriplesString;
exports.sparqleDeleteTemplate = sparqleDeleteTemplate;
exports.sparqleInsertTemplate = sparqleInsertTemplate;
