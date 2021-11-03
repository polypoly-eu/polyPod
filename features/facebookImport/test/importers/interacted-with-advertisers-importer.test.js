import { INTERACTED_WITH_ADVERTISERS_FILE_PATH } from "../../src/model/importers/interacted-with-advertisers-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithInteractedWithAdvertisers,
} from "../datasets/interacted-with-advertisers-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runInteractedWithAdvertisersImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import interacted with advertisers from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runInteractedWithAdvertisersImporter(zipFile);
        expectMissingFileError(result);
    });
});

describe("Import interacted with advertisers from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(INTERACTED_WITH_ADVERTISERS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { result } = await runInteractedWithAdvertisersImporter(zipFile);
        expectInvalidContentError(result);
    });
});

describe("Import interacted with advertisers", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithInteractedWithAdvertisers();
        ({ result, facebookAccount } =
            await runInteractedWithAdvertisersImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of entities", () =>
        expect(facebookAccount.interactedAdvertisers.length).toBe(
            DATASET_EXPECTED_VALUES.totalInteractionsCount
        ));
});
