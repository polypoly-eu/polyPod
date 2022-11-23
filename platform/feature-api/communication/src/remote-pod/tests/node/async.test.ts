import { DataFactory, Pod } from "@polypoly-eu/api";
import { MockPod } from "@polypoly-eu/api/dist/mock-pod";
import { AsyncPod } from "../../async";

describe("Async pod", () => {
    async function assertValidPod(pod: Pod): Promise<void> {
        expect(pod).toBeTruthy();
        expect(await pod.info.getRuntime()).toEqual(MockPod.INFO_RUNTIME);
        expect(await pod.info.getVersion()).toEqual(MockPod.INFO_VERSION);
    }

    const underlying = new MockPod();

    it("Works with resolved promise", async () => {
        await assertValidPod(
            new AsyncPod(Promise.resolve(underlying), new DataFactory(false))
        );
    });

    it("Works with delayed promise", async () => {
        const delayed = new Promise<Pod>((resolve) => {
            setTimeout(() => resolve(underlying), 500);
        });
        await assertValidPod(new AsyncPod(delayed, new DataFactory(false)));
    });
});
