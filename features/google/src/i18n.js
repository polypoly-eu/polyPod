import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";
import commonEn from "./locales/en/common.json";
import commonDe from "./locales/de/common.json";

export default new I18n(determineLanguage(), {
    en: {
        common: commonEn,
    },
    de: {
        common: commonDe,
    },
});
