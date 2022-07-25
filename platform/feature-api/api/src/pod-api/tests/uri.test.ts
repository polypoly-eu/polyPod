import { createUUID, isPolypodUri, PolyUri } from "../uri";

describe("Test functions", () => {
    it("generates and UUID in the required format", () => {
        expect(createUUID()).toMatch(/^\w{8}-\w{4}-4\w{3}-\w{4}-\w{12}$/);
    });
});
