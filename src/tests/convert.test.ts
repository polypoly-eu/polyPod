import {ConvertSpec} from "../convert";
import RDFJS from "@rdfjs/data-model";
// @ts-ignore
import Graphy from "@graphy/core.data.factory";

describe("Convert @rdfjs/data-model → @rdfjs/data-model", () => {
    new ConvertSpec(RDFJS, RDFJS).run();
});

describe("Convert @rdfjs/data-model → @graphy/core.data.factory", () => {
    new ConvertSpec(RDFJS, Graphy).run();
});

describe("Convert @graphy/core.data.factory → @rdfjs/data-model", () => {
    new ConvertSpec(Graphy, RDFJS).run();
});

describe("Convert @graphy/core.data.factory → @graphy/core.data.factory", () => {
    new ConvertSpec(Graphy, Graphy).run();
});
