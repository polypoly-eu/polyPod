import {dataFactory} from "../index";
import {ConvertSpec, DataFactorySpec} from "@polypoly-eu/rdf-spec";
import * as RDFJS from "@rdfjs/data-model";

describe("Spec", () => {
    new DataFactorySpec(dataFactory).run();
});

describe("Conversion this → @rdfjs/data-model", () => {
    new ConvertSpec(dataFactory, RDFJS);
});

describe("Conversion @rdfjs/data-model → this", () => {
    new ConvertSpec(RDFJS, dataFactory);
});
