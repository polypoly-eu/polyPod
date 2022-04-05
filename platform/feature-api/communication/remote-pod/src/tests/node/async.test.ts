import { Pod, PolyLifecycle, DefaultPod, FS } from "@polypoly-eu/pod-api";
import { Volume } from "memfs";
import factory from "@rdfjs/dataset";
import { podSpec } from "@polypoly-eu/pod-api/dist/spec";
import { getHttpbinUrl } from "@polypoly-eu/test-utils";
import { AsyncPod } from "../../async";
import { DataFactory } from "@polypoly-eu/rdf";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("Async pod", () => {
    const fs = new Volume().promises as unknown as FS;
    const underlying = new DefaultPod(factory.dataset(), fs);

    describe("Resolved promise", () => {
        podSpec(
            new AsyncPod(Promise.resolve(underlying), new DataFactory(false)),
            "/",
            getHttpbinUrl()
        );
    });

    describe("Delayed promise", () => {
        const delayed = new Promise<Pod>((resolve) => {
            setTimeout(() => resolve(underlying), 500);
        });

        podSpec(new AsyncPod(delayed, new DataFactory(false)), "/", getHttpbinUrl());
    });

    // TODO move to api, duplicated code
    describe("Lifecycle", () => {
        let pod: Pod;
        let log: Array<(string | boolean)[]>;

        beforeEach(() => {
            log = [];
            const polyLifecycle: PolyLifecycle = {
                startFeature: async (...args) => {
                    log.push(args);
                },
                listFeatures: async () => ({ "test-on": true, "test-off": false }),
            };
            Object.assign(underlying, { polyLifecycle });
            pod = new AsyncPod(Promise.resolve(underlying), new DataFactory(false));
        });

        it("Lists features", async () => {
            await assert.eventually.deepEqual(pod.polyLifecycle?.listFeatures(), {
                "test-on": true,
                "test-off": false,
            });
        });

        it("Starts feature", async () => {
            await pod.polyLifecycle?.startFeature("hi", false);
            await pod.polyLifecycle?.startFeature("yo", true);

            assert.deepEqual(log, [
                ["hi", false],
                ["yo", true],
            ]);
        });
    });
});
