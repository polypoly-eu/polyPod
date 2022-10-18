import { Volume } from "memfs";
import factory from "@rdfjs/dataset";
import { AsyncPod } from "../../async";
import { Pod, DefaultPod, DataFactory, podSpec } from "@polypoly-eu/api";

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
});
