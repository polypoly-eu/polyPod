import ConnectedAdvertisersImporter, {
    CONNECTED_ADVERTISERS_INTERESTS_FILE_PATH,
} from "../../src/model/importers/connected-advertisers-importer";
import {
    DATASET_EXPECTED_VALUES,
    zipFileWithConnectedAdvertisers,
} from "../datasets/connected-advertisers-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runConnectedAdvertisersImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import connected advertisers from empty export", () => {
    let zipFile = null;
    beforeAll(() => {
        zipFile = new ZipFileMock();
    });

    it("triggers missing files error", async () => {
        const { result } = await runConnectedAdvertisersImporter(zipFile);
        expectMissingFileError(result, ConnectedAdvertisersImporter);
    });
});

describe("Import connected advertisers from empty export with wrong data key", () => {
    let zipFile = null;
    beforeAll(async () => {
        zipFile = zipWithWrongDatasetKey(
            CONNECTED_ADVERTISERS_INTERESTS_FILE_PATH
        );
    });

    it("triggers missing data key error", async () => {
        const { result } = await runConnectedAdvertisersImporter(zipFile);
        expectInvalidContentError(result, ConnectedAdvertisersImporter);
    });
});

describe("Import connected advertisers", () => {
    let result = null;
    let facebookAccount = null;

    beforeAll(async () => {
        const zipFile = zipFileWithConnectedAdvertisers();
        ({ result, facebookAccount } = await runConnectedAdvertisersImporter(
            zipFile
        ));
    });

    it("returns success status", () => expectImportSuccess(result));

    it("has correct number of entities", () =>
        expect(facebookAccount.connectedAdvertisers.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfConnectedAdvertisers
        ));
});
