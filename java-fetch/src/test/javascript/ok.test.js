const {fetchSpec, getHttpbinUrl} = require("@polypoly-eu/fetch-spec");

describe("OkHttp", () => {
    const rawOk = new (Java.type("eu.polypoly.fetch.OkFetch"))();
    const polyglotOk = new (Java.type("eu.polypoly.fetch.PolyglotFetch"))(rawOk);

    fetchSpec(polyglotOk.fetch, getHttpbinUrl());
})
