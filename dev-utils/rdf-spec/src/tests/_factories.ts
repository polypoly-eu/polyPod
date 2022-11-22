import { DataFactory } from "rdf-js";
import RDFJS from "@rdfjs/data-model";
// @ts-ignore only used from JS
import Graphy from "@graphy/core.data.factory";
import { DataFactory as N3 } from "n3";
import { DataFactory as Ruben } from "rdf-data-factory";

/** This is a fix to make Graphy support with RDF*
 * Just like the rest of the other data factories */
Object.assign(Object.getPrototypeOf(Graphy.quad()), {
    termType: "Quad",
    value: "",
});

export const factories: Record<string, DataFactory> = {
    "@rdfjs/data-model": RDFJS,
    "@graphy/core.data.factory": Graphy,
    "rdf-data-factory": new Ruben(),
    n3: N3,
};
