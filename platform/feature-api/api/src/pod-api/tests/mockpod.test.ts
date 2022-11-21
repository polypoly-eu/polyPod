import { MockPolyOut } from "../mock-pod";
import { PolyPodUriError } from "../uri";

describe("Mock polyOut", () => {
    let mockPolyOut: MockPolyOut;
    beforeAll(() => {
        mockPolyOut = new MockPolyOut();
    });
    it("should fail with bad URIs", async () => {
        await expect(
            mockPolyOut.importArchive("foo", "bar")
        ).rejects.toThrowError(PolyPodUriError);
    });
});
