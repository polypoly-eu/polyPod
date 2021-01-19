import { readManifest } from "../manifest";
import { join } from "path";

describe("Parsing", () => {
    describe("Successful parse", () => {
        it.each(["ok.json"])("%s", async (pkg) => {
            expect(await readManifest(join(__dirname, "data", pkg))).toMatchSnapshot();
        });
    });

    describe("Failed parse", () => {
        it.each([
            "fail-absolute.json",
            "fail-empty.json",
            "fail-traversal.json",
            "fail-version.json",
        ])("%s", async (pkg) => {
            await expect(
                readManifest(join(__dirname, "data", pkg))
            ).rejects.toThrowErrorMatchingSnapshot();
        });
    });
});
