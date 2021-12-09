import React, { useContext } from "react";

import DataStory from "../../components/dataStory/dataStory.jsx";
import Summary from "../../components/clusterStories/messengers/summary.jsx";
import Overview from "../../components/clusterStories/messengers/overview.jsx";
import Details from "../../components/clusterStories/messengers/details.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import { StoryParagraph } from "../../components/clusterStories/messengers/storyParagraph.js";

import "./messengerStory.css";

const i18nHeader = "clusterMessengerStory";

const MessengerStory = () => {
    const { products } = useContext(ExplorerContext);

    const listOfMessengerApps = [
        "Facebook Messenger",
        "WhatsApp",
        "Instagram",
        "Signal",
        "Snapchat",
        "Telegram",
        "Threema",
        "TikTok",
        "iMessage",
    ];

    return (
        <DataStory progressBarColor="black" className="messenger">
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
                    {listOfMessengerApps.map((messenger, index) => (
                        <li key={index} className="messenger-el">
                            {messenger}
                        </li>
                    ))}
                </StoryParagraph>
            </div>
            <Summary></Summary>
            <Overview products={products}></Overview>
            <Details
                data={products}
                listOfMessengerApps={listOfMessengerApps}
            ></Details>
        </DataStory>
    );
};

export default MessengerStory;
