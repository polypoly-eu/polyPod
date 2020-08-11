import { Pod, DefaultPod } from "@polypoly-eu/poly-api";
import { Volume } from "memfs";
import { dataset } from "@rdfjs/dataset";
import fetch from "node-fetch";
import { podSpec } from "@polypoly-eu/poly-api/dist/spec";
import { getHttpbinUrl } from "@polypoly-eu/fetch-spec";
import { AsyncPod } from "../../async";
import { DataFactory } from "@polypoly-eu/rdf";

describe("Async pod", () => {
    describe("Resolved promise", () => {
        const fs = new Volume().promises as any;
        const underlying = new DefaultPod(dataset(), fs, fetch);

        podSpec(
            new AsyncPod(Promise.resolve(underlying), new DataFactory(false)),
            "/",
            getHttpbinUrl()
        );
    });

    describe("Delayed promise", () => {
        const fs = new Volume().promises as any;
        const underlying = new DefaultPod(dataset(), fs, fetch);

        const delayed = new Promise<Pod>((resolve) => {
            setTimeout(() => resolve(underlying), 500);
        });

        podSpec(new AsyncPod(delayed, new DataFactory(false)), "/", getHttpbinUrl());
    });
});
