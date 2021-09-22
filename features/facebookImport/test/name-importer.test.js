"use strict";

import { ZipFileMock } from "./mocks/zipfile-mock";
import { runNameImporter } from "./utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "./utils/importer-assertions.js";

const profileInformationFileName =
    "profile_information/profile_information.json";

function createProfileNameData(firstName, middleName, lastName) {
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

test("Name importer - missing file", async () => {
    const { result } = await runNameImporter(zipFile);

    expectMissingFileError(result);
});

test("Name importer - wrong data key", async () => {
    const profileData = { profile_v1: { name: "Name" } };
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { result } = await runNameImporter(zipFile);

    expectInvalidContentError(result);
});

test("Name importer - name with no special characters", async () => {
    const profileData = createProfileNameData("John", "", "Doe");
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { result, facebookAccount } = await runNameImporter(zipFile);

    expectImportSuccess(result);
    expect(facebookAccount.name).toBe("John Doe");
});

test("Name importer - name with special characters", async () => {
    const profileData = createProfileNameData("John🦊", "", "Döe");
    zipFile.addJsonEntry(profileInformationFileName, profileData);

    const { result, facebookAccount } = await runNameImporter(zipFile);

    expectImportSuccess(result);
    expect(facebookAccount.name).toBe("John🦊 Döe");
});
