import { Volume } from "memfs";
import factory from "@rdfjs/dataset";
import { AsyncPod } from "../../async";
import {
    Pod,
    PolyLifecycle,
    DefaultPod,
    DataFactory,
    podSpec,
} from "@polypoly-eu/api";

describe("Async pod", () => {
    const underlying = new DefaultPod(factory.dataset(), new Volume().promises);

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
