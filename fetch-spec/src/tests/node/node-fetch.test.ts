import fetch from "node-fetch";
import { fetchSpec, getHttpbinUrl, startServer, stopServer } from "../..";

describe("node-fetch", () => {
    // TODO: mocha has 'before' instead of 'beforeAll'
    beforeAll(async () => {
        startServer();
    });

    afterAll(async () => {
        stopServer();
    });
    fetchSpec(fetch, getHttpbinUrl());
});
