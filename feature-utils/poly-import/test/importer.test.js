import { Importer } from "../src";

describe("Importer can't be instantiated ", () => {
    it("throws", async () => {
        try {
            await new Importer().import({ zipFile: null, dataAccount: null });
        } catch (e) {
            expect(e).toBeInstanceOf(TypeError);
        }
    });
});
