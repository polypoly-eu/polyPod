import { DefaultPod } from "@polypoly-eu/poly-api";
import { Volume } from "memfs";
import { ValidatingPod, ValidationError } from "../validation";
import { dataset } from "@rdfjs/dataset";
import fetch from "node-fetch";
import { podSpec } from "@polypoly-eu/poly-api/dist/spec";
import { getHttpbinUrl } from "@polypoly-eu/fetch-spec";

describe("Validating pod", () => {
    const fs = new Volume().promises as any;
    const underlying = new DefaultPod(dataset(), fs, fetch);

    podSpec(new ValidatingPod(underlying), "/", getHttpbinUrl());

    describe("Rejects malformed calls", () => {
        const fs = new Volume().promises as any;
        const underlying = new DefaultPod(dataset(), fs, fetch);
        const pod = new ValidatingPod(underlying);

        it("Unknown encoding", async () => {
            // @ts-ignore
            await expect(pod.polyOut.writeFile("foo", "bar")).rejects.toThrowError(ValidationError);
        });

        it("Malformed RDF terms", () => {
            expect(() =>
                // @ts-ignore
                pod.dataFactory.literal("test", {
                    value: "bar",
                    termType: "NamedNode",
                })
            ).toThrowError(/prototype/);
        });
    });
});
