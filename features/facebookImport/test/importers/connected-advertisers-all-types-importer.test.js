import ConnectedAdvertisersAllTypesImporter, {
    CONNECTED_ADVERTISERS_ALL_TYPES_FILE_PATH,
} from "../../src/model/importers/connected-advertisers-all-types-importer";
import {
    CONNECTED_ADVERTISERS_DATA_SPECIFICATION,
    DATASET_EXPECTED_VALUES,
    zipFileWithConnectedAdvertisersAllTypes,
} from "../datasets/connected-advertisers-all-types-data";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runConnectedAdvertisersWithAllTypesImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import connected advertisers with all types from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { report } = await runConnectedAdvertisersWithAllTypesImporter(
            zipFile
        );
        expectMissingFileError(report, ConnectedAdvertisersAllTypesImporter);
    });
});

describe("Import connected advertisers with all types from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(
            CONNECTED_ADVERTISERS_ALL_TYPES_FILE_PATH
        );
    });

    it("triggers missing data key error", async () => {
        const { report } = await runConnectedAdvertisersWithAllTypesImporter(
            zipFile
        );
        expectInvalidContentError(report, ConnectedAdvertisersAllTypesImporter);
    });
});

describe("Import connected advertisers with all types", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithConnectedAdvertisersAllTypes();
        ({ result, report } = await runConnectedAdvertisersWithAllTypesImporter(
            zipFile
        ));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has correct number of entities", () =>
        expect(result.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfConnectedAdvertisers
        ));

    it("has correct properties in entities", () => {
        const obtainedData = result.map((connectedAdvertiser) => [
            connectedAdvertiser.name,
            connectedAdvertiser.hasDataFileCustomAudience,
            connectedAdvertiser.hasRemarketingCustomAudience,
            connectedAdvertiser.hasInPersonStoreVisitme,
        ]);
        expect(obtainedData).toStrictEqual(
            CONNECTED_ADVERTISERS_DATA_SPECIFICATION
        );
    });
});
