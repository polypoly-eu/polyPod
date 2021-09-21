import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";

import commonEn from "./locales/en/common.json";
import importEn from "./locales/en/import.json";
import overviewEn from "./locales/en/overview.json";
import dataStructureMiniStoryEn from "./locales/en/miniStories/dataStructure.json";

import commonDe from "./locales/de/common.json";
import importDe from "./locales/de/import.json";
import overviewDe from "./locales/de/overview.json";
import dataStructureMiniStoryDe from "./locales/de/miniStories/dataStructure.json";

export default new I18n(determineLanguage(), {
    en: {
        common: commonEn,
        import: importEn,
        overview: overviewEn,
        dataStructureMiniStory: dataStructureMiniStoryEn,
    },
    de: {
        common: commonDe,
        import: importDe,
        overview: overviewDe,
        dataStructureMiniStory: dataStructureMiniStoryDe,
    },
});
