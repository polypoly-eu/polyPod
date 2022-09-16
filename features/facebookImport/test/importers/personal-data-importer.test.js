import PersonalDataImporter from "../../src/model/importers/personal-data-importer";
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
    const { result } = await runPersonalDataImporter(zipFile);

    expectMissingFileError(result, PersonalDataImporter);
});

test("PersonalData importer - wrong data key", async () => {
    const profileData = { profile_v1: { name: "PersonalData" } };
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { result } = await runPersonalDataImporter(zipFile);

    expectInvalidContentError(result, PersonalDataImporter);
});

test("PersonalData importer - correct data key without correct data", async () => {
    const profileData = { profile_v2: { name2: "PersonalData" } };
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { result } = await runPersonalDataImporter(zipFile);

    expectError(result, TypeError, PersonalDataImporter);
});

test("PersonalData importer - name with no special characters", async () => {
    const profileData = createProfileData("John", "Peter", "Doe");
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { result, facebookAccount } = await runPersonalDataImporter(zipFile);

    expectImportSuccess(result);
    expect(facebookAccount.personalData.name.givenName).toBe("John");
    expect(facebookAccount.personalData.name.additionalName).toBe("Peter");
    expect(facebookAccount.personalData.name.lastName).toBe("Doe");
});

test("PersonalData importer - name with special characters", async () => {
    const profileData = createProfileData("John🦊", "José", "Döe");
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { result, facebookAccount } = await runPersonalDataImporter(zipFile);

    expectImportSuccess(result);
    expect(facebookAccount.personalData.name.givenName).toBe("John🦊");
    expect(facebookAccount.personalData.name.additionalName).toBe("José");
    expect(facebookAccount.personalData.name.lastName).toBe("Döe");
});
