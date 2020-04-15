import {DataFactorySpec} from "../data-factory";
import RDFJS from "@rdfjs/data-model";
// @ts-ignore
import Graphy from "@graphy/core.data.factory";

describe("@rdfjs/data-model", () => {
    new DataFactorySpec(RDFJS).run();
});

describe("@graphy/core.data.factory", () => {
    new DataFactorySpec(Graphy).run();
});
