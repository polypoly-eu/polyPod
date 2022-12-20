import SearchesImporter, {
    SEARCHES_INTERESTS_FILE_PATH,
} from "../../src/model/importers/searches-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithSearches,
} from "../datasets/searches-data";
import { ZipFileMock } from "@polypoly-eu/poly-import";
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
        const { report } = await runSearchesImporter(zipFile);
        expectMissingFileError(report, SearchesImporter);
    });
});

describe("Import searches from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(SEARCHES_INTERESTS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { report } = await runSearchesImporter(zipFile);
        expectInvalidContentError(report, SearchesImporter);
    });
});

describe("Import searches", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithSearches();
        ({ result, report } = await runSearchesImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has correct number of entities", () =>
        expect(result.length).toBe(DATASET_EXPECTED_VALUES.numberOfSearches));
});
