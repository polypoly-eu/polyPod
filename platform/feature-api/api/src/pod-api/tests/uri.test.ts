import { createUUID, isPolypodUri, PolyUri } from "../uri";

describe("Test functions", () => {
    it("should generate an UUID in the required format", () => {
        expect(createUUID()).toMatch(/^\w{8}-\w{4}-4\w{3}-\w{4}-\w{12}$/);
    });
    
    it("should generate different subsequent UUIDs", () => {
        let lastUUID = createUUID();
        for (let i = 0; i < 100; i++) {
            const thisUUID = createUUID();
            expect(thisUUID).not.toEqual(lastUUID);
            lastUUID = thisUUID;
        }
    });
    it("recognizes good and bad URIs", () => {
        const polyUri: PolyUri = new PolyUri();
        expect(isPolypodUri(polyUri.toString())).toBe(true);
        expect(isPolypodUri("foobargaz")).toBe(false);
    });
});
