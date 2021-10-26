import { AD_INTERESTS_FILE_PATH } from "../../src/model/importers/ad-interests-importer";
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
        const { result } = await runAdInterestsImporter(zipFile);
        expectMissingFileError(result);
    });
});

describe("Import ad interests from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(AD_INTERESTS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { result } = await runAdInterestsImporter(zipFile);
        expectInvalidContentError(result);
    });
});

describe("Import ad interests", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithAdInterests();
        ({ result, facebookAccount } = await runAdInterestsImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of ad interests", () =>
        expect(facebookAccount.adInterests.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfInterests
        ));
});
