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

describe("Can remove archives ", () => {
    let fileStorage;
    let fileUri;
    beforeAll(async () => {
        const pod = new MockPod();
        fileUri = await pod.polyOut.importArchive("noRealFile.zip");
        fileStorage = new FeatureFileStorage(pod);
    });
    it("was instantiated", () => {
        expect(fileStorage.files).toBeNull;
    });
});
