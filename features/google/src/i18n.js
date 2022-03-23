import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";

export default new I18n(determineLanguage(), {
    en: {},
    de: {},
});
