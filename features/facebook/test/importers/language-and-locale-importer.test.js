import LanguageAndLocaleImporter, {
    LANGUAGE_AND_LOCALE_FILE_PATH,
} from "../../src/model/importers/language-and-locale-importer";
import {
    createLanguageSettingsData,
    createLocaleData,
} from "../datasets/language-and-locale-data";
import { ZipFileMock } from "@polypoly-eu/poly-import";
import { runLanguageAndLocaleImporter } from "../utils/data-importing";
import {
    expectImportSuccess,
    expectImportWarning,
    expectInvalidContentError,
    expectMissingFileError,
} from "../utils/importer-assertions";

describe("Import language from", () => {
    let zipFile = null;
    beforeEach(() => {
        zipFile = new ZipFileMock();
    });

    it("export with missing file fails", async () => {
        const { report } = await runLanguageAndLocaleImporter(zipFile);

        expectMissingFileError(report, LanguageAndLocaleImporter);
    });

    it("export with wrong data key fails", async () => {
        const languageData = { wrong_data_key: [] };
        zipFile.addJsonEntry(LANGUAGE_AND_LOCALE_FILE_PATH, languageData);

        const { report } = await runLanguageAndLocaleImporter(zipFile);

        expectInvalidContentError(report, LanguageAndLocaleImporter);
    });

    it("export with no data has warning", async () => {
        const languageData = createLocaleData({});
        zipFile.addJsonEntry(LANGUAGE_AND_LOCALE_FILE_PATH, languageData);

        const { result, report } = await runLanguageAndLocaleImporter(zipFile);
        expectImportWarning(
            report,
            "Could not extract preferredLanguage",
            LanguageAndLocaleImporter
        );

        expect(result?.preferredLanguage).toBeUndefined();
    });
});

const datasets = [
    [
        "English",
        "en_US",
        "Selected Language",
        createLanguageSettingsData("en_US", "de_DE", "en"),
    ],
    [
        "German",
        "de_DE",
        "Ausgewählte Sprache",
        createLanguageSettingsData("de_DE", "en_US", "de"),
    ],
    [
        "Danish",
        "da_DK",
        "Valgt sprog",
        createLanguageSettingsData("da_DK", "en_US", "da"),
    ],
];

describe("Import language", () => {
    test.each(datasets)(
        "from %s dataset",
        async (language, settingValue, settingName, dataset) => {
            const zipFile = new ZipFileMock();
            zipFile.addJsonEntry(LANGUAGE_AND_LOCALE_FILE_PATH, dataset);

            const { result, report } = await runLanguageAndLocaleImporter(
                zipFile
            );

            expectImportSuccess(report);
            expect(result.preferredLanguage.code).toBe(settingValue);
            expect(result.preferredLanguage.name).toBe(settingName);
        }
    );
});
