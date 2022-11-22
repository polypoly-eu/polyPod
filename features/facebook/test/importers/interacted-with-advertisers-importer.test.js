import InteractedWithAdvertisersImporter, {
    INTERACTED_WITH_ADVERTISERS_FILE_PATH,
} from "../../src/model/importers/interacted-with-advertisers-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithInteractedWithAdvertisers,
} from "../datasets/interacted-with-advertisers-data";
import { ZipFileMock } from "@polypoly-eu/poly-import";
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
        const { report } = await runInteractedWithAdvertisersImporter(zipFile);
        expectMissingFileError(report, InteractedWithAdvertisersImporter);
    });
});

describe("Import interacted with advertisers from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(INTERACTED_WITH_ADVERTISERS_FILE_PATH);
    });

    it("triggers missing data key error", async () => {
        const { report } = await runInteractedWithAdvertisersImporter(zipFile);
        expectInvalidContentError(report, InteractedWithAdvertisersImporter);
    });
});

describe("Import interacted with advertisers", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithInteractedWithAdvertisers();
        ({ result, report } = await runInteractedWithAdvertisersImporter(
            zipFile
        ));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has correct number of entities", () =>
        expect(result.length).toBe(
            DATASET_EXPECTED_VALUES.totalInteractionsCount
        ));
});
