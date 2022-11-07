import { Importer } from "../src";

describe("Importer can't be instantiated ", () => {
    it("throws a TypeError", async () => {
        try {
            await new Importer().import({ zipFile: null, dataAccount: null });
        } catch (e) {
            expect(e).toBeInstanceOf(TypeError);
        }
    });
});
