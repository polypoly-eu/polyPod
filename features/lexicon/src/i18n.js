import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";

const localLanguage = determineLanguage();
const FALLBACK_LANGUAGE = "en";
const TRANSLATION_DATA = {
    en: {
        common: {
            back: "Back to list",
            search: "Type here",
            clear: "Clear search",
            copy: "Copy to clipboard",
            noMatch: "No results for your search",
        },
        title: { lexicon: "Lexicon", details: "Term details" },
    },
    de: {
        common: {
            back: "Zurück zur Liste",
            search: "Suchbegriff eingeben",
            clear: "Text löschen",
            copy: "In die Zwischenablage kopieren",
            noMatch: "Keine Ergebnisse für Ihre Suche",
        },
        title: { lexicon: "Lexikon", details: "Details zum Eintrag" },
    },
};

export default new I18n(localLanguage, TRANSLATION_DATA, FALLBACK_LANGUAGE);
