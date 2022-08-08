import { Volume } from "memfs";
import factory from "@rdfjs/dataset";
import { AsyncPod } from "../../async";
import {
    Pod,
    PolyLifecycle,
    DefaultPod,
    FS,
    DataFactory,
    podSpec,
} from "@polypoly-eu/api";

describe("Async pod", () => {
    const fs = new Volume().promises as unknown as FS;
    const underlying = new DefaultPod(factory.dataset(), fs);

    describe("Resolved promise", () => {
        podSpec(
            new AsyncPod(Promise.resolve(underlying), new DataFactory(false)),
            "/"
        );
    });

    describe("Delayed promise", () => {
        const delayed = new Promise<Pod>((resolve) => {
            setTimeout(() => resolve(underlying), 500);
        });

        podSpec(new AsyncPod(delayed, new DataFactory(false)), "/");
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
                listFeatures: async () => ({
                    "test-on": true,
                    "test-off": false,
                }),
            };
            Object.assign(underlying, { polyLifecycle });
            pod = new AsyncPod(
                Promise.resolve(underlying),
                new DataFactory(false)
            );
        });

        it("Starts feature", async () => {
            await pod.polyLifecycle?.startFeature("hi", false);
            await pod.polyLifecycle?.startFeature("yo", true);

            expect(log).toEqual([
                ["hi", false],
                ["yo", true],
            ]);
        });
    });
});
