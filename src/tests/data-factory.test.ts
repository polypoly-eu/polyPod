import {DataFactorySpec} from "../data-factory";
import RDFJS from "@rdfjs/data-model";
// @ts-ignore
import Graphy from "@graphy/core.data.factory";

describe("@rdfjs/data-model", () => {
    new DataFactorySpec(RDFJS).run();
});

const originalWarn = console.warn;

describe("@graphy/core.data.factory", () => {
    beforeEach(() => {
        console.warn = () => {
            // graphy prints too much noise
        };
    });

    new DataFactorySpec(Graphy).run();

    afterEach(() => {
        console.warn = originalWarn;
    });
});
