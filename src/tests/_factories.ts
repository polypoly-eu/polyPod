import {DataFactory} from "rdf-js";
import RDFJS from "@rdfjs/data-model";
// @ts-ignore
import Graphy from "@graphy/core.data.factory";
import {DataFactory as N3} from "n3";

export const factories: Record<string, DataFactory> = {
    "@rdfjs/data-model": RDFJS,
    "@graphy/core.data.factory": Graphy,
    "n3": N3
};
