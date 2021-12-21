import React, { useContext } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
import Tab from "../../components/clusterStories/tab.jsx";
import MatrixBubblesChart from "../../components/clusterStories/MatrixBubblesChart.jsx";

import "./messengerStory.css";
import OrderedList from "../../components/orderedList/orderedList.jsx";

const i18nHeader = "clusterMessengerStory";

const MessengerStory = () => {
    const { products, globalData } = useContext(ExplorerContext);

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

    const listOfDataCategories = Object.keys(
        globalData.personal_data_categories
    );

    const summaryBullets = [
        i18n.t(`${i18nHeader}:summary.bullet.1`),
        i18n.t(`${i18nHeader}:summary.bullet.2`),
        i18n.t(`${i18nHeader}:summary.bullet.3`),
    ];

    const example = [{ value: 100 }, { value: 200 }, { value: 5000 }];

    console.log(products["Signal"]._data.dataTypesShared);

    // const dataTypes = [
    //     {
    //         data: listOfMessengerApps.map((messenger) => {
    //             return {
    //                 title: messenger,
    //                 bubbles: products[messenger]._data.dataTypesShared.map(
    //                     () => 1
    //                 ),
    //             };
    //         }),
    //     },
    // ];

    return (
        <ClusterStory
            progressBarColor="black"
            className="messenger-story"
            fadingTopBackground={{
                color: "var(--color-primary-messenger-story)",
                distance: "600px",
            }}
        >
            <div className="messenger-intro-background"></div>
            <h1 className="cluster-story-main-title">
                {i18n.t(`${i18nHeader}:title`)}
            </h1>
            <p className="big-first-letter">
                {i18n.t(`${i18nHeader}:intro.paragraph.one`)}
            </p>
            <img
                className="cluster-story-img"
                src="images/stories/messenger/intro-guy.svg"
                alt={i18n.t(`${i18nHeader}:intro.image.alt`)}
            />
            <p>{i18n.t(`${i18nHeader}:intro.paragraph.two`)}</p>
            <ul className="messenger-list">
                {listOfMessengerApps.map((messenger, index) => (
                    <li key={index} className="messenger-el">
                        {messenger}
                    </li>
                ))}
            </ul>
            <h2 className="cluster-story-title">
                {i18n.t(`${i18nHeader}:summary.title`)}
            </h2>
            <SectionTitle
                title={i18n.t(`${i18nHeader}:summary.section`)}
            ></SectionTitle>
            <p className="introduction-summary">
                {i18n.t(`${i18nHeader}:summary.paragraph.one`)}
            </p>
            <OrderedList list={summaryBullets} />
            <SectionTitle
                title={i18n.t(`${i18nHeader}:overview.section`)}
            ></SectionTitle>
            <p>{i18n.t(`${i18nHeader}:overview.paragraph.one`)}</p>
            <Tab>
                <div
                    label={i18n.t(`${i18nHeader}:overview.tab.installs`)}
                ></div>
                <div label={i18n.t(`${i18nHeader}:overview.tab.users`)}></div>
                <div label={i18n.t(`${i18nHeader}:overview.tab.partof`)}></div>
            </Tab>
            <div className="chart-container"></div>
            <p>{i18n.t(`${i18nHeader}:overview.paragraph.two`)}</p>
            <MatrixBubblesChart data={example} />
        </ClusterStory>
    );
};

export default MessengerStory;
