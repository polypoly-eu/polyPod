import { DefaultPod } from "@polypoly-eu/poly-api";
import { Volume } from "memfs";
import { ValidatingPod } from "../../validation";
import { dataset } from "@rdfjs/dataset";
import fetch from "node-fetch";
import { podSpec } from "@polypoly-eu/poly-api/dist/spec";
import { getHttpbinUrl } from "@polypoly-eu/fetch-spec";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("Validating pod", () => {
    const fs = new Volume().promises as any;
    const underlying = new DefaultPod(dataset(), fs, fetch);

    podSpec(new ValidatingPod(underlying), "/", getHttpbinUrl());

    describe("Rejects malformed calls", () => {
        const fs = new Volume().promises as any;
        const underlying = new DefaultPod(dataset(), fs, fetch);
        const pod = new ValidatingPod(underlying);

        it("Unknown encoding", async () => {
            await assert.isRejected(
                // @ts-ignore
                pod.polyOut.writeFile("foo", "bar", { encoding: "wtf-8" }),
                /cannot decode "wtf-8"/
            );
        });

        it("Malformed RDF terms", () => {
            assert.throws(
                () =>
                    // @ts-ignore
                    pod.dataFactory.literal("test", {
                        value: "bar",
                        termType: "NamedNode",
                    }),
                /prototype/
            );
        });
    });
});
