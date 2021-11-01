//import pod from "@polypoly-eu/podjs/dist/pod.js";
import * as unusedPod from "@polypoly-eu/podjs/dist/pod.js";
import { DATA_IMPORTERS_COUNT, importData } from "../src/model/importer";
import { IMPORT_SUCCESS } from "../src/model/importers/utils/importer-status";
import Storage from "../src/model/storage";
import { ENCODED_ZIP_DATA } from "../src/static/example-data/facebook-gillianconnelly-2021-10-28-encoded";

describe("Import ad views from export with missing ads category", () => {
    let facebookAccount = null;

    beforeAll(async () => {
        localStorage.clear();
        localStorage.setItem.mockClear();

        const storage = new Storage(window.pod);
        const { polyOut } = window.pod;
        const url =
            ENCODED_ZIP_DATA + "/" + "facebook-gillianconnelly-2021-10-28.zip";
        await polyOut.importArchive(url);

        await storage.refreshFiles();
        const importedFile = storage.files[0];

        facebookAccount = await importData(importedFile);
    });

    it("has success for all importers", () => {
        expect(facebookAccount.importingResults.length).toBe(
            DATA_IMPORTERS_COUNT
        );
        facebookAccount.importingResults.forEach((importingResult) =>
            expect(importingResult.status).toBe(IMPORT_SUCCESS)
        );
    });
});
