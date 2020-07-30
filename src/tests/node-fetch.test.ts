import fetch from "node-fetch";
import { fetchSpec, getHttpbinUrl } from "..";

describe("node-fetch", () => {
    fetchSpec(fetch, getHttpbinUrl());
});
