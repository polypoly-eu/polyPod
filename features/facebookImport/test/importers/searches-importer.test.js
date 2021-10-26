import { SEARCHES_INTERESTS_FILE_PATH } from "../../src/model/importers/searches-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithSearches,
} from "../datasets/searches-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runSearchesImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import searches from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runSearchesImporter(zipFile);
        expectMissingFileError(result);
    });
});

describe("Import searches from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(SEARCHES_INTERESTS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { result } = await runSearchesImporter(zipFile);
        expectInvalidContentError(result);
    });
});

describe("Import searches", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithSearches();
        ({ result, facebookAccount } = await runSearchesImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of ad interests", () =>
        expect(facebookAccount.searches.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfSearches
        ));
});
