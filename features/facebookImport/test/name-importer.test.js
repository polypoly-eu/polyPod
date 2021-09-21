"use strict";

import NameImporter from "../src/importer/data-importers/name-importer";
import FacebookAccount from "../src/importer/facebook-account";
import { MissingFileImportException } from "../src/importer/failed-import-exception";
import { runImporter } from "../src/importer/importer";
import { IMPORT_ERROR, IMPORT_SUCCESS } from "../src/importer/importer-status";
import { ZipFileMock } from "./mocks/ZipFileMock";

const profileInformationFileName =
    "profile_information/profile_information.json";

function expectMissingFileError(result) {
    expect(result.status).toBe(IMPORT_ERROR);
    expect(result.message).toBe(MissingFileImportException.name);
    expect(result.error.name).toBe(MissingFileImportException.name);
}

function expectImportSuccess(result) {
    expect(result.status).toBe(IMPORT_SUCCESS);
}

function addProfileData(profileData, zipFile) {
    const serialized = JSON.stringify(profileData);
    const encoded = new TextEncoder("utf-8").encode(serialized);
    zipFile.addNamedEntry(profileInformationFileName, encoded);
}

test("Name importer - missing file", async () => {
    const zipFile = new ZipFileMock();
    const facebookAccount = new FacebookAccount();

    const result = await runImporter(
        NameImporter,
        zipFile.enrichedData(),
        facebookAccount
    );

    expectMissingFileError(result);
});

test("Name importer - name with no special characters", async () => {
    const zipFile = new ZipFileMock();
    const facebookAccount = new FacebookAccount();
    const profileData = {
        profile_v2: {
            name: {
                full_name: "John Doe",
                first_name: "John",
                middle_name: "",
                last_name: "Doe",
            },
        },
    };
    addProfileData(profileData, zipFile);

    const result = await runImporter(
        NameImporter,
        zipFile.enrichedData(),
        facebookAccount
    );

    expectImportSuccess(result);
    expect(facebookAccount.name).toBe("John Doe");
});
