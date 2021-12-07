import ConnectedAdvertisersAllTypesImporter, {
    CONNECTED_ADVERTISERS_ALL_TYPES_FILE_PATH,
} from "../../src/model/importers/connected-advertisers-all-types-importer";
import {
    CONNECTED_ADVERTISERS_DATA_SPECIFICATION,
    DATASET_EXPECTED_VALUES,
    zipFileWithConnectedAdvertisersAllTypes,
} from "../datasets/connected-advertisers-all-types-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runConnectedAdvertisersWitlAllTypesImporter } from "../utils/data-importing";
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
        const { result } = await runConnectedAdvertisersWitlAllTypesImporter(
            zipFile
        );
        expectMissingFileError(result, ConnectedAdvertisersAllTypesImporter);
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
        const { result } = await runConnectedAdvertisersWitlAllTypesImporter(
            zipFile
        );
        expectInvalidContentError(result, ConnectedAdvertisersAllTypesImporter);
    });
});

describe("Import connected advertisers with all types", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithConnectedAdvertisersAllTypes();
        ({ result, facebookAccount } =
            await runConnectedAdvertisersWitlAllTypesImporter(zipFile));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of entities", () =>
        expect(facebookAccount.connectedAdvertisers.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfConnectedAdvertisers
        ));

    it("has correct properties in entities", () => {
        const obtainedData = facebookAccount.connectedAdvertisers.map(
            (connectedAdvertiser) => [
                connectedAdvertiser.name,
                connectedAdvertiser.hasDataFileCustomAudience,
                connectedAdvertiser.hasRemarketingCustomAudience,
                connectedAdvertiser.hasInPersonStoreVisitme,
            ]
        );
        expect(obtainedData).toStrictEqual(
            CONNECTED_ADVERTISERS_DATA_SPECIFICATION
        );
    });
});
