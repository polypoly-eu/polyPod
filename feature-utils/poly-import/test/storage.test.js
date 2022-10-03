import { MockPod } from "@polypoly-eu/api/dist/mock-pod";
import { FeatureFileStorage } from "../src";

describe("File storage ", () => {
    let fileStorage;
    beforeAll(() => {
        const pod = new MockPod();
        fileStorage = new FeatureFileStorage(pod);
    });
    it("can be instantiated", () => {
        expect(fileStorage.files).toBeNull;
    });
});
