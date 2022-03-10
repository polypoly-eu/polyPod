import { readManifest } from "../manifest";
import { join } from "path";

describe("Parsing", () => {
    describe("Successful parse", () => {
        it.each(["manifest.json", "no-version.json"])("%s", async (pkg) => {
            expect(
                await readManifest(await import(join(__dirname, "data", pkg)))
            ).toMatchSnapshot();
        });
    });

    describe("Failed parse", () => {
        it.each(["fail-empty.json", "fail-version.json"])("%s", async (pkg) => {
            await expect(
                readManifest(await import(join(__dirname, "data", pkg)))
            ).rejects.toThrowErrorMatchingSnapshot();
        });
    });
});
