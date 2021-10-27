import AccountSessionActivitiesImporter, {
    SESSION_ACTIVITIES_FILE_PATH,
    SESSION_ACTIVITIES_STORAGE_KEY,
} from "../../src/model/importers/account-session-activities-importer";
import AdminRecordsImporter, {
    ADMIN_RECORDS_FILE_PATH,
    ADMIN_RECORDS_STORAGE_KEY,
} from "../../src/model/importers/admin-records-importer";
import { zipFileWithSessionActivitiesAndExpectedValues } from "../datasets/account-session-activities-data";
import { zipFileWithAdminRecordsAndExpectedValues } from "../datasets/admin-records-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../utils/data-creation";
import { runSingleImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

const datasets = [
    [
        AccountSessionActivitiesImporter.name,
        AccountSessionActivitiesImporter,
        SESSION_ACTIVITIES_FILE_PATH,
        SESSION_ACTIVITIES_STORAGE_KEY,
        zipFileWithSessionActivitiesAndExpectedValues(),
    ],
    [
        AdminRecordsImporter.name,
        AdminRecordsImporter,
        ADMIN_RECORDS_FILE_PATH,
        ADMIN_RECORDS_STORAGE_KEY,
        zipFileWithAdminRecordsAndExpectedValues(),
    ],
];

describe("Import from empty dataset triggers missing file error", () => {
    test.each(datasets)(
        "using importer %s",
        async (importerName, importerClass) => {
            const zipFile = new ZipFileMock();
            const { result } = await runSingleImporter(importerClass, zipFile);
            expectMissingFileError(result);
        }
    );
});

describe("Import from dataset with wrong data key triggers missing data key error", () => {
    test.each(datasets)(
        "using importer %s",
        async (importerName, importerClass, dataFileName) => {
            const zipFile = zipWithWrongDatasetKey(dataFileName);
            const { result } = await runSingleImporter(importerClass, zipFile);
            expectInvalidContentError(result);
        }
    );
});

describe("Import from dataset has correct number of entities", () => {
    test.each(datasets)(
        "using importer %s",
        async (
            importerName,
            importerClass,
            dataFileName,
            dataKey,
            { zipFile, expectedValues }
        ) => {
            const { result, facebookAccount } = await runSingleImporter(
                importerClass,
                zipFile
            );

            expectImportSuccess(result);

            expect(facebookAccount[dataKey].length).toBe(
                expectedValues.totalEventsCount
            );
        }
    );
});
