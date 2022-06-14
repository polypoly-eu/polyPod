import { DataAccount } from "../src";

describe("DataAccount has the correct attributes", () => {
    const dataAccount = new DataAccount();
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
        expect(dataAccount.name).toStrictEqual("");
    });
});
