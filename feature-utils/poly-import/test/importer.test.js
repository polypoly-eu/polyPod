import { Importer } from "../src";

describe("Importer can't be instantiated ", () => {
    it("throws", () => {
        try {
            new Importer();
        } catch (e) {
            expect(e).toBeInstanceOf(TypeError);
        }
    });
});
