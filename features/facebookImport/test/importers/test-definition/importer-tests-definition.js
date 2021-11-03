import { ZipFileMock } from "../../mocks/zipfile-mock";
import { zipWithWrongDatasetKey } from "../../utils/data-creation";
import { runSingleImporter } from "../../utils/data-importing";
import {
    expectImportSuccess,
    expectInvalidContentError,
    expectMissingFileError,
} from "../../utils/importer-assertions";

export const defineEventImportersTestsForDatasets = (targetDatasets) => {
    describe("Import from empty dataset triggers missing file error", () => {
        test.each(targetDatasets)(
            "using importer %s",
            async (importerName, importerClass) => {
                const zipFile = new ZipFileMock();
                const { result } = await runSingleImporter(
                    importerClass,
                    zipFile
                );
                expectMissingFileError(result);
            }
        );
    });

    describe("Import from dataset with wrong data key triggers missing data key error", () => {
        test.each(targetDatasets)(
            "using importer %s",
            async (importerName, importerClass, dataFileName) => {
                const zipFile = zipWithWrongDatasetKey(dataFileName);
                const { result } = await runSingleImporter(
                    importerClass,
                    zipFile
                );
                expectInvalidContentError(result, importerClass);
            }
        );
    });

    describe("Import from dataset has correct number of entities", () => {
        test.each(targetDatasets)(
            "using importer %s",
            async (
                importerName,
                importerClass,
                dataFileName,
                dataKey,
                { zipFile, expectedValues }
            ) => {
                const { result, facebookAccount } = await runSingleImporter(
                    importerClass,
                    zipFile
                );

                expectImportSuccess(result);

                expect(facebookAccount[dataKey].length).toBe(
                    expectedValues.totalEventsCount
                );
            }
        );
    });
};
