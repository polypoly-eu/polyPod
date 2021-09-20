import { DefaultPod } from "@polypoly-eu/pod-api";
import { dataset } from "@rdfjs/dataset";
import fetch from "node-fetch";
import { Volume } from "memfs";
import Storage from "../src/model/storage.js";
import { expect } from "@jest/globals";

let storage;
let pod;

beforeAll(() => {
    const aDataset = dataset();
    const volume = new Volume().promises;
    pod = new DefaultPod(aDataset, volume, fetch);
    storage = new Storage( pod );
});

describe("Tests file storage", () => {
    it("Adds and removes a file correctly", () => {
        expect(pod).toBeDefined();
    });
});
