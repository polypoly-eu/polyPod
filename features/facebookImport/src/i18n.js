import { determineLanguage, I18n } from "@polypoly-eu/silly-i18n";

import commonEn from "./locales/en/common.json";
import navbarTitlesEn from "./locales/en/navbarTitles.json";
import importEn from "./locales/en/import.json";
import overviewEn from "./locales/en/overview.json";
import dataStructureMiniStoryEn from "./locales/en/miniStories/dataStructure.json";
import exploreEn from "./locales/en/explore.json";
import activitiesMiniStoryEn from "./locales/en/miniStories/activities.json";
import messagesMiniStoryEn from "./locales/en/miniStories/messages.json";
import offFacebookEventsMiniStoryEn from "./locales/en/miniStories/offFacebookEvents.json";
import advertisingValueMiniStoryEn from "./locales/en/miniStories/advertisingValue.json";
import reactionsMinistoryEn from "./locales/en/miniStories/reactions.json";
import picturesMiniStoryEn from "./locales/en/miniStories/pictures.json";
import connectedAdvertisersMiniStoryEn from "./locales/en/miniStories/connectedAdvertisers.json";
import reportEn from "./locales/en/report.json";
import errorPopupEn from "./locales/en/errorPopup.json";
import baseInfoScreenEn from "./locales/en/infoScreens/baseInfoScreen.json";
import activitiesInfoScreenEn from "./locales/en/infoScreens/activitiesInfoScreen.json";
import dataStructureInfoScreenEn from "./locales/en/infoScreens/dataStructureInfoScreen.json";
import picturesInfoScreenEn from "./locales/en/infoScreens/picturesInfoScreen.json";
import messagesInfoScreenEn from "./locales/en/infoScreens/messagesInfoScreen.json";
import postReactionInfoScreenEn from "./locales/en/infoScreens/postReactionInfoScreen.json";
import offFacebookInfoScreenEn from "./locales/en/infoScreens/offFacebookInfoScreen.json";
import infographicsEn from "./locales/en/infographics.json";

import commonDe from "./locales/de/common.json";
import navbarTitlesDe from "./locales/de/navbarTitles.json";
import importDe from "./locales/de/import.json";
import overviewDe from "./locales/de/overview.json";
import dataStructureMiniStoryDe from "./locales/de/miniStories/dataStructure.json";
import exploreDe from "./locales/de/explore.json";
import activitiesMiniStoryDe from "./locales/de/miniStories/activities.json";
import messagesMiniStoryDe from "./locales/de/miniStories/messages.json";
import offFacebookEventsMiniStoryDe from "./locales/de/miniStories/offFacebookEvents.json";
import advertisingValueMiniStoryDe from "./locales/de/miniStories/advertisingValue.json";
import reactionsMiniStoryDe from "./locales/de/miniStories/reactions.json";
import picturesMiniStoryDe from "./locales/de/miniStories/pictures.json";
import connectedAdvertisersMiniStoryDe from "./locales/de/miniStories/connectedAdvertisers.json";
import reportDe from "./locales/de/report.json";
import errorPopupDe from "./locales/de/errorPopup.json";
import baseInfoScreenDe from "./locales/de/infoScreens/baseInfoScreen.json";
import activitiesInfoScreenDe from "./locales/de/infoScreens/activitiesInfoScreen.json";
import dataStructureInfoScreenDe from "./locales/de/infoScreens/dataStructureInfoScreen.json";
import picturesInfoScreenDe from "./locales/de/infoScreens/picturesInfoScreen.json";
import messagesInfoScreenDe from "./locales/de/infoScreens/messagesInfoScreen.json";
import postReactionInfoScreenDe from "./locales/de/infoScreens/postReactionInfoScreen.json";
import offFacebookInfoScreenDe from "./locales/de/infoScreens/offFacebookInfoScreen.json";
import infographicsDe from "./locales/de/infographics.json";

export default new I18n(determineLanguage(), {
    en: {
        common: commonEn,
        navbarTitles: navbarTitlesEn,
        import: importEn,
        overview: overviewEn,
        dataStructureMiniStory: dataStructureMiniStoryEn,
        explore: exploreEn,
        activitiesMiniStory: activitiesMiniStoryEn,
        messagesMiniStory: messagesMiniStoryEn,
        offFacebookEventsMiniStory: offFacebookEventsMiniStoryEn,
        advertisingValueMiniStory: advertisingValueMiniStoryEn,
        picturesMiniStory: picturesMiniStoryEn,
        reactionsMiniStory: reactionsMinistoryEn,
        connectedAdvertisersMiniStory: connectedAdvertisersMiniStoryEn,
        report: reportEn,
        errorPopup: errorPopupEn,
        baseInfoScreen: baseInfoScreenEn,
        activitiesInfoScreen: activitiesInfoScreenEn,
        dataStructureInfoScreen: dataStructureInfoScreenEn,
        picturesInfoScreen: picturesInfoScreenEn,
        messagesInfoScreen: messagesInfoScreenEn,
        postReactionInfoScreen: postReactionInfoScreenEn,
        offFacebookInfoScreen: offFacebookInfoScreenEn,
        infographics: infographicsEn,
    },
    de: {
        common: commonDe,
        navbarTitles: navbarTitlesDe,
        import: importDe,
        overview: overviewDe,
        dataStructureMiniStory: dataStructureMiniStoryDe,
        explore: exploreDe,
        activitiesMiniStory: activitiesMiniStoryDe,
        messagesMiniStory: messagesMiniStoryDe,
        offFacebookEventsMiniStory: offFacebookEventsMiniStoryDe,
        advertisingValueMiniStory: advertisingValueMiniStoryDe,
        picturesMiniStory: picturesMiniStoryDe,
        reactionsMiniStory: reactionsMiniStoryDe,
        connectedAdvertisersMiniStory: connectedAdvertisersMiniStoryDe,
        report: reportDe,
        errorPopup: errorPopupDe,
        baseInfoScreen: baseInfoScreenDe,
        activitiesInfoScreen: activitiesInfoScreenDe,
        dataStructureInfoScreen: dataStructureInfoScreenDe,
        picturesInfoScreen: picturesInfoScreenDe,
        messagesInfoScreen: messagesInfoScreenDe,
        postReactionInfoScreen: postReactionInfoScreenDe,
        offFacebookInfoScreen: offFacebookInfoScreenDe,
        infographics: infographicsDe,
    },
});
