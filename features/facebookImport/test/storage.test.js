import "@polypoly-eu/podjs";

import Storage from "../src/model/storage.js";
import { expect } from "@jest/globals";

let storage;
let pod;

beforeAll((done) => {
    pod = await window.pod;
    storage = new Storage( pod );
});

describe("Tests file storage", () => {
    it("Adds and removes a file correctly", (done) => {
        expect(storage).toBeDefined();
    });
});
