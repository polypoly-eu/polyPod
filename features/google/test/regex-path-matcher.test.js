import { matchRegex } from "../src/model/importers/utils/lang-constants";

describe("Test MatchRegex for File Paths", () => {
    let german_paths_html = [
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

    let german_paths_json = [
        "Takeout/Meine Aktivitäten/Maps/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Google Play Store/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/YouTube/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Shopping/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Bildersuche/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Datenexport/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Google Suche/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Anzeigen/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Google News/MeineAktivitäten.json",
    ];

    describe("should match all german paths with ActivitiesHtmlImporter", () => {
        for (const path of german_paths_html) {
            it(`it should match for ${path}`, () => {
                const result = matchRegex(path, "ActivitiesHtmlImporter");
                expect(result).toBe(true);
            });
        }
    });

    describe("should match all german paths with ActivitiesJsonImporter", () => {
        for (const path of german_paths_json) {
            it(`it should match for ${path}`, () => {
                const result = matchRegex(path, "ActivitiesJsonImporter");
                expect(result).toBe(true);
            });
        }
    });
});
