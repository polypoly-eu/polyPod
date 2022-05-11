import { IDBPolyOut } from "../browserPod";

test("Simple Archive Import", async () => {
    const polyOut = new IDBPolyOut();
    try {
        const zipPath =
            "https://github.com/timoteipalade/test-files/raw/main/testZip.zip";
        const zipId = await polyOut.importArchive(zipPath);
        expect(zipId).not.toEqual("");
        const contents = await polyOut.readDir(zipId);
        expect(contents.length).toBeGreaterThan(0);
    } catch (err) {
        expect(err).toBeUndefined();
    }
});
