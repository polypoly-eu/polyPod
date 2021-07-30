import React from "react";
import i18n from "../../../i18n";
import { StoryParagraph } from "./storyParagraph";

import "./introduction.css";

const i18nHeader = "clusterMessengerStory";
const listOfMessengerApps = [
    "FB Messenger",
    "iMessage",
    "Instagram",
    "Signal",
    "Snapchat",
    "Telegram",
    "Threema",
    "TikTok",
    "WhatsApp",
];

const Introduction = () => {
    function _getBulletsMessengerApps() {
        return listOfMessengerApps.map((messenger, index) => (
            <li key={index} className="messenger-el">
                {messenger}
            </li>
        ));
    }

    return (
        <div className="messenger-intro">
            <h1 className="story-title">{i18n.t(`${i18nHeader}:title`)}</h1>
            <StoryParagraph as="p" className="one">
                {i18n.t(`${i18nHeader}:intro.paragraph.one`)}
            </StoryParagraph>
            <img
                className="story-intro-img"
                src="images/stories/messenger/intro-guy.svg"
                alt={i18n.t(`${i18nHeader}:intro.image.alt`)}
            />
            <StoryParagraph as="p" className="two upper">
                {i18n.t(`${i18nHeader}:intro.paragraph.two`)}
            </StoryParagraph>
            <StoryParagraph as="ul" className="messenger-list upper">
                {_getBulletsMessengerApps()}
            </StoryParagraph>
        </div>
    );
};

export default Introduction;
