import { fetchSpec, getHttpbinUrl, startServer, stopServer } from "../..";

// TODO: How do we start and stop the server here?
startServer();

describe("window.fetch", () => {
    fetchSpec(window.fetch, getHttpbinUrl());
});

stopServer();
