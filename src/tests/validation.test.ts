import {DefaultPod, podSpec} from "@polypoly-eu/poly-api";
import {Volume} from "memfs";
import {ValidatingPod, ValidationError} from "../validation";
import {dataset} from "@rdfjs/dataset";
import fetch from "node-fetch";

describe("Validating pod", () => {

    podSpec(() => {
        const fs = new Volume().promises as any;
        const underlying = new DefaultPod(dataset(), fs, fetch);
        const pod = new ValidatingPod(underlying);
        return Object.assign(pod, { fs });
    });

    describe("Rejects malformed calls", () => {

        const fs = new Volume().promises as any;
        const underlying = new DefaultPod(dataset(), fs, fetch);
        const pod = new ValidatingPod(underlying);

        it("No encoding", async () => {
            // @ts-ignore
            await expect(pod.polyOut.readFile("foo")).rejects.toThrowError(ValidationError);
            // @ts-ignore
            await expect(pod.polyOut.writeFile("foo", "bar")).rejects.toThrowError(ValidationError);
        });

        it("Malformed RDF terms", () => {
            expect(() =>
                // @ts-ignore
                pod.polyIn.factory.literal("test", {
                    value: "bar",
                    termType: "NamedNode",
                })
            ).toThrowError(/prototype/);
        });

    });

});
