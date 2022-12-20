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
import { defineEventImportersTestsForDatasets } from "./test-definition/importer-tests-definition";

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

defineEventImportersTestsForDatasets(datasets);
