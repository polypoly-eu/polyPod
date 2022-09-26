import AdInterestsImporter, {
    AD_INTERESTS_FILE_PATH,
} from "../../src/model/importers/ad-interests-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithAdInterests,
} from "../datasets/ad-interests-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runAdInterestsImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import ad interests from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { report } = await runAdInterestsImporter(zipFile);
        expectMissingFileError(report, AdInterestsImporter);
    });
});

describe("Import ad interests from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(AD_INTERESTS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { report } = await runAdInterestsImporter(zipFile);
        expectInvalidContentError(report, AdInterestsImporter);
    });
});

describe("Import ad interests", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithAdInterests();
        ({ result, report } = await runAdInterestsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has correct number of entities", () =>
        expect(result.length).toBe(DATASET_EXPECTED_VALUES.numberOfInterests));
});
