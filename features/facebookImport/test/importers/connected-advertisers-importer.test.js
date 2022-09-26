import ConnectedAdvertisersImporter, {
    CONNECTED_ADVERTISERS_INTERESTS_FILE_PATH,
} from "../../src/model/importers/connected-advertisers-importer";
import { CONNECTED_ADVERTISERS_DATA_SPECIFICATION } from "../datasets/connected-advertisers-all-types-data";
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
        const { report } = await runConnectedAdvertisersImporter(zipFile);
        expectMissingFileError(report, ConnectedAdvertisersImporter);
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
        const { report } = await runConnectedAdvertisersImporter(zipFile);
        expectInvalidContentError(report, ConnectedAdvertisersImporter);
    });
});

describe("Import connected advertisers", () => {
    let result = null;
    let report = null;

    beforeAll(async () => {
        const zipFile = zipFileWithConnectedAdvertisers();
        ({ result, report } = await runConnectedAdvertisersImporter(
            zipFile
        ));
    });

    it("returns success status", () => expectImportSuccess(report));

    it("has correct number of entities", () =>
        expect(result.length).toBe(
            DATASET_EXPECTED_VALUES.numberOfConnectedAdvertisers
        ));

    it("has correct names in entities", () => {
        const obtainedData = result.map(
            (connectedAdvertiser) => connectedAdvertiser.name
        );
        expect(obtainedData).toStrictEqual(
            CONNECTED_ADVERTISERS_DATA_SPECIFICATION.map(
                (dataRow) => dataRow[0]
            )
        );
    });
});
