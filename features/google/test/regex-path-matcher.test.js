import { matchRegex } from "../src/model/importers/utils/lang-constants";

describe("Test MatchRegex for File Paths", () => {
    const german_activities_paths_html = [
        "Takeout/Meine Aktivitäten/Maps/MeineAktivitäten.html",
        "Takeout/Meine\u00A0Aktivitäten/Google Play Store/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/YouTube/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Shopping/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Bildersuche/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Datenexport/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Google Suche/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Anzeigen/MeineAktivitäten.html",
        "Takeout/Meine Aktivitäten/Google News/MeineAktivitäten.html",
    ];

    const german_activities_paths_json = [
        `Takeout/Meine Aktivitäten/Maps/MeineAktivitäten.json`,
        "Takeout/Meine\u00A0Aktivitäten/Google Play Store/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/YouTube/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Shopping/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Bildersuche/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Datenexport/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Google Suche/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Anzeigen/MeineAktivitäten.json",
        "Takeout/Meine Aktivitäten/Google News/MeineAktivitäten.json",
    ];

    const german_access_log_paths_csv = [
        "Takeout/Zugriffsprotokollaktivitäten/Aktivitäten – eine Liste der Google-Dienste, auf d.csv",
        "Takeout/Zugriffsprotokollaktivitäten/Aktivitäten\u00A0– eine Liste der Google-Dienste, auf d.csv",
    ];

    describe("should match all german paths with ActivitiesHtmlImporter", () => {
        for (const path of german_activities_paths_html) {
            it(`it should match for ${path}`, () => {
                const result = matchRegex(path, "ActivitiesHtmlImporter");
                expect(result).toBe(true);
            });
        }
    });

    describe("should match all german paths with ActivitiesJsonImporter", () => {
        for (const path of german_activities_paths_json) {
            it(`it should match for ${path}`, () => {
                const result = matchRegex(path, "ActivitiesJsonImporter");
                expect(result).toBe(true);
            });
        }
    });

    describe("should match all german paths with AccessLogImporter", () => {
        for (const path of german_access_log_paths_csv) {
            it(`it should match for ${path}`, () => {
                const result = matchRegex(path, "AccessLogImporter");
                expect(result).toBe(true);
            });
        }
    });
});
