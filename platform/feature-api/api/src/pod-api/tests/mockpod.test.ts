import { MockPolyOut } from "../mock-pod";

describe("Mock polyOut", () => {
    let mockPolyOut: MockPolyOut;
    beforeAll(() => {
        mockPolyOut = new MockPolyOut();
    });
    it("should fail with bad URIs", async () => {
        await expect(
            mockPolyOut.importArchive("foo", "bar")
        ).rejects.toThrowError(Error);
    });
});
