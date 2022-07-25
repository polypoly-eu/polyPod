import { createUUID, isPolypodUri, PolyUri } from "../uri";

describe("Test functions", () => {
    it("generates and UUID in the required format", () => {
        expect(createUUID()).toMatch(/^\w{8}-\w{4}-4\w{3}-\w{4}-\w{12}$/);
    });
    it("recognizes good and bad URIs", () => {
        const polyUri: PolyUri = new PolyUri();
        expect(isPolypodUri(polyUri.toString())).toBe(true);
        expect(isPolypodUri("foobargaz")).toBe(false);
    });
});
