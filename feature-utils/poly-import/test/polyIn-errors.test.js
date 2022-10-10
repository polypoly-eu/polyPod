import { FileImportError, FileSelectionError, RefreshFilesError } from "../src";

const classData = [
    [FileImportError, "import"],
    [FileSelectionError, "select"],
    [RefreshFilesError, "refresh"],
];

describe("Errors have the right API ", () => {
    it("throws correctly", () => {
        classData.forEach((err) => {
            const testCause = "test";
            try {
                throw new err[0](testCause);
            } catch (error) {
                expect(error).toBeInstanceOf(err[0]);
                expect(error.message).toMatch(new RegExp(err[1]));
                expect(error.name).toBe(new err[0]().constructor.name);
                expect(error.cause).toBe(testCause);
            }
        });
    });
});
