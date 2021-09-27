import { DefaultPod } from "@polypoly-eu/pod-api";
import { dataset } from "@rdfjs/dataset";
import fetch from "node-fetch";
import { Volume } from "memfs";
import Storage from "../src/model/storage.js";
import { expect } from "@jest/globals";

let storage;
let pod;
const filePath = "/poly";
let volume;

beforeAll(() => {
    const aDataset = dataset();
    volume = Volume.fromJSON({ filePath: "pod" }).promises;
    pod = new DefaultPod(aDataset, volume, fetch);
    storage = new Storage(pod);
});

describe("Tests underlying storage", () => {
    it("Can retrieve mock file", async () => {
        console.log(await volume.readFile("poly"));
        expect(await volume.readFile(filePath)).toBeDefined();
    });
});

describe("Tests file storage", () => {
    it("Checks for correct definitions", () => {
        expect(pod).toBeDefined();
        expect(storage).toBeDefined();
    });
});
