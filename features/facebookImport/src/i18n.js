import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";

import commonEn from "./locales/en/common.json";
import importEn from "./locales/en/import.json";
import overviewEn from "./locales/en/overview.json";
import exploreEn from "./locales/en/explore.json";

import commonDe from "./locales/de/common.json";
import importDe from "./locales/de/import.json";
import overviewDe from "./locales/de/overview.json";
import exploreDe from "./locales/de/explore.json";

export default new I18n(determineLanguage(), {
    en: {
        common: commonEn,
        import: importEn,
        overview: overviewEn,
        explore: exploreEn,
    },
    de: {
        common: commonDe,
        import: importDe,
        overview: overviewDe,
        explore: exploreDe,
    },
});
