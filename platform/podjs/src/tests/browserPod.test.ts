import { IDBPolyOut } from "../browserPod";

test("Importing Archive", async () => {
    const polyOut = new IDBPolyOut();
    try {
        const zipPath =
            "https://github.com/timoteipalade/test-files/blob/main/testZip.zip";
        const result = await polyOut.importArchive(zipPath);
        expect(result).not.toEqual("");
            "https://github.com/timoteipalade/test-files/raw/main/testZip.zip";
    } catch (err) {
        expect(err).toBeUndefined();
    }
});
