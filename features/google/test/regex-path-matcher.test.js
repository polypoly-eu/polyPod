import matchRegex from "../src/model/importers/utils/lang-constants";
import {
    ActivitiesHtmlImporter,
    ActivitiesJsonImporter,
} from "../src/model/importer.js";

describe("Test MatchRegex for File Paths", () => {
    let german_paths = [
        "Takeout/Meine Aktivitäten/Maps/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Google Play Store/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/YouTube/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Shopping/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Bildersuche/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Datenexport/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Google Suche/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Anzeigen/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Google News/MeineAktivitäten.html",
    ];

    describe("should match all german paths with ActivitiesHtmlImporter", () => {
        for (const path of german_paths) {
            it(`it should match for ${path}`, () => {
                const result = matchRegex(path, ActivitiesHtmlImporter);
                expect(result).toBe(true);
            });
        }
    });

    describe("should match all german paths with ActivitiesJsonImporter", () => {
        for (const path of german_paths) {
            it(`it should match for ${path}`, () => {
                const result = matchRegex(path, ActivitiesJsonImporter);
                expect(result).toBe(true);
            });
        }
    });
});
