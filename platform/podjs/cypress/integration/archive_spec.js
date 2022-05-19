import "../../dist/pod.js";

describe("Import Archive", () => {
    it("only one archive", async () => {
        cy.fixture("testZip.zip").then(async (zip) => {
            cy.intercept("https://localhost:3000/testZip.zip", zip);
            const zipPath = "https://localhost:3000/testZip.zip";
            const zipId = await window.pod.polyOut.importArchive(zipPath);
            assert.isNotEmpty(zipId);
            const contents = await window.pod.polyOut.readDir(zipId);
            assert.isAtLeast(contents.length, 1);
        });
    });

    it("multiple archives", async () => {
        cy.fixture("multipleZips1.zip")
            .fixture("multipleZips2.zip")
            .then(async (zip1, zip2) => {
                cy.intercept("https://localhost:3000/multipleZips1.zip", zip1);
                cy.intercept("https://localhost:3000/multipleZips2.zip", zip2);

                const zipPath1 = "https://localhost:3000/multipleZips1.zip";
                const zipPath2 = "https://localhost:3000/multipleZips2.zip";

                const zipId1 = await window.pod.polyOut.importArchive(zipPath1);
                assert.isNotEmpty(zipId1);
                const zipId2 = await window.pod.polyOut.importArchive(
                    zipPath2,
                    zipId1
                );
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
                    `Does not contain file1. Contents are: ${JSON.stringify(
                        contents
                    )}`
                );
                assert.isTrue(
                    containsFile2,
                    `Does not contain file2. Contents are: ${JSON.stringify(
                        contents
                    )}`
                );
            });
    });
});
