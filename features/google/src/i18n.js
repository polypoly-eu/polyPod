import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";
import commonEn from "./locales/en/common.json";
import commonDe from "./locales/de/common.json";
import activitiesOverTimeStoryEn from "./locales/en/story/activitiesOverTime.json";
import activitiesOverTimeStoryDe from "./locales/de/story/activitiesOverTime.json";

export default new I18n(determineLanguage(), {
    en: {
        common: commonEn,
        activitiesOverTimeStory: activitiesOverTimeStoryEn,
    },
    de: {
        common: commonDe,
        activitiesOverTimeStoryDe: activitiesOverTimeStoryDe,
    },
});
