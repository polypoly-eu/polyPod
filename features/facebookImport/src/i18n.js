import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";

import commonEn from "./locales/en/common.json";
import importEn from "./locales/en/import.json";
import overviewEn from "./locales/en/overview.json";
import exploreEn from "./locales/en/explore.json";
import activitiesMiniStoryEn from "./locales/en/miniStories/activities.json";
import messagesMiniStoryEn from "./locales/en/miniStories/messages.json";
import offFacebookEventsMiniStoryEn from "./locales/en/miniStories/offFacebookEvents.json";
import reportEn from "./locales/en/report.json";

import commonDe from "./locales/de/common.json";
import importDe from "./locales/de/import.json";
import overviewDe from "./locales/de/overview.json";
import exploreDe from "./locales/de/explore.json";
import activitiesMiniStoryDe from "./locales/de/miniStories/activities.json";
import messagesMiniStoryDe from "./locales/de/miniStories/messages.json";
import offFacebookEventsMiniStoryDe from "./locales/de/miniStories/offFacebookEvents.json";
import reportDe from "./locales/de/report.json";

export default new I18n(determineLanguage(), {
    en: {
        common: commonEn,
        import: importEn,
        overview: overviewEn,
        explore: exploreEn,
        activitiesMiniStory: activitiesMiniStoryEn,
        messagesMiniStory: messagesMiniStoryEn,
        offFacebookEventsMiniStory: offFacebookEventsMiniStoryEn,
        report: reportEn,
    },
    de: {
        common: commonDe,
        import: importDe,
        overview: overviewDe,
        explore: exploreDe,
        activitiesMiniStory: activitiesMiniStoryDe,
        messagesMiniStory: messagesMiniStoryDe,
        offFacebookEventsMiniStory: offFacebookEventsMiniStoryDe,
        report: reportDe,
    },
});
