import { Manifest, readManifest } from "../manifest";
import { join } from "path";

describe("Parsing", () => {
    describe("Successful parse", () => {
        it.each(["manifest.json"])("%s", async (pkg) => {
            let manifest: Manifest;
            try {
                manifest = await readManifest(
                    await import(join(__dirname, "data", pkg))
                );
            } catch (error) {
                expect(error).toBeUndefined();
            }
        });
    });

    describe("Failed parse", () => {
        it.each(["fail-empty.json"])("%s", async (pkg) => {
            try {
                await readManifest(await import(join(__dirname, "data", pkg)));
            } catch (error: any) {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toMatch("Failed to parse manifest");
            }
        });
    });
});
