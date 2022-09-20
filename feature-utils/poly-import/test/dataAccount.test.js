import { DataAccount } from "../src";

describe("DataAccount has the correct attributes", () => {
    let dataAccount = new DataAccount();

    it("Attributes have the correct type", () => {
        [
            "importingResults",
            "importedFileNames",
            "analysesExecutionResults",
        ].forEach((attribute) => {
            expect(dataAccount[attribute]).toBeInstanceOf(Array);
        });
        ["analyses", "reports"].forEach((attribute) => {
            expect(dataAccount[attribute]).toBeInstanceOf(Object);
        });
        expect(dataAccount.personalData.name.familyName).toStrictEqual("");
    });

    it("Adds imported filenames successfully", () => {
        const IMPORTED_FILE_NAME = "Foo";
        dataAccount.addImportedFileName(IMPORTED_FILE_NAME);
        expect(dataAccount.importedFileNames.length).toBeGreaterThanOrEqual(1);
        expect(dataAccount.importedFileNames[0]).toBe(IMPORTED_FILE_NAME);
    });
});
