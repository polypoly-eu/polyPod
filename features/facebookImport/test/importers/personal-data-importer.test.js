import PersonalDataImporter, {
    PROFILE_INFORMATION_FILE_PATH,
} from "../../src/model/importers/personal-data-importer";
import { ZipFileMock } from "../mocks/zipfile-mock";
import { runPersonalDataImporter } from "../utils/data-importing";
import {
    expectError,
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions.js";

const profileInformationFileName =
    "profile_information/profile_information.json";

function createProfileData(firstName, middleName, lastName) {
    return {
        profile_v2: {
            name: {
                full_name: [firstName, middleName, lastName]
                    .filter((each) => each.length !== 0)
                    .join(" "),
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
            },
        },
    };
}

let zipFile = null;
beforeEach(() => {
    zipFile = new ZipFileMock();
});

test("PersonalData importer - missing file", async () => {
    const { report } = await runPersonalDataImporter(zipFile);

    expectMissingFileError(report, PersonalDataImporter);
});

test("PersonalData importer - wrong data key", async () => {
    const profileData = { profile_v1: { name: "PersonalData" } };
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { report } = await runPersonalDataImporter(zipFile);

    expectInvalidContentError(report, PersonalDataImporter);
});

test("PersonalData importer - correct data key without correct data", async () => {
    const profileData = { profile_v2: { name2: "PersonalData" } };
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { report } = await runPersonalDataImporter(zipFile);

    expectError(report, TypeError, PersonalDataImporter);
});

test("PersonalData importer - name with no special characters", async () => {
    const profileData = createProfileData("John", "Peter", "Doe");
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { report, result } = await runPersonalDataImporter(zipFile);

    expectImportSuccess(report);
    expect(result.name.givenName).toBe("John");
    expect(result.name.additionalName).toBe("Peter");
    expect(result.name.lastName).toBe("Doe");
});

test("PersonalData importer - name with special characters", async () => {
    const profileData = createProfileData("John🦊", "José", "Döe");
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { report, result } = await runPersonalDataImporter(zipFile);

    expectImportSuccess(report);
    expect(result.name.givenName).toBe("John🦊");
    expect(result.name.additionalName).toBe("José");
    expect(result.name.lastName).toBe("Döe");
});

test("PersonalDataImporter - importedFileName returned correctly", async () => {
    const profileData = createProfileData("John🦊", "José", "Döe");
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { report, importedFileNames } = await runPersonalDataImporter(
        zipFile
    );

    console.log(report);
    expectImportSuccess(report);
    expect(importedFileNames).toStrictEqual([PROFILE_INFORMATION_FILE_PATH]);
});
