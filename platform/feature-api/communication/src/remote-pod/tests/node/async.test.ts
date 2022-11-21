import { Volume } from "memfs";
import factory from "@rdfjs/dataset";
import { AsyncPod } from "../../async";
import { Pod, DefaultPod, DataFactory } from "@polypoly-eu/api";

describe("Async pod", () => {
    function assertValidPod(pod: Pod): void {
        // TODO: Instead of using DefaultPod, we should use MockPod for the
        //       underlying Pod, then verify it's being invoked as expected.
        expect(pod).toBeTruthy();
    }

    const underlying = new DefaultPod(factory.dataset(), new Volume().promises);

    it("Resolved promise", async () => {
        assertValidPod(
            new AsyncPod(Promise.resolve(underlying), new DataFactory(false))
        );
    });

    it("Delayed promise", async () => {
        const delayed = new Promise<Pod>((resolve) => {
            setTimeout(() => resolve(underlying), 500);
        });
        assertValidPod(new AsyncPod(delayed, new DataFactory(false)));
    });
});
