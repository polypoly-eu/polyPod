import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";

import commonEn from "./locales/en/common.json";
import importEn from "./locales/en/import.json";
import overviewEn from "./locales/en/overview.json";
import messagesMinistoryEn from "./locales/en/ministories/messages.json";
import exploreEn from "./locales/en/explore.json";
import reportEn from "./locales/en/report.json";

import commonDe from "./locales/de/common.json";
import importDe from "./locales/de/import.json";
import overviewDe from "./locales/de/overview.json";
import messagesMinistoryDe from "./locales/de/ministories/messages.json";
import exploreDe from "./locales/de/explore.json";
import reportDe from "./locales/de/report.json";

export default new I18n(determineLanguage(), {
    en: {
        common: commonEn,
        import: importEn,
        overview: overviewEn,
        messagesMinistory: messagesMinistoryEn,
        explore: exploreEn,
        report: reportEn,
    },
    de: {
        common: commonDe,
        import: importDe,
        overview: overviewDe,
        messagesMinistory: messagesMinistoryDe,
        explore: exploreDe,
        report: reportDe,
    },
});
