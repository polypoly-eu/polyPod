import { DataFactory } from "rdf-js";
import RDFJS from "@rdfjs/data-model";
// @ts-ignore
import Graphy from "@graphy/core.data.factory";
import { DataFactory as N3 } from "n3";
import { DataFactory as Ruben } from "rdf-data-factory";

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
