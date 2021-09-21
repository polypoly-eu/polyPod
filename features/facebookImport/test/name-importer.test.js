"use strict";

import NameImporter from "../src/importer/data-importers/name-importer";
import FacebookAccount from "../src/importer/facebook-account";
import { runImporter } from "../src/importer/importer";
import { ZipFileMock } from "./mocks/ZipFileMock";

test("Name importer - missing file", () => {
    const zipFile = new ZipFileMock();
    const facebookAccount = new FacebookAccount();

    const result = runImporter(
        NameImporter,
        zipFile.enrichedData(),
        facebookAccount
    );

    expect(result).toBe(null);
});
