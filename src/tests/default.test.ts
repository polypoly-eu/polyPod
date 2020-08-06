import { podSpec } from "../spec";
import { DefaultPod } from "../default";
import { dataset } from "@rdfjs/dataset";
import fetch from "node-fetch";
import { Volume } from "memfs";
import { Pod } from "../api";
import { getHttpbinUrl } from "@polypoly-eu/fetch-spec";

describe("Mock pod", () => {
    podSpec(new DefaultPod(dataset(), new Volume().promises as any, fetch), "/", getHttpbinUrl());
});

// Compilation tests

// eslint-disable-next-line
function compile(): void {
    // eslint-disable-next-line
    const pod: Pod = window.pod;
}
