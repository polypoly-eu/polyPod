import { FileImportError, FileSelectionError, RefreshFilesError } from "../src";

const classData = [
    [FileImportError, "import"],
    [FileSelectionError, "select"],
    [RefreshFilesError, "refresh"],
];

describe("Errors have the right API ", () => {
    it("throws correctly", () => {
        classData.forEach((err) => {
            const thrower = () => {
                throw new err[0]("test");
            };

            expect(thrower).toThrow(err[0]);
            expect(thrower).toThrow(new RegExp(err[1]));
        });
    });
});
