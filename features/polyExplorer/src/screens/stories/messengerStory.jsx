import React, { useContext } from "react";

import ClusterStory from "../../components/clusterStory/clusterStory.jsx";
import { ExplorerContext } from "../../context/explorer-context.jsx";
import i18n from "../../i18n.js";
import SectionTitle from "../../components/clusterStories/sectionTitle.jsx";
import OrderedList from "../../components/orderedList/orderedList.jsx";
import EntityList from "../../components/entityList/entityList.jsx";

const i18nHeader = "clusterMessengerStory";
const i18nHeaderCommon = "clusterStoryCommon";

const MessengerStory = () => {
    const { products } = useContext(ExplorerContext);

    const summaryBullets = [
        i18n.t(`${i18nHeader}:summary.bullet.1`),
        i18n.t(`${i18nHeader}:summary.bullet.2`),
        i18n.t(`${i18nHeader}:summary.bullet.3`),
    ];

    return (
        <ClusterStory
            progressBarColor="black"
            className="messenger-story"
            primaryColor="#3ba6ff"
            fadingTopBackground={{
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
            <ul>
                {Object.keys(products).map((messenger, index) => (
                    <li key={index}>{messenger}</li>
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
            <div className="chart-container"></div>
            <p>{i18n.t(`${i18nHeader}:overview.paragraph.two`)}</p>
            <SectionTitle
                title={i18n.t(`${i18nHeaderCommon}:section.explore.further`)}
            />
            <EntityList entities={Object.values(products)} expand={true} />
        </ClusterStory>
    );
};

export default MessengerStory;
