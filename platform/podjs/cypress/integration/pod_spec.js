import { podSpec } from "@polypoly-eu/pod-api";
import "../../dist/pod.js";

describe("pod.js satisfies spec", () => {
    podSpec(window.pod, "");
});

describe("Import Archive", () => {
    it("only one archive", async () => {
        const zipPath =
            "https://github.com/timoteipalade/test-files/raw/main/testZip.zip";
        const zipId = await window.pod.polyOut.importArchive(zipPath);
        assert.isNotEmpty(zipId);
        const contents = await window.pod.polyOut.readDir(zipId);
        assert.isAtLeast(contents.length, 1);
    });

    it("multiple archives", async () => {
        const zipPath1 =
            "https://github.com/timoteipalade/test-files/raw/main/multipleZips1.zip";
        const zipPath2 =
            "https://github.com/timoteipalade/test-files/raw/main/multipleZips2.zip";

        const zipId1 = await window.pod.polyOut.importArchive(zipPath1);
        assert.isNotEmpty(zipId1);
        const zipId2 = await window.pod.polyOut.importArchive(zipPath2, zipId1);
        assert.equal(zipId1, zipId2);
        const contents = await window.pod.polyOut.readDir(zipId1);
        const filenames = contents.map((entry) => {
            return entry.path;
        });
        const containsFile1 =
            filenames.filter((name) => {
                return name === "multipleZips1/file1.rtf";
            }).length > 0;
        const containsFile2 =
            filenames.filter((name) => {
                return name === "multipleZips2/file2.rtf";
            }).length > 0;
        assert.isTrue(
            containsFile1,
            `Does not contain file1. Contents are: ${JSON.stringify(contents)}`
        );
        assert.isTrue(
            containsFile2,
            `Does not contain file2. Contents are: ${JSON.stringify(contents)}`
        );
    });
});
