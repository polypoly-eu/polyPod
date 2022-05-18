import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";
import commonEn from "./locales/en/common.json";
import commonDe from "./locales/de/common.json";
import importEn from "./locales/en/import.json";
import importDe from "./locales/de/import.json";

export default new I18n(determineLanguage(), {
    en: {
        common: commonEn,
        import: importEn,
    },
    de: {
        common: commonDe,
        import: importDe,
    },
});
