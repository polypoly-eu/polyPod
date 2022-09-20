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
        dataAccount.addImportedFileName("Foo");
        expect(dataAccount.importedFileNames.length).toBeGreaterThanOrEqual(1);
    });
});
