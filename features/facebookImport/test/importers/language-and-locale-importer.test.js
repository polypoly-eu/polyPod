import LanguageAndLocaleImporter, {
    LANGUAGE_AND_LOCALE_FILE_PATH,
} from "../../src/model/importers/language-and-locale-importer";
import {
    createLanguageSettingsData,
    createLocaleData,
} from "../datasets/language-and-locale-data";
import { ZipFileMock } from "../mocks/zipfile-mock";
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
        const { result } = await runLanguageAndLocaleImporter(zipFile);

        expectMissingFileError(result, LanguageAndLocaleImporter);
    });

    it("export with wrong data key fails", async () => {
        const languageData = { wrong_data_key: [] };
        zipFile.addJsonEntry(LANGUAGE_AND_LOCALE_FILE_PATH, languageData);

        const { result } = await runLanguageAndLocaleImporter(zipFile);

        expectInvalidContentError(result, LanguageAndLocaleImporter);
    });

    it("export with no data has warning", async () => {
        const languageData = createLocaleData({});
        zipFile.addJsonEntry(LANGUAGE_AND_LOCALE_FILE_PATH, languageData);

        const { result, facebookAccount } = await runLanguageAndLocaleImporter(
            zipFile
        );
        expectImportWarning(result, "Could not extract preferredLanguage");

        expect(facebookAccount.preferredLanguage).toBeUndefined();
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

            const { result, facebookAccount } =
                await runLanguageAndLocaleImporter(zipFile);

            expectImportSuccess(result);
            expect(facebookAccount.preferredLanguage.code).toBe(settingValue);
            expect(facebookAccount.preferredLanguage.name).toBe(settingName);
        }
    );
});
