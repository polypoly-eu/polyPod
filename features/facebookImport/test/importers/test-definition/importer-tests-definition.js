import { ZipFileMock } from "@polypoly-eu/poly-import";
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
                const { report } = await runSingleImporter(
                    importerClass,
                    zipFile
                );
                expectMissingFileError(report, importerClass);
            }
        );
    });

    describe("Import from dataset with wrong data key triggers missing data key error", () => {
        test.each(targetDatasets)(
            "using importer %s",
            async (importerName, importerClass, dataFileName) => {
                const zipFile = zipWithWrongDatasetKey(dataFileName);
                const { report } = await runSingleImporter(
                    importerClass,
                    zipFile
                );
                expectInvalidContentError(report, importerClass);
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
                const { result, report } = await runSingleImporter(
                    importerClass,
                    zipFile
                );

                expectImportSuccess(report);

                expect(result.length).toBe(expectedValues.totalEventsCount);
            }
        );
    });
};
