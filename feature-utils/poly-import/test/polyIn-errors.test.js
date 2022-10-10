import { FileImportError, FileSelectionError, RefreshFilesError } from "../src";

const classData = [
    [FileImportError, "import"],
    [FileSelectionError, "select"],
    [RefreshFilesError, "refresh"],
];

describe("Errors have the right API ", () => {
    it("throws correctly", () => {
        classData.forEach(([testClass, testMsg]) => {
            const testCause = "test";
            try {
                throw new testClass(testCause);
            } catch (error) {
                expect(error).toBeInstanceOf(testClass);
                expect(error.message).toMatch(new RegExp(testMsg));
                expect(error.name).toBe(new testClass().constructor.name);
                expect(error.cause).toBe(testCause);
            }
        });
    });
});
