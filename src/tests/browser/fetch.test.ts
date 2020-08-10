import { fetchSpec, getHttpbinUrl } from "../..";

describe("window.fetch", () => {
    fetchSpec(window.fetch, getHttpbinUrl());
});
